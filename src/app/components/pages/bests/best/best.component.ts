import {Component, OnDestroy, OnInit} from '@angular/core';
import {Best} from "../../../../models/best";
import {Pair} from "../../../../models/pair";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {Market} from "../../../../models/market";
import {MarketsService} from "../../../../services/http/markets.service";
import {BestsService} from "../../../../services/http/bests.service";
import {PairsService} from "../../../../services/http/pairs.service";
import {Asset} from "../../../../models/asset";

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
  ) { }

  pair : Pair
  best : BestPlus
  visible : boolean = false
  body : exclusion
  isFor : 'for1k'|'for15k'|'for30k' = "for1k"
  requestBest: any = [
    {$match: {name : this.activatedRoute.snapshot.paramMap.get('id')}},
    {$lookup: {from: "pairs", localField: "pair", foreignField: "name", as: "pair"}},
    {$lookup: {from: "assets", localField: "base", foreignField: "name", as: "base"}},
    {$lookup: {from: "assets", localField: "quote", foreignField: "name", as: "quote"}},
    {$unwind : "$pair"},
    {$unwind : "$base"},
    {$unwind : "$quote"},
  ]
  marketsBuy : {
    for1k : Market
    for15k : Market
    for30k : Market
  } = {for1k: undefined, for15k : undefined, for30k : undefined}
  marketsSell : {
    for1k : Market
    for15k : Market
    for30k : Market
  } = {for1k: undefined, for15k : undefined, for30k : undefined}

  ngOnInit(): void {
    this.onUpdate()
  }

  onUpdate(){
    this.bestsServ.getBests(this.requestBest).subscribe(
      ({data} : {data : [BestPlus]} = null) => {
        this.visible = true
        this.best = data[0]
        const iter : ['for1k','for15k','for30k'] = ['for1k','for15k','for30k']
        let setMarkets = new Set<string>()
        iter.forEach(isFor => {
          setMarkets.add(this.best[isFor].buy.market)
          setMarkets.add(this.best[isFor].sell.market)
        })
        this.marketsServ.getMarkets([{$match: {name: {$in: [...setMarkets]}}}]).subscribe(
          ({data : markets} : {data : Market[]}) => {
            iter.forEach(isFor => {
              this.marketsBuy[isFor] = markets.find(market => market.name === this.best[isFor].buy.market)
              this.marketsSell[isFor] = markets.find(market => market.name === this.best[isFor].sell.market)
            })
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
