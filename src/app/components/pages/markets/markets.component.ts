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
interface MarketPlus extends Market{
  selected: number
  used: number
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
  request : Record<number, Object>&Paginate= {
    ...this.pagination.paginate ,
    0 : {$match : {}},
    1 : {$sort : {_id : 1}}
  }
  request2 = [
    {$group : {
      _id: "$market",
      exclusions: { $push: "$exclusion.isExclude" }
    }}
  ]
  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<string>();
  arrayCheckedMarkets : Market[] = []

  ngOnInit(): void {
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

  onGroupUpdate(){
    this.onUpdate()
    this.onAllChecked(false)
  }

  onUpdate(){
    if (!this.loading)
      this.loading = true

    this.request = {...this.request,...this.pagination.paginate}
    const $gethttp : Observable<{ markets: {data : Market[], metadata? : any },pairsByMarket: {data : any[]} }> = forkJoin(
      this.marketsService.getMarkets(this.request),
      this.symbolsServ.getSymbols(this.request2),
    ).pipe(
      map(([markets,pairsByMarket])=>({markets,pairsByMarket})))
    $gethttp.subscribe(
      ({markets,pairsByMarket}) =>  {
        const exclusions : Array<{_id: string, exclusions : boolean[]}> = pairsByMarket.data
        const marketsPlus : MarketPlus[] = markets.data.map(market => {
          const obj =  exclusions.find(forMarket => forMarket._id === market.name)
          return {
            ...market,
            selected : obj?.exclusions.length,
            used : obj?.exclusions.filter(bool => bool=== false).length
          }
        })
        this.marketsService.emmitMarkets(marketsPlus)
        this.pagination.total = markets.metadata?.total || 0
      })
  }


  /*----------------------Tableau---------------------*/
  updateCheckedSet(name: string, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(name);
    } else {
      this.setOfCheckedId.delete(name);
    }
  }

  refreshCheckedStatus(): void {
    this.checked = this.markets.every(({ name }) => this.setOfCheckedId.has(name));
    this.indeterminate = this.markets.some(({ name }) => this.setOfCheckedId.has(name)) && !this.checked;
    this.arrayCheckedMarkets = this.markets.filter(market => this.setOfCheckedId.has(market.name) )
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
