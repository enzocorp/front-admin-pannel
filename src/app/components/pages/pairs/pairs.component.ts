import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Subscription} from "rxjs";
import {Paginate} from "../../../models/pagination";
import {ActivatedRoute, Router} from "@angular/router";
import {SymbolsService} from "../../../services/http/symbols.service";
import {CryptoService} from "../../../services/http/crypto.service";
import {Pair} from "../../../models/pair";
import {PairsService} from "../../../services/http/pairs.service";


interface PairPlus extends Pair{
  marketsUsed: number
}

interface resp_data {
  metadata : {total : number},
  data : Array<{pair : Pair,marketsUsed : number}>
}

@Component({
  selector: 'app-pairs',
  templateUrl: './pairs.component.html',
  styleUrls: ['./pairs.component.scss']
})

export class PairsComponent implements OnInit,OnDestroy {


  constructor(
    private http : HttpClient,
    private pairsService : PairsService,
    private symbolsServ : SymbolsService,
    private cryptoServ : CryptoService,
    private activatedRoute : ActivatedRoute,
    private router : Router
  ) { }

  private subscription : Subscription = new Subscription()
  pairs : Array<PairPlus> = []
  colors = ['green','default','gold','orange','red']
  strSeverities  : string[]
  isFor : 'for1k' | 'for15k' | 'for30k' = 'for15k'
  pagination : {total : number,paginate : Paginate, index : number} = {
    total : null,
    paginate : {limit : 20, skip : 0 },
    index : 1
  }
  loading : boolean = false
  request : Paginate&Record<number,Object> = {
    skip : this.pagination.paginate.skip,
    limit : this.pagination.paginate.limit,
    0 :{$group :{_id: "$pair", markets: { $push: {market :"$market", excl : "$exclusion.isExclude"} }}},
    1 :{$lookup: { from: "pairs",localField: "_id",foreignField: "name", as: "pair"}},
    2 :{$unwind: "$pair"},
    3 :{$match: {}},
    4 :{$addFields: {markets : {$filter: {input: "$markets",as: "item",cond: { $eq: [ "$$item.excl", false ] }}}  }},
    5 :{$lookup: {from: "markets", localField: "markets.market", foreignField: "name", as: "markets"}},
    6 :{$addFields: { markets : { $filter: {
            input: "$markets",
            as: "item",
            cond: { $eq: [ "$$item.exclusion.isExclude", false ]}
          }}}},
    7:{$project: {pair :1,_id :0, marketsUsed : {$size: "$markets"}}},
    8:{$sort : {"pair._id" : 1}}
  }
  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<string>();
  arrChecked : Pair[] = []

  ngOnInit(): void {
    this.subscription.add(this.pairsService.pairsSubject.subscribe((pairs : PairPlus[])=> this.pairs = pairs ))
    this.cryptoServ.getSeverities().subscribe(
      ({data})=> {
        this.onUpdate()
        this.strSeverities = data.sort((a, b) => a.severity - b.severity).map(severity => severity.description)
      })
  }

  /*-----------------------On update ----------------------------------*/

  onGroupUpdate(){
    this.onUpdate()
    this.setOfCheckedId.clear()
    this.arrChecked = []
    this.setOfCheckedId.clear()
    this.refreshCheckedStatus()
  }

  onUpdate(){
    if (!this.loading)
      this.loading = true

    this.request = {...this.request,skip : this.pagination.paginate.skip, limit : this.pagination.paginate.limit}
    this.symbolsServ.getSymbols(this.request).subscribe(
      ({data, metadata}: resp_data) => {
        console.log(data)
        let pairPlus : PairPlus[] = data.map(({pair,marketsUsed}) => ({
          ...pair,
          marketsUsed
        }))
        this.pairsService.emmitPairs(pairPlus)
        this.pagination.total = metadata.total
        this.refreshCheckedStatus()
        this.loading = false
      }
    )
  }


  /*----------------------Tableau---------------------*/
  updateCheckedSet(name: string, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(name);
      this.arrChecked.push(this.pairs.find(pair => pair.name === name))
    } else {
      this.setOfCheckedId.delete(name);
      this.arrChecked = this.arrChecked.filter(pair => pair.name !== name)
    }
  }

  refreshCheckedStatus(): void {
    this.checked = this.pairs.every(({ name }) => this.setOfCheckedId.has(name));
    this.indeterminate = (!!this.arrChecked.length && !this.checked) ||
      (!!this.arrChecked.length && !this.pairs.some(({ name }) => this.setOfCheckedId.has(name)))
  }

  onItemChecked(name: string, checked: boolean): void {
    this.updateCheckedSet(name, checked);
    this.refreshCheckedStatus();
  }

  onAllChecked(checked: boolean): void {
    this.pairs.forEach(({ name }) => this.updateCheckedSet(name, checked));
    this.refreshCheckedStatus();
  }

  /*--------------------- Navigation ------------------------*/

  navigate(str : string){ //Pour mettre a jour la liste des pairs depuis la page "pair"
    const request = JSON.stringify(this.request)
    this.router.navigate([str], {relativeTo : this.activatedRoute ,queryParams : {request}}).then()
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

}
