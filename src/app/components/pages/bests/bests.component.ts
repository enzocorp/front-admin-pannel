import {Component, OnDestroy, OnInit} from '@angular/core';
import {Best} from "../../../models/best";
import {Subscription} from "rxjs";
import {BestsService} from "../../../services/http/bests.service";
import {Paginate} from "../../../models/pagination";

@Component({
  selector: 'app-bests',
  templateUrl: './bests.component.html',
  styleUrls: ['./bests.component.scss']
})
export class BestsComponent implements OnInit, OnDestroy{


  private subscription : Subscription = new Subscription()
  totalCollectionBest = undefined
  bests : Best[] = []
  groupId : string = null
  loading : boolean = false
  pagination : {total : number, paginate : Paginate, index : number} = {
    total : null,
    paginate : {limit : 30, skip : 0 },
    index : 1
  }

  request : any = {
    skip : this.pagination.paginate.skip,
    limit : this.pagination.paginate.limit,
    0 : {$match : {}},
    1 : {$sort : {"for15k.spread_usd" : -1}},
  }

  constructor(
    private bestService : BestsService,
  ) { }

  ngOnInit(): void {
    this.subscription.add(this.bestService.bestsSubject.subscribe(
      (bests : Best[])=> {
        this.bests = bests
      }))
    this.getLatest()
    this.getTotalDocs()
  }

  onUpdate(){
    if(this.groupId !== null){
      if (!this.loading) this.loading = true
      this.request = {
        ...this.request,
        ...this.pagination.paginate,
         0 : {$match : { ...this.request[0].$match, groupId : this.groupId }} }
      this.bestService.getBests(this.request).subscribe(
        (resp) => {
          this.bestService.emmitBests(resp?.data || [])
          this.pagination.total = resp?.metadata?.total || 0
          this.loading = false
        },
        () => null,
        ()=> this.loading = false
      )}
  }

  calculBests(){
    this.loading = true
    this.bestService.calculBests().subscribe(
      () => {
        this.getLatest()
        this.getTotalDocs()
      },
      null,
      ()=>this.loading = false
    )
  }

  getTotalDocs(){
    this.bestService.getBests([{$count : "total"}]).subscribe(
      resp => this.totalCollectionBest = resp.data[0]?.total || 0
    )
  }

  resetBest(){
    this.bestService.resetBests().subscribe(()=> {
      this.getTotalDocs()
      this.onUpdate()
    } )
  }

  getLatest(){
    this.bestService.getLastGroupId().subscribe(
      resp => {
        this.groupId = resp.data
        this.onUpdate()
      })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

}
