import {Component, OnDestroy, OnInit} from '@angular/core';
import {Best} from "../../../../models/best";
import {Pair} from "../../../../models/pair";
import {ActivatedRoute, Router} from "@angular/router";
import {BehaviorSubject, Subject, Subscription} from "rxjs";
import {Market} from "../../../../models/market";
import {MarketsService} from "../../../../services/http/markets.service";
import {BestsService} from "../../../../services/http/bests.service";
import {PairsService} from "../../../../services/http/pairs.service";
import {Asset} from "../../../../models/asset";
import {ConfigService} from "../../../../services/autre/config.service";
import {GraphConfig} from "../../../../models/graphConfig";

interface exclusion {
  market : string
  reasons : string[]
  severity : number
  note? : string
}

interface BestPlus extends Omit<Best,'pair'|'base'|'quote'> {
  pair : Pair
  base : Asset
  quote : Asset
}

@Component({
  selector: 'app-show-best',
  templateUrl: './best.component.html',
  styleUrls: ['./best.component.scss']
})
export class BestComponent implements OnInit, OnDestroy {

  private subscription = new Subscription()


  constructor(private bestsServ : BestsService,
              private marketsServ : MarketsService,
              private pairsServ : PairsService,
              private activatedRoute : ActivatedRoute,
              private router : Router,
              private configServ : ConfigService
  ) { }

  chartBestSubject = new BehaviorSubject<BestPlus>(undefined)
  graphConfig : GraphConfig
  pair : Pair
  best : BestPlus
  visible : boolean = false
  body : exclusion
  requestBest: any = [
    {$match: {name : this.activatedRoute.snapshot.paramMap.get('id')}},
    {$lookup: {from: "pairs", localField: "pair", foreignField: "name", as: "pair"}},
    {$lookup: {from: "assets", localField: "base", foreignField: "name", as: "base"}},
    {$lookup: {from: "assets", localField: "quote", foreignField: "name", as: "quote"}},
    {$unwind : "$pair"},
    {$unwind : "$base"},
    {$unwind : "$quote"},
  ]
  marketsBuy : Market
  marketsSell : Market

  ngOnInit(): void {

    this.onUpdate()
  }

  onUpdate(){
    this.subscription.add(this.configServ.isforSubject.subscribe(graphconf => this.graphConfig = graphconf) )
    this.bestsServ.getBests(this.requestBest).subscribe(
      ({data} : {data : [BestPlus]} = null) => {
        this.visible = true
        this.best = data[0]
        this.chartBestSubject.next(this.best)
        let setMarkets = new Set<string>()
        setMarkets.add(this.best.isfor[this.graphConfig.isfor].buy.market)
        setMarkets.add(this.best.isfor[this.graphConfig.isfor].sell.market)

        this.marketsServ.getMarkets([{$match: {name: {$in: [...setMarkets]}}}]).subscribe(
          ({data : markets} : {data : Market[]}) => {
            this.marketsBuy = markets.find(market => market.name === this.best.isfor[this.graphConfig.isfor].buy.market)
            this.marketsSell = markets.find(market => market.name === this.best.isfor[this.graphConfig.isfor].sell.market)
          }
        )
      }
    )
  }

  close(): void {
    this.visible = false
    setTimeout(() => this.router.navigate(
      ['../'],
      { relativeTo: this.activatedRoute }), 250);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }
}
