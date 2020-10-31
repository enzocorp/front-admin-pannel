import {Component, EventEmitter, OnInit} from '@angular/core';
import {MarketsService} from "../../../../services/http/markets.service";
import {ActivatedRoute, Router} from "@angular/router";
import {forkJoin, Observable} from "rxjs";
import {map} from "rxjs/operators";
import {MongoPaginate} from "../../../../models/pagination";
import {Pair} from "../../../../models/pair";
import {CryptoService} from "../../../../services/http/crypto.service";
import {Market} from "../../../../models/market";
import {Reason} from "../../../../models/reason";
import {Severity} from "../../../../models/severity";


interface lookup_market extends Market{
  reasonsText : Reason[]
  total : [{total : number}],
  isBestFor : number
}

interface lookup_pair extends Pair{
  positionBuy : number
  positionSell : number
}

@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.scss']
})
export class MarketComponent implements OnInit {

  ngOnInit() {
  }

  /*page : number = 1
  sorter = {
    moyenne : 'prixMoyen_for1kusd_quote',
    side : 'positionBuy'
  }
  color = ['grey','gold','orange','red']
  colorMarket = ['default','gold','orange','red']
  dirty = false
  market : lookup_market = undefined
  pairs : lookup_pair[] = undefined
  severities : Severity[] = []

  listeLoading = true
  visible : boolean = false
  isDirty : EventEmitter<void> = new EventEmitter<void>()
  request : Partial<MongoPaginate> = {
    lookups :
        [{
          from: "reasons",
          localField: "exclusion.reasons",
          foreignField: "status",
          as: "reasonsText"
        },{
          from: "pairs",
          let : {exid : "$id_market"},
          pipeline : [
            { $match: { $expr: { $in: [ "$$exid", "$markets.id" ] }, "exclusion.pairIsExclude" : false} },
            { $match: { $expr: { $not: [{ $in: [ "$$exid", "$exclusion.fromMarkets.market" ] }]} } },
            { $count: "total" }
          ],
          as: "total"
        }],
    limit : 1,
    match : {id_market : this.activatedRoute.snapshot.paramMap.get('id')}
  }
  constructor(
              private marketServ : MarketService,
              private cryptoServ : CryptoService,
              private activatedRoute : ActivatedRoute,
              private router : Router,
  ) { }

  ngOnInit(): void {
    this.visible = true
    this.marketServ.getPodiumPairs(this.activatedRoute.snapshot.paramMap.get('id'),this.sorter.moyenne, this.sorter.side).subscribe(
      pairs => {
        this.pairs = pairs
        this.makeBestFor()
        this.listeLoading = false
      })
   const $gethttp : Observable<{ market: {data : lookup_market[] },severities: Severity[] }> = forkJoin(
     this.marketServ.getMarkets(this.request),
     this.exclusionService.getSeverities(),
   ).pipe(
     map(([market,severities])=>({market,severities})))

   $gethttp.subscribe(
     obj =>  {
       this.market = obj.market.data[0]
       this.severities = obj.severities.reverse()
     }
   )

  }


  close(): void {
    this.visible = false
    if (this.dirty && this.activatedRoute.snapshot.queryParamMap.get('request')){
      const req = JSON.parse( this.activatedRoute.snapshot.queryParamMap.get('request'))
      this.marketServ.getMarkets(req).subscribe(
        resp => this.marketServ.emmitMarkets(resp.data)
      )
    }
    setTimeout(() => this.router.navigate(
      ['../'],
      { relativeTo: this.activatedRoute }), 250);
  }

  sortList(event : string,sorte : string ) {
    this.sorter[sorte] = event
    this.onValuesChanges()
  }

  makeBestFor(){
    if (this.market)
      this.market.isBestFor = this.pairs.filter(pair => (
        (pair.positionBuy === 0 || pair.positionSell === 0 )
        && pair.exclusion.pairIsExclude === false)
        && pair.exclusion.fromMarkets.findIndex(item => item.market === this.activatedRoute.snapshot.paramMap.get('id')) === -1
      ).length
  }

  onValuesChanges(){
    this.dirty = true
    this.listeLoading = true
    this.marketServ.getMarkets(this.request).subscribe(
      resp => this.market = resp.data[0]
    )
    this.marketServ.getPodiumPairs(this.activatedRoute.snapshot.paramMap.get('id'),this.sorter.moyenne, this.sorter.side).subscribe(
      pairs => {
        this.pairs = pairs
        this.makeBestFor()
        this.listeLoading = false
    })
  }*/

}
