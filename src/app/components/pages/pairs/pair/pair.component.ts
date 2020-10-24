import {Component, EventEmitter, OnInit} from '@angular/core';
import {Pair} from "../../../../models/pair";
import {forkJoin, Subscribable} from "rxjs";
import {CryptoService} from "../../../../services/http/crypto.service";
import {MarketService} from "../../../../services/http/market.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ExclusionPair, Reason, Severity} from "../../../../models/exclusionPair";
import {ExclusionService} from "../../../../services/http/exclusion.service";
import {map} from "rxjs/operators";
import {MongoPaginate} from "../../../../models/pagination";
import {Average} from "../../../../models/average";
import {Exchange} from "../../../../models/exchange";


interface lookup_market extends Exchange{
  excludeFromPair : ExclusionPair,
  exclusion : Exchange['exclusion'] & {textSeverity : Severity, textReasons : Reason[]}
}

interface lookup_pair extends Pair{
  averages : Array<Average & {exclude : boolean}>
  markets : lookup_market[]
  reported : ExclusionPair & {severityText : Severity, reasonsText : Reason[]}
}

@Component({
  selector: 'app-pair',
  templateUrl: './pair.component.html',
  styleUrls: ['./pair.component.scss']
})

export class PairComponent implements OnInit {

  sorter : {moyenne : string, side : 'buy' | 'sell'} = {
    moyenne : '15k',
    side : 'buy'
  }
  tabAverages : {buy : lookup_pair['averages'], sell : lookup_pair['averages']} = {
    buy : [],
    sell : []
  }
  dataLoading = true
  modEdition = false
  page : number = 1
  activatedMarket : lookup_market[] = []
  colorMarket = ['green','default','gold','orange','red']
  dirty = false
  severities : Severity[] = []
  reasons : Reason[] = []
  pair : lookup_pair = undefined
  visible : boolean = false
  isDirty : EventEmitter<void> = new EventEmitter<void>()
  request : MongoPaginate = {
    match : {name : this.activatedRoute.snapshot.paramMap.get('id')},
    lookups :
      [{
        from: "exchanges",
        let : {tab_exchange : "$exchanges.id", tab_exclusion : "$exclusion.fromMarkets"},
        pipeline : [
          {$match: { $expr: { $in: [ "$id_exchange", "$$tab_exchange" ] } } },
          {$lookup: {
              from: "severities",
              localField: "exclusion.severity",
              foreignField: "severity",
              as: "exclusion.textSeverity"
            }},
          {$lookup: {
              from: "reasons",
              localField: "exclusion.reasons",
              foreignField: "status",
              as: "exclusion.textReasons"
            }},
          {$unwind: {path : "$exclusion.textSeverity", preserveNullAndEmptyArrays: true}},
        ],
        as: "markets"
      },{
        from: "averages",
        localField: "name",
        foreignField: "pair",
        as: "averages"
      }],
  }

  constructor(private cryptoServ : CryptoService,
              private exclusionServ : ExclusionService,
              private marketServ : MarketService,
              private activatedRoute : ActivatedRoute,
              private router : Router,
  ) { }

  ngOnInit(): void {
    this.visible = true
    const $gethttp : Subscribable<{severities : Severity[], reasons : Reason[], pair : any}> = forkJoin(
      this.exclusionServ.getSeverities(),
      this.exclusionServ.getReasons('symbole'),
      this.cryptoServ.getPairsv2(this.request)
    ).pipe( // forkJoin returns an array of values, here we map those values to an object
      map(([severities,reasons,pair])=>({severities,reasons,pair})))

    $gethttp.subscribe(
      obj =>  {
        this.severities = obj.severities
        this.reasons = obj.reasons
        this.pair = obj.pair.data[0]
        this.exclusionFromPair()
        this.makeAverages()
        this.dataLoading = false
      }
    )
  }

  makeAverages(val = this.sorter.moyenne){
    this.sorter.moyenne = val
    let tab = this.pair.averages
    let str = 'prixMoyen_for'+val+'usd_quote'
    this.tabAverages.buy = tab.sort((a,b)=> a.buy[str] - b.buy[str])
    this.tabAverages.sell = tab.sort((a,b)=> b.sell[str] - a.sell[str])
  }

  exclusionFromPair(){
    this.pair.markets.map(market => market.excludeFromPair = this.pair.exclusion.fromMarkets.find(ban => ban.market === market.id_exchange))
    let cont =  this.pair.exclusion.fromMarkets.find(exfrom => exfrom.market === '*')
    if(cont){
      this.pair.reported = {
        ...cont,
        reasonsText : cont.reasons.map(r => this.reasons.find(reason => reason.status === r)),
        severityText : this.severities.find(severity => severity.severity === cont.severity)
      }
    }
    else this.pair.reported = null
    this.activatedMarket = this.pair.markets.filter(market => market.exclusion.exchangeIsExclude === false && market.excludeFromPair?.severity !== 4)
    this.pair.averages = this.pair.averages.map(av => {
      let market : lookup_market = this.pair.markets.find(mark => mark.id_exchange === av.exchange)
      let bool : boolean = market.excludeFromPair?.severity === 4 || market.exclusion.exchangeIsExclude === true
      return {...av, exclude : bool}
    })
  }

  close(): void {
    this.visible = false
    if (this.dirty && this.activatedRoute.snapshot.queryParamMap.get('request')){
      const req = JSON.parse( this.activatedRoute.snapshot.queryParamMap.get('request'))
      this.cryptoServ.getPairsv2(req).subscribe(
        resp => this.cryptoServ.emmitPairs(resp.data)
      )
    }
    setTimeout(() => this.router.navigate(
      ['../'],
      { relativeTo: this.activatedRoute }), 250);
  }

  onValuesChanges(){
    this.dirty = true
    this.dataLoading = true
    this.cryptoServ.getPairsv2(this.request).subscribe(
      resp => {
        this.pair = resp.data[0]
        this.exclusionFromPair()
        this.makeAverages()
        this.dataLoading = false
      }
    )
  }

}
