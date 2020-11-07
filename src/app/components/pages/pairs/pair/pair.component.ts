import {Component, EventEmitter, OnInit} from '@angular/core';
import {Pair} from "../../../../models/pair";
import {forkJoin, Observable, Subscribable} from "rxjs";
import {CryptoService} from "../../../../services/http/crypto.service";
import {ActivatedRoute, Router} from "@angular/router";
import {map} from "rxjs/operators";
import {Severity} from "../../../../models/severity";
import {Reason} from "../../../../models/reason";
import {PairsService} from "../../../../services/http/pairs.service";
import {Market} from "../../../../models/market";
import {Symbol} from "../../../../models/symbol";
import {SymbolsService} from "../../../../services/http/symbols.service";
import {Asset} from "../../../../models/asset";

interface SymbolPlus extends Omit<Symbol, "market">{
  market : Market
}

interface PairPlus extends Omit<Pair, "exclusion" | "base" | "quote">{
  exclusion : Omit<Pair['exclusion'], "reasons"|"severity">&{
    severityPlus : Severity,
    reasonsPlus : Reason[]
  }
  base : Asset
  quote : Asset
}

@Component({
  selector: 'app-pair',
  templateUrl: './pair.component.html',
  styleUrls: ['./pair.component.scss']
})

export class PairComponent implements OnInit {

  constructor(private cryptoServ : CryptoService,
              private pairsServ : PairsService,
              private symbsServ : SymbolsService,
              private activatedRoute : ActivatedRoute,
              private router : Router,
  ) { }

  colors = ['green','default','gold','orange','red']
  colorsv2 = ['green','black','gold','orange','red']
  isFor : 'for1k' | 'for15k' | 'for30k' = 'for15k'
  visible : boolean = false
  pair : PairPlus = undefined
  loading = true
  symbols : SymbolPlus[]
  marketsOn : number
  paginate : {
    pageIndex : number
    pageSize : number
  } = {pageIndex : 1, pageSize : 10}
  list: {
    buy : SymbolPlus[]
    sell : SymbolPlus[]
    sorter : 'prixMoyen_quote' | 'bestMarketFreq',
    maskOff : boolean,
    search : string
  } = {buy : [], sell :[], sorter : 'prixMoyen_quote',maskOff : true, search : ''}
  dirty = false
  isDirty : EventEmitter<void> = new EventEmitter<void>()
  requestSymbs = [
    {$match: {pair : this.activatedRoute.snapshot.paramMap.get('id')}},
    {$lookup: {from: "markets", localField: "market", foreignField: "name", as: "market"}},
    {$unwind: "$market"},
    {$sort: {"market.name" : 1}},
  ]

  ngOnInit(): void {
    this.visible = true
    this.onUpdate()
  }

  getPair() : Subscribable<any>{
    return this.pairsServ.getPairs( [
      {$match: {name : this.activatedRoute.snapshot.paramMap.get('id')}},
      {$lookup: {from: "severities",localField: "exclusion.severity",foreignField: "severity",as: "exclusion.severityPlus"}},
      {$lookup: {from: "reasons",localField: "exclusion.reasons",foreignField: "status",as: "exclusion.reasonsPlus"}},
      {$lookup: {from: "assets",localField: "base",foreignField: "name",as: "base"}},
      {$lookup: {from: "assets",localField: "quote",foreignField: "name",as: "quote"}},
      {$unwind: "$exclusion.severityPlus"},{$unwind: "$base"},{$unwind: "$quote"},
    ])
  }

  onUpdate(){
    this.dirty = true
    this.loading = true
    const $gethttp : Observable<{dataPair: { data: PairPlus[] }, dataSymbs : {data : SymbolPlus[]} }> = forkJoin(
      this.getPair(),
      this.symbsServ.getSymbols(this.requestSymbs)
    ).pipe( // forkJoin returns an array of values, here we map those values to an object
      map(([dataPair,dataSymbs])=>({dataPair,dataSymbs})))
    $gethttp.subscribe(
      (resp) =>  {
        this.symbols = resp.dataSymbs.data
        this.marketsOn = this.symbols.filter(symb => symb.exclusion.isExclude === false && symb.market.exclusion.isExclude === false).length
        this.pair = resp.dataPair.data[0]
        this.makeList()
        this.loading = false
      },
      ()=> null,
      ()=> this.loading = false
    )
  }

  makeList(sorter = this.list.sorter, search = this.list.search,isFor = this.isFor){
    const funcSort = (a,b,side) => {
        if(a[isFor][side][sorter] === undefined || a[isFor][side][sorter] === null)
          return 0
        if(b[isFor][side][sorter] === undefined || b[isFor][side][sorter] === null)
          return 0
        else if (side ==="sell" || sorter === "bestMarketFreq")
          return b[isFor][side][sorter]  - a[isFor][side][sorter]
        else if (side === "buy") {
          return a[isFor][side][sorter] - b[isFor][side][sorter]
        }
    }

    let symbols : SymbolPlus[] = [...this.symbols]
    let listBuy = symbols.sort((a,b)=> funcSort(a,b, 'buy') )
      .filter(symb =>  !this.list.maskOff || !(this.list.maskOff && (symb.exclusion.isExclude || symb.market.exclusion.isExclude)) )
    let listSell = symbols.sort((a,b)=> funcSort(a,b, 'sell') )
      .filter(symb => !this.list.maskOff || !(this.list.maskOff && (symb.exclusion.isExclude || symb.market.exclusion.isExclude)) )
    if (search.length){
      if(search) this.list.search = search
      this.list.buy = listBuy.filter(symb => new RegExp(`^${search}`,'i').test(symb.market.name))
      this.list.sell = listSell.filter(symb => new RegExp(`^${search}`,'i').test(symb.market.name))
    }
    else{
      this.list.buy = listBuy
      this.list.sell = listSell
    }
  }

  close(): void {
    this.visible = false
    const request = this.activatedRoute.snapshot.queryParamMap.get('request')
    if (this.dirty && request){
      const req = JSON.parse( request)
      this.symbsServ.getSymbols(req).subscribe(
        resp => {
          let pairPlus = resp ? resp.data.map(({pair,marketsUsed}) => ({
            ...pair,
            marketsUsed
          })) : []
          this.pairsServ.emmitPairs(pairPlus)
        })
    }
    setTimeout(() => this.router.navigate(
      ['../'],
      { relativeTo: this.activatedRoute }), 250);
  }

}
