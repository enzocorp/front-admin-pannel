import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Market} from "../../../models/market";
import {forkJoin, Observable, Subscription} from "rxjs";
import {MongoPaginate, Paginate} from "../../../models/pagination";
import {ActivatedRoute, Router} from "@angular/router";
import {MarketsService} from "../../../services/http/markets.service";
import {CryptoService} from "../../../services/http/crypto.service";
import {RequesterApi} from "../../../services/autre/requesterApi";
import {map} from "rxjs/operators";
import {SymbolsService} from "../../../services/http/symbols.service";
import {log, mergeDateConfig} from "ng-zorro-antd";
interface MarketPlus extends Market{
  selected: number
  used: number
}

interface resp_data {
  metadata : {total : number},
  data : Array<{pairs : string[],market : Market, _id : string}>
  excl : Array<{_id : string}>
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
  request : Array<any>
  nestedRequest : Object = {
    0 : {$group: {_id: "$market", pairs: {$push: "$pair"}}},
    1 : {$lookup: {from: "markets",localField: "_id", foreignField: "name", as: "market"}},
    2 : {$unwind: "$market"},
    3 : {$match : {}},
    4 : {$sort : {_id : 1}},
  }
  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<string>();
  arrChecked : Market[] = []

  ngOnInit(): void {
    this.cryptoServ.getSeverities().subscribe(
      ({data})=> this.strSeverities = data.sort((a,b)=> a.severity - b.severity).map(severity => severity.description)
    )
    this.subscription.add(this.marketsService.marketsSubject.subscribe(
      (markets : MarketPlus[])=> {
        this.markets = markets
        this.loading = false
      } ))
    this.cryptoServ.getSeverities().subscribe(
      ({data})=> this.strSeverities = data.sort((a,b)=> a.severity - b.severity).map(severity => severity.description)
    )
    this.onUpdate()
  }

  /*-----------------------On update ----------------------------------*/

  makeRequest () : void{
    this.request = [
      {$facet: {
          metadata: [
            ...Object.values(this.nestedRequest)/*.slice(0,-3),*/,
            {$count : "total"}
            ],
          data: [
            ...Object.values(this.nestedRequest),
            {$skip: this.pagination.paginate.skip},
            {$limit: this.pagination.paginate.limit}
          ],
          excl: [
            {$match: {"exclusion.isExclude": false}},
            {$group: {_id: "$pair"}},
            {$lookup: {from: "pairs", localField: "_id", foreignField: "name", as: "pair"}},
            {$unwind: "$pair"},
            {$match: {"pair.exclusion.isExclude": true}},
            {$project:  {_id : 1}}
          ]
        }},
      {$unwind : "$metadata"}
    ]
  }

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

    this.makeRequest()
    this.symbolsServ.getSymbols(this.request).subscribe(
      ({data : tabdata}: { data : any  }) => {
        const [objdata] = tabdata
        const {metadata,data,excl} : resp_data = objdata
        let marketPlus : MarketPlus[] = data.map(item => {
          const exclus : number = item.pairs.filter(name => excl.find(item2=> item2._id === name)).length
          return {
            ...item.market,
            selected : item.pairs.length,
            used : item.pairs.length - exclus
          }
        })
        this.marketsService.emmitMarkets(marketPlus)
        this.pagination.total = metadata.total
        this.refreshCheckedStatus()
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
    const request = JSON.stringify(this.nestedRequest)
    this.router.navigate([str], {relativeTo : this.activatedRoute ,queryParams : {request}}).then()
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }
}
