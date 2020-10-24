
import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {MongoPaginate, Paginate} from "../../../models/pagination";
import {Exchange} from "../../../models/exchange";
import {MarketService} from "../../../services/http/market.service";
import {Reason, Severity} from "../../../models/exclusionPair";
import {ExclusionService} from "../../../services/http/exclusion.service";

interface lookup_market extends Exchange{
  paires_actives : { total : number }
}

@Component({
  selector: 'app-markets',
  templateUrl: './markets.component.html',
  styleUrls: ['./markets.component.scss']
})
export class MarketsComponent implements OnInit {

  constructor(
    private http : HttpClient,
    private marketService : MarketService,
    private activatedRoute : ActivatedRoute,
    private exclusionServ : ExclusionService,
    private router : Router
  ) { }

  severities : Severity[] = []
  reasons : Reason[] = []
  color = ['default','gold','orange','red']

  private subscription : Subscription = new Subscription()
  markets : lookup_market[] = []
  pagination : {total : number, loading : boolean, paginate : Paginate, index : number} = {
    total : null,
    loading : false,
    paginate : {limit : 20, skip : 0 },
    index : 1
  }
  request : MongoPaginate = {
    sort : {_id : 1},
    lookups :
      [{
        from: "pairs",
        let : {exid : "$id_exchange"},
        pipeline : [
          { $match: { $expr: { $in: [ "$$exid", "$exchanges.id" ] }, "exclusion.pairIsExclude" : false} },
          { $match: { $expr: { $not: [{ $in: [ "$$exid", "$exclusion.fromMarkets.market" ] }]} } },
          { $count: "total" }
        ],
        as: "total"
      }],
    addFields : {paires_actives : {$arrayElemAt: ["$total",0]} }
  }
  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<string>();
  arrayCheckedMarket : string[] = []

  ngOnInit(): void {
    this.exclusionServ.getSeverities().subscribe(
      resp => this.severities = resp.reverse()
    )
    this.subscription.add(this.marketService.marketsSubject.subscribe(
      (markets : lookup_market[])=> {
        this.markets = markets
        this.pagination.loading = false
      }))
    this.onUpdate()
  }

  onResetMoyennes(){
    this.marketService.resetMoyennes().subscribe(
      () => this.onUpdate()
    )
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
    this.checked = this.markets.every(({ id_exchange }) => this.setOfCheckedId.has(id_exchange));
    this.indeterminate = this.markets.some(({ id_exchange }) => this.setOfCheckedId.has(id_exchange)) && !this.checked;
    this.arrayCheckedMarket = [... this.setOfCheckedId.values()]
  }

  onItemChecked(name: string, checked: boolean): void {
    this.updateCheckedSet(name, checked);
    this.refreshCheckedStatus();
  }

  onAllChecked(checked: boolean): void {
    this.markets.forEach(({ id_exchange }) => this.updateCheckedSet(id_exchange, checked));
    this.refreshCheckedStatus();
  }

  afterGroupSubmit(){
    this.onUpdate()
    this.onAllChecked(false)
  }

  /*-------------------- Rafraichir -------------------------*/
  onUpdate(){
    this.request = {...this.request,...this.pagination.paginate}
    this.marketService.getMarkets(this.request).subscribe(
      (resp) => {
        this.marketService.emmitMarkets(resp.data)
        this.refreshCheckedStatus()
        this.pagination.total = resp.metadata[0]?.total || 0
      }
    )
  }

  navigate(str : string){ //Pour mettre a jour la liste des markets depuis la page "market"
    const request = JSON.stringify(this.request)
    this.router.navigate([str], {relativeTo : this.activatedRoute ,queryParams : {request}})
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

}
