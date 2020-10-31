import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Market} from "../../../models/market";
import {Subscription} from "rxjs";
import {MongoPaginate, Paginate} from "../../../models/pagination";
import {ActivatedRoute, Router} from "@angular/router";
import {MarketsService} from "../../../services/http/markets.service";

@Component({
  selector: 'app-markets',
  templateUrl: './markets.component.html',
  styleUrls: ['./markets.component.scss']
})

export class MarketsComponent implements OnInit,OnDestroy,AfterViewInit {

  constructor(
    private http : HttpClient,
    private marketsService : MarketsService,
    private activatedRoute : ActivatedRoute,
    private router : Router
  ) { }

  private subscription : Subscription = new Subscription()
  markets : Market[] = []
  pagination : {total : number, loading : boolean, paginate : Paginate, index : number} = {
    total : null,
    loading : false,
    paginate : {limit : 20, skip : 0 },
    index : 1
  }
  request : Partial<MongoPaginate> = {
    sort : {_id : 1},
  }
  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<string>();
  arrayCheckedMarkets : Market[] = []

  ngOnInit(): void {
    this.subscription.add(this.marketsService.marketsSubject.subscribe(
      (markets : Market[])=> {
        this.markets = markets
        this.pagination.loading = false
      }))
  }
  ngAfterViewInit(){
    this.onUpdate()
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

  /*-----------------------On update ----------------------------------*/
  onGroupUpdate(){
    this.onUpdate()
    this.onAllChecked(false)
  }

  onUpdate(){
    this.request = {...this.request,...this.pagination.paginate}
    this.marketsService.getMarkets(this.request).subscribe(
      (resp) => {
        this.marketsService.emmitMarkets(resp.data)
        this.pagination.total = resp.metadata[0]?.total || 0
      }
    )
  }

  navigate(str : string){ //Pour mettre a jour la liste des markets depuis la page "market"
    const request = JSON.stringify(this.request)
    this.router.navigate([str], {relativeTo : this.activatedRoute ,queryParams : {request}}).then()
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

}
