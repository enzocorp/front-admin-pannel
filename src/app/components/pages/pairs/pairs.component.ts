import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {forkJoin, Observable, Subscription} from "rxjs";
import {Paginate} from "../../../models/pagination";
import {ActivatedRoute, Router} from "@angular/router";
import {PairsService} from "../../../services/http/pairs.service";
import {SymbolsService} from "../../../services/http/symbols.service";
import {CryptoService} from "../../../services/http/crypto.service";
import {Pair} from "../../../models/pair";
import {map} from "rxjs/operators";


interface PairPlus extends Pair{
  selected: number
  used: number
}

@Component({
  selector: 'app-pairs',
  templateUrl: './pairs.component.html',
  styleUrls: ['./pairs.component.scss']
})

export class PairsComponent implements OnInit,OnDestroy {

  constructor(
    private http : HttpClient,
    private pairsService : PairsService,
    private symbolsServ : SymbolsService,
    private cryptoServ : CryptoService,
    private activatedRoute : ActivatedRoute,
    private router : Router
  ) { }

  private subscription : Subscription = new Subscription()
  pairs : Array<PairPlus> = []
  colors = ['green','default','gold','orange','red']
  strSeverities  : string[]
  @Input() isFor : 'for1k' | 'for15k' | 'for30k' = 'for1k'
  pagination : {total : number,paginate : Paginate, index : number} = {
    total : null,
    paginate : {limit : 20, skip : 0 },
    index : 1
  }
  loading : boolean = false
  request : Record<number, Object>&Paginate= {
    ...this.pagination.paginate ,
    0 : {$match : {}},
    1 : {$sort : {_id : 1}}
  }
  request2 = [
    {$group : {
        _id: "$pair",
        exclusions: { $push: "$exclusion.isExclude" }
      }}
  ]
  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<string>();
  arrayCheckedPairs : Pair[] = []

  ngOnInit(): void {
    this.subscription.add(this.pairsService.pairsSubject.subscribe(
      (pairs : PairPlus[])=> {
        this.pairs = pairs
        this.loading = false
      } ))
    this.cryptoServ.getSeverities().subscribe(
      ({data})=> this.strSeverities = data.sort((a,b)=> a.severity - b.severity).map(severity => severity.description)
    )
    this.onUpdate()
  }

  /*-----------------------On update ----------------------------------*/

  onGroupUpdate(){
    this.onUpdate()
    this.onAllChecked(false)
  }

  onUpdate(){
    if (!this.loading)
      this.loading = true

    this.request = {...this.request,...this.pagination.paginate}
    const $gethttp : Observable<{ pairs: {data : Pair[], metadata? : any },marketsByPair: {data : any[]} }> = forkJoin(
      this.pairsService.getPairs(this.request),
      this.symbolsServ.getSymbols(this.request2),
    ).pipe(
      map(([pairs,marketsByPair])=>({pairs,marketsByPair})))
    $gethttp.subscribe(
      ({pairs,marketsByPair}) =>  {
        const exclusions : Array<{_id: string, exclusions : boolean[]}> = marketsByPair.data
        const pairsPlus : PairPlus[] = pairs.data.map(pair => {
          const obj =  exclusions.find(forPair => forPair._id === pair.name)
          return {
            ...pair,
            selected : obj?.exclusions.length,
            used : obj?.exclusions.filter(bool => bool=== false).length
          }
        })
        this.pairsService.emmitPairs(pairsPlus)
        this.pagination.total = pairs.metadata?.total || 0
      })
  }


  /*----------------------Tableau---------------------*/
  updateCheckedSet(name: string, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(name);
    } else {
      this.setOfCheckedId.delete(name);
    }
  }

  refreshCheckedStatus(): void {
    this.checked = this.pairs.every(({ name }) => this.setOfCheckedId.has(name));
    this.indeterminate = this.pairs.some(({ name }) => this.setOfCheckedId.has(name)) && !this.checked;
    this.arrayCheckedPairs = this.pairs.filter(pair => this.setOfCheckedId.has(pair.name) )
  }

  onItemChecked(name: string, checked: boolean): void {
    this.updateCheckedSet(name, checked);
    this.refreshCheckedStatus();
  }

  onAllChecked(checked: boolean): void {
    this.pairs.forEach(({ name }) => this.updateCheckedSet(name, checked));
    this.refreshCheckedStatus();
  }

  /*--------------------- Navigation ------------------------*/

  navigate(str : string){ //Pour mettre a jour la liste des pairs depuis la page "pair"
    const request = JSON.stringify(this.request)
    this.router.navigate([str], {relativeTo : this.activatedRoute ,queryParams : {request}}).then()
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

}
