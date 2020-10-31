import {Component, OnDestroy, OnInit} from '@angular/core';
import {Best} from "../../../models/best";
import {CryptoService} from "../../../services/http/crypto.service";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";
import {BestsService} from "../../../services/http/bests.service";
import {MongoPaginate, Paginate} from "../../../models/pagination";

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
  pagination : {total : number, loading : boolean, paginate : Paginate, index : number} = {
    total : null,
    loading : false,
    paginate : {limit : 30, skip : 0 },
    index : 1
  }
  request : Partial<MongoPaginate> = {
    sort : {_id : 1},
    match: {}
  }

  constructor(
    private bestService : BestsService,
  ) { }

  ngOnInit(): void {
    this.pagination.loading = true
    this.subscription.add(this.bestService.bestsSubject.subscribe(
      (bests : Best[])=> {
        this.bests = bests
        this.pagination.loading = false
      }))
    this.getLasts()
    this.bestService.getBests({limit : 1, skip : 0}).subscribe(
      resp => this.totalCollectionBest = resp.metadata[0]?.total || 0
    )
  }

  calculBests(){
    this.pagination.loading = true
    this.bestService.calculBests().subscribe(
      resp => {
        this.groupId = resp.data
        this.onUpdate()
      }
    )
  }

  resetBest(){
    this.bestService.resetBests().subscribe(
      ()=> this.onUpdate()
    )
  }

  onUpdate(){
    if(this.groupId !== null){
      this.request.match['groupId']  = this.groupId
      this.request = {...this.request,...this.pagination.paginate}
      this.bestService.getBests(this.request).subscribe(
        (resp) => {
          this.bestService.emmitBests(resp.data)
          this.pagination.total = resp.metadata[0]?.total || 0
        }
      )
    }
  }

  getLasts(){
    this.bestService.getBests({limit : 1, skip : 0, sort : { _id : -1 } }).subscribe(
      resp => {
        this.groupId = resp.data[0]?.groupId
        this.onUpdate()
      }
    )
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

}
