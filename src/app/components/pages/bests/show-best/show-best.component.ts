import {Component, OnDestroy, OnInit} from '@angular/core';
import {Best} from "../../../../models/best";
import {CryptoService} from "../../../../services/http/crypto.service";
import {Pair} from "../../../../models/pair";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {Market} from "../../../../models/market";
import {MarketsService} from "../../../../services/http/markets.service";
import {BestsService} from "../../../../services/http/bests.service";

interface exclusion {
  market : string
  reasons : string[]
  severity : number
  note? : string
}

@Component({
  selector: 'app-show-best',
  templateUrl: './show-best.component.html',
  styleUrls: ['./show-best.component.scss']
})
export class ShowBestComponent implements OnInit, OnDestroy {

  private subscription = new Subscription()
  pair : Pair
  best : Best
  visible : boolean = false
  body : exclusion
  marketBuy : Market = undefined
  marketSell : Market = undefined


  constructor(private bestsServ : BestsService,
              private cryptoServ : CryptoService,
              private marketServ : MarketsService,
              private activatedRoute : ActivatedRoute,
              private router : Router,
              ) { }

  ngOnInit(): void {
 /*   const id = this.activatedRoute.snapshot.paramMap.get('id')
    this.bestsServ.getBest(id).subscribe(
      best => {
        this.visible = true
        this.best = best
        this.cryptoServ.getPair(best.pair).subscribe(
          pair => this.pair = pair
        )
        this.marketServ.getMarket(this.best.buy.market).subscribe(
          market => this.marketBuy = market
        )
        this.marketServ.getMarket(this.best.sell.market).subscribe(
          market => this.marketSell = market
        )
      })
*/
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
