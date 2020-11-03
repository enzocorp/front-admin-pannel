import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Market} from "../../../models/market";
import {Subscription} from "rxjs";
import {Paginate} from "../../../models/pagination";
import {ActivatedRoute, Router} from "@angular/router";
import {MarketsService} from "../../../services/http/markets.service";
import {CryptoService} from "../../../services/http/crypto.service";
import {SymbolsService} from "../../../services/http/symbols.service";

interface MarketPlus extends Market{
  pairsUsed: number
}

interface resp_data {
  metadata : {total : number},
  data : Array<{market : Market,pairsUsed : number}>
}
@Component({
  selector: 'app-markets',
  templateUrl: './markets.component.html',
  styleUrls: ['./markets.component.scss']
})

export class MarketsComponent implements OnInit,OnDestroy {

  constructor(
    private http : HttpClient,
    private marketsService : MarketsService,
    private symbolsServ : SymbolsService,
    private cryptoServ : CryptoService,
    private activatedRoute : ActivatedRoute,
    private router : Router
  ) { }

  private subscription : Subscription = new Subscription()
  markets : Array<MarketPlus> = []
  colors = ['green','default','gold','orange','red']
  strSeverities  : string[]
  pagination : {total : number,paginate : Paginate, index : number} = {
    total : null,
    paginate : {limit : 20, skip : 0 },
    index : 1
  }
  loading : boolean = false
  request : Paginate&Record<number,Object> = {
    skip : this.pagination.paginate.skip,
    limit : this.pagination.paginate.limit,
    0 : {$group :{_id: "$market", pairs: { $push: {pair :"$pair", excl : "$exclusion.isExclude"} }}},
    1 :{$lookup: { from: "markets",localField: "_id",foreignField: "name", as: "market"}},
    2 :{$unwind: "$market"},
    3 :{$match: {}},
    4 :{$addFields: {pairs : {$filter: {input: "$pairs",as: "item",cond: { $eq: [ "$$item.excl", false ] }}}  }},
    5 :{$lookup: {from: "pairs", localField: "pairs.pair", foreignField: "name", as: "pairs"}},
    6 :{$addFields: { pairs : { $filter: {
            input: "$pairs",
            as: "item",
            cond: { $eq: [ "$$item.exclusion.isExclude", false ]}
    }}}},
    7:{$project: { market :1,_id :0,pairsUsed : {$size: "$pairs"}}},
    8:{$sort : {"market._id" : 1}}
  }
  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<string>();
  arrChecked : Market[] = []

  ngOnInit(): void {
    this.subscription.add(this.marketsService.marketsSubject.subscribe((markets : MarketPlus[])=> this.markets = markets ))
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
      (resp: resp_data) => {
        let marketPlus : MarketPlus[] = resp ? resp.data.map(({market,pairsUsed}) => ({
          ...market,
          pairsUsed
        })) : []
        this.marketsService.emmitMarkets(marketPlus)
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
      this.arrChecked.push(this.markets.find(market => market.name === name))
    } else {
      this.setOfCheckedId.delete(name);
      this.arrChecked = this.arrChecked.filter(market => market.name !== name)
    }
  }

  refreshCheckedStatus(): void {
    this.checked = this.markets.every(({ name }) => this.setOfCheckedId.has(name));
    this.indeterminate = (!!this.arrChecked.length && !this.checked) ||
      (!!this.arrChecked.length && !this.markets.some(({ name }) => this.setOfCheckedId.has(name)))
  }

  onItemChecked(name: string, checked: boolean): void {
    this.updateCheckedSet(name, checked);
    this.refreshCheckedStatus();
  }

  onAllChecked(checked: boolean): void {
    this.markets.forEach(({ name }) => this.updateCheckedSet(name, checked));
    this.refreshCheckedStatus();
  }

  /*--------------------- Navigation ------------------------*/

  navigate(str : string){ //Pour mettre a jour la liste des markets depuis la page "market"
    const request = JSON.stringify(this.request)
    this.router.navigate([str], {relativeTo : this.activatedRoute ,queryParams : {request}}).then()
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }
}
