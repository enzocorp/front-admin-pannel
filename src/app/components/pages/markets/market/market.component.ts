import {Component, EventEmitter, OnInit} from '@angular/core';
import {MarketsService} from "../../../../services/http/markets.service";
import {ActivatedRoute, Router} from "@angular/router";
import {forkJoin, Observable, Subscribable} from "rxjs";
import {map} from "rxjs/operators";
import {MongoPaginate} from "../../../../models/pagination";
import {Pair} from "../../../../models/pair";
import {CryptoService} from "../../../../services/http/crypto.service";
import {Market} from "../../../../models/market";
import {Reason} from "../../../../models/reason";
import {PairsService} from "../../../../services/http/pairs.service";
import {SymbolsService} from "../../../../services/http/symbols.service";
import {Symbol, SymbolFor} from "../../../../models/symbol";
import {Severity} from "../../../../models/severity";
import {Asset} from "../../../../models/asset";



interface SymbolPlus extends Omit<Symbol, "pair">{
  pair : Pair
  data : Omit< SymbolFor['buy'|'sell'], "prixMoyen_quote">
}

interface MarketPlus extends Omit<Market, "exclusion" | "base" | "quote">{
  exclusion : Omit<Pair['exclusion'], "reasons"|"severity">&{
    severityPlus : Severity,
    reasonsPlus : Reason[]
  }
  base : Asset
  quote : Asset
}


@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.scss']
})
export class MarketComponent implements OnInit {


  constructor(private cryptoServ : CryptoService,
              private marketsServ : MarketsService,
              private symbsServ : SymbolsService,
              private activatedRoute : ActivatedRoute,
              private router : Router,
  ) { }

  colors = ['green','default','gold','orange','red']
  colorsv2 = ['green','black','gold','orange','red']
  isFor : 'for1k' | 'for15k' | 'for30k' = 'for15k'
  visible : boolean = false
  market : MarketPlus = undefined
  loading = true
  symbols : SymbolPlus[]
  pairsOn : number
  paginate : {
    pageIndex : number
    pageSize : number
  } = {pageIndex : 1, pageSize : 10}
  list: {
    data : SymbolPlus[]
    sorter : string,
    maskOff : boolean,
    search : string
  } = {data : [], sorter : 'bestMarketFreq',maskOff : true, search : ''}
  dirty = false
  isDirty : EventEmitter<void> = new EventEmitter<void>()
  requestSymbs = [
    {$match: {market : this.activatedRoute.snapshot.paramMap.get('id')}},
    {$lookup: {from: "pairs", localField: "pair", foreignField: "name", as: "pair"}},
    {$unwind: "$pair"},
    {$sort: {"pair.name" : 1}},
  ]

  ngOnInit(): void {
    this.visible = true
    this.onUpdate()
  }

  getMarket() : Subscribable<any>{
    return this.marketsServ.getMarkets( [
      {$match: {name : this.activatedRoute.snapshot.paramMap.get('id')}},
      {$lookup: {from: "severities",localField: "exclusion.severity",foreignField: "severity",as: "exclusion.severityPlus"}},
      {$lookup: {from: "reasons",localField: "exclusion.reasons",foreignField: "status",as: "exclusion.reasonsPlus"}},
      {$unwind: "$exclusion.severityPlus"}
    ])
  }

  onUpdate(){
    this.dirty = true
    this.loading = true
    const $gethttp : Observable<{dataMarket: { data: MarketPlus[] }, dataSymbs : {data : SymbolPlus[]} }> = forkJoin(
      this.getMarket(),
      this.symbsServ.getSymbols(this.requestSymbs)
    ).pipe( // forkJoin returns an array of values, here we map those values to an object
      map(([dataMarket,dataSymbs])=>({dataMarket,dataSymbs})))
    $gethttp.subscribe(
      (resp) =>  {
        this.symbols = resp.dataSymbs.data
        this.pairsOn = this.symbols.filter(symb => symb.exclusion.isExclude === false && symb.pair.exclusion.isExclude === false).length
        this.market = resp.dataMarket.data[0]
        this.makeList()
        this.loading = false
      },
      ()=> null,
      ()=> this.loading = false
    )
  }

  makeList(sorter = this.list.sorter, search = this.list.search,isFor = this.isFor){
    const funcSort = (a,b) => {
      if(a.data[sorter] === undefined || a.data[sorter] === null)
        return 0
      if(b.data[sorter]  === undefined || b.data[sorter]  === null)
        return 0
      else
        return b.data[sorter]  - a.data[sorter]
    }

    let symbols : SymbolPlus[] = this.symbols.map(symb => {
      symb.data = {
        bestMarketFreq : symb[isFor].buy.bestMarketFreq + symb[isFor].sell.bestMarketFreq,
        okFreq: symb[isFor].buy.okFreq + symb[isFor].sell.okFreq,
        notDataFreq: symb[isFor].buy.notDataFreq + symb[isFor].sell.notDataFreq,
        notEnoughVolFreq: symb[isFor].buy.notEnoughVolFreq + symb[isFor].sell.notEnoughVolFreq,
      }
      return symb
    })
    this.list.data = symbols
    let listData = symbols.sort((a,b)=> funcSort(a,b) )
      .filter(symb => !this.list.maskOff || !(this.list.maskOff && (symb.exclusion.isExclude || symb.pair.exclusion.isExclude)) )
    if (search.length){
      if(search) this.list.search = search
      this.list.data = listData.filter(symb => new RegExp(`^${search}`,'i').test(symb.pair.name))
    }
    else{
      this.list.data = listData
    }
  }

  close(): void {
    this.visible = false
    const request = this.activatedRoute.snapshot.queryParamMap.get('request')
    if (this.dirty && request){
      const req = JSON.parse( request)
      this.symbsServ.getSymbols(req).subscribe(
        resp => {
          let marketPlus = resp ? resp.data.map(({market,pairsUsed}) => ({
            ...market,
            pairsUsed
          })) : []
          this.marketsServ.emmitMarkets(marketPlus)
        })
    }
    setTimeout(() => this.router.navigate(
      ['../'],
      { relativeTo: this.activatedRoute }), 250);
  }

}
