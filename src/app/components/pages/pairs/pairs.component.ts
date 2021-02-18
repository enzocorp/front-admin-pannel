import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Subscription} from "rxjs";
import {Paginate} from "../../../models/pagination";
import {ActivatedRoute, Router} from "@angular/router";
import {SymbolsService} from "../../../services/http/symbols.service";
import {CryptoService} from "../../../services/http/crypto.service";
import {Pair} from "../../../models/pair";
import {PairsService} from "../../../services/http/pairs.service";
import {ConfigService} from "../../../services/autre/config.service";
import {graphConfig} from "../../../models/global";


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
    private router : Router,
    private configServ : ConfigService
  ) { }

  private subscription : Subscription = new Subscription()
  pairs : Array<PairPlus> = []
  colors = ['green','default','gold','orange','red']
  strSeverities  : string[]
  pagination : {total : number,paginate : Paginate, index : number} = {
    total : null,
    paginate : {limit : 20, skip : 0 },
    index : 1
  }
  loading : boolean = true
  request : Paginate&Record<number,Object> = {
    skip : this.pagination.paginate.skip,
    limit : this.pagination.paginate.limit,
    0 :{$group :{_id: "$pair", markets: { $push: {market :"$market", excl : "$exclusion.isExclude"} }}},
    1 :{$lookup: { from: "pairs",localField: "_id",foreignField: "name", as: "pair"}},
    2 :{$unwind: "$pair"},
    3 :{$match: {}}, //Gérer par le filtreur

    4 :{$addFields: {markets : {$filter: {input: "$markets",as: "item",cond: { $eq: [ "$$item.excl", false ] }}}  }},/*Permet
    de ne récupérer que les market des symbols non-exclus qui utilisent cette paire */
    5 :{$lookup: {from: "markets", localField: "markets.market", foreignField: "name", as: "markets"}},
    6 :{$addFields: { markets : { $filter: {//Permet de ne récupérer que les markets non-exclus qui utilisent cette paire
            input: "$markets",
            as: "item",
            cond: { $eq: [ "$$item.exclusion.isExclude", false ]}
          }}}},
    7:{$project: {pair :1,_id :0, marketsUsed : {$size: "$markets"}}},
    8:{$sort : {}} //Gérer par le filtreur
  }
  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<string>();
  arrChecked : Pair[] = []
  isfor : number

  ngOnInit(): void {
    this.subscription.add(this.pairsService.pairsSubject.subscribe((pairs : PairPlus[])=> this.pairs = pairs ))
    this.cryptoServ.getSeverities().subscribe(
      ({data})=> {
        this.strSeverities = data.sort((a, b) => a.severity - b.severity).map(severity => severity.description)
      })
    this.subscription.add(this.configServ.isforSubject.subscribe((graph: graphConfig)=> {
      this.isfor = graph.isfor
    } ))

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
      (resp: resp_data ) => {
        let pairPlus : PairPlus[] = resp ? resp.data.map(({pair,marketsUsed}) => ({
          ...pair,
          marketsUsed
        })) : []
        this.pairsService.emmitPairs(pairPlus)
        this.pagination.total = resp?.metadata.total || 0
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

  onReset(){
    this.pairsService.resetMoyennes().subscribe(
      () => this.onUpdate()
    )
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

}
