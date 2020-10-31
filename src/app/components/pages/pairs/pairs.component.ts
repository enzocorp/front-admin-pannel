import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Pair} from "../../../models/pair";
import {Subscription} from "rxjs";
import {MongoPaginate, Paginate} from "../../../models/pagination";
import {ActivatedRoute, Router} from "@angular/router";
import {PairsService} from "../../../services/http/pairs.service";

@Component({
  selector: 'app-pairs',
  templateUrl: './pairs.component.html',
  styleUrls: ['./pairs.component.scss']
})

export class PairsComponent implements OnInit,OnDestroy,AfterViewInit {

  constructor(
    private http : HttpClient,
    private pairsService : PairsService,
    private activatedRoute : ActivatedRoute,
    private router : Router
  ) { }

  private subscription : Subscription = new Subscription()
  pairs : Pair[] = []
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
  arrayCheckedPairs : string[] = []

  ngOnInit(): void {
    this.subscription.add(this.pairsService.pairsSubject.subscribe(
      (pairs : Pair[])=> {
        this.pairs = pairs
        this.pagination.loading = false
      }))
  }
  ngAfterViewInit(){
    this.onUpdate()
  }

  onResetMoyennes(){
    this.pairsService.resetMoyennes().subscribe(
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
    this.checked = this.pairs.every(({ name }) => this.setOfCheckedId.has(name));
    this.indeterminate = this.pairs.some(({ name }) => this.setOfCheckedId.has(name)) && !this.checked;
    this.arrayCheckedPairs = [... this.setOfCheckedId.values()]
  }

  onItemChecked(name: string, checked: boolean): void {
    this.updateCheckedSet(name, checked);
    this.refreshCheckedStatus();
  }

  onAllChecked(checked: boolean): void {
    this.pairs.forEach(({ name }) => this.updateCheckedSet(name, checked));
    this.refreshCheckedStatus();
  }

  afterGroupSubmit(){
    this.onUpdate()
    this.onAllChecked(false)
  }

/*-----------------------On update ----------------------------------*/
  onUpdate(){
    this.request = {...this.request,...this.pagination.paginate}
    this.pairsService.getPairs(this.request).subscribe(
      (resp) => {
        console.log('resp.data :: ',resp.data)
        this.pairsService.emmitPairs(resp.data)
        this.pagination.total = resp.metadata[0]?.total || 0
      }
    )
  }

  navigate(str : string){ //Pour mettre a jour la liste des pairs depuis la page "pair"
    const request = JSON.stringify(this.request)
    this.router.navigate([str], {relativeTo : this.activatedRoute ,queryParams : {request}}).then()
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

  test(){
    this.onUpdate()
    console.log(this.request)
  }

}
