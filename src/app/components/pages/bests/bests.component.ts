import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Best} from "../../../models/best";
import {Subject, Subscription} from "rxjs";
import {BestsService} from "../../../services/http/bests.service";
import {Paginate} from "../../../models/pagination";
import {graphConfig} from "../../../models/global";
import {ConfigService} from "../../../services/autre/config.service";
import {Podium} from "../../../models/podium";
import * as process from "process";

@Component({
  selector: 'app-bests',
  templateUrl: './bests.component.html',
  styleUrls: ['./bests.component.scss']
})
export class BestsComponent implements OnInit, OnDestroy{



  constructor(
    private bestService : BestsService,
    private configServ : ConfigService
  ) { }

  private subscription : Subscription = new Subscription()
  not = {
    enought_volume : null,
    spread_quote : undefined,
    data_orderbook : undefined,
    baseusd_infos : undefined
  }
  chartPodiumSubject = new Subject<Podium[]>()
  totalCollectionBest = undefined
  bests : Best[] = []
  groupId : string = null
  loading : boolean = false
  graphCongig : graphConfig
  pagination : {total : number, paginate : Paginate, index : number} = {
    total : null,
    paginate : {limit : 30, skip : 0 },
    index : 1
  }

  request : any = {
    skip : this.pagination.paginate.skip,
    limit : this.pagination.paginate.limit,
    0 : {$match : {}},
    1 : {$sort :{}}
  }


  ngOnInit(): void {
    this.subscription.add(this.bestService.bestsSubject.subscribe((bests : Best[])=> {
      this.bests = bests
      if(bests[0] && bests[0].groupId){
        this.bestService.getPodium(bests[0].groupId).subscribe(({data}) => this.chartPodiumSubject.next(data))
      }

    } ))
    this.subscription.add(this.configServ.isforSubject.subscribe( graphconf => {
      this.graphCongig = graphconf
    } ))
    this.request[1] = {$sort : {[`isfor.${this.graphCongig.isfor}.spread_usd`] : -1}}
    this.getLatest()
    this.getTotalDocs()
  }

  onUpdate(){
    if(this.groupId !== null){
      if (!this.loading) this.loading = true
      this.request = {
        ...this.request,
        ...this.pagination.paginate,
         0 : {$match : { ...this.request[0].$match, groupId : this.groupId }}
      }
      this.bestService.getBests(this.request).subscribe(
        (resp) => {
          this.bestService.emmitBests(resp?.data || [])
          this.pagination.total = resp?.metadata?.total || 0
          this.loading = false
        },
        () => null,
        ()=> this.loading = false
      )
    }
  }

  calculBests(){
    this.loading = true
    this.bestService.calculBests().subscribe({
      next : () => {
        this.getLatest()
        this.getTotalDocs()
      },
      complete : ()=> this.loading = false
    })
  }

  getTotalDocs(){
    this.bestService.getBests([{$count : "total"}]).subscribe(
      resp => this.totalCollectionBest = resp.data[0]?.total || 0
    )
  }

  resetBests(){
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
