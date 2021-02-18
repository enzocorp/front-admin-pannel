import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {debounceTime} from "rxjs/operators";
import {Paginate} from "../../../../models/pagination";
import {Subscription} from "rxjs";
import {ConfigService} from "../../../../services/autre/config.service";
import {GraphConfig} from "../../../../models/graphConfig";

@Component({
  selector: 'app-filters-pairs',
  templateUrl: './filters-pairs.component.html',
  styleUrls: ['./filters-pairs.component.scss']
})
export class FiltersPairsComponent implements OnInit,OnDestroy {

  constructor(
    private formBuilder : FormBuilder,
    private configServ : ConfigService
  ) {}


  private subscription : Subscription = new Subscription()
  isfor : number
  filterform : FormGroup
  sorterValue : string = "pair.name"
  match : any = {}
  sort : { key : string, order : number } = { key : 'pair._id', order : 1}
  searchMod : 'startWith'| 'endWith' = 'startWith'
  @Output() isForChange : EventEmitter<string> = new EventEmitter<string>();

  requestValue : Paginate&Record<number,Object>
  @Output() onUpdate : EventEmitter<void> = new EventEmitter<void>();

  @Output()
  requestChange : EventEmitter<Paginate&Record<number,Object> > = new EventEmitter<Paginate&Record<number,Object> >();
  @Input()
  get request(){
    return this.requestValue;
  }
  set request(obj : Paginate&Record<number,Object>  ) {
    this.requestValue = obj;
    this.requestChange.emit(this.requestValue)
  }

  ngOnInit(): void {
    this.initForms()
    this.subscribeFilters()
    this.subscription.add(this.configServ.isforSubject.subscribe((graph: GraphConfig)=> {
      this.isfor = graph.isfor
      this.makeUpdate()
    } ))
  }

  editRequest () {
    this.request = {
      ...this.request,
      3 : { $match: this.match},
      8 : { $sort : {[this.sort.key] : this.sort.order}},
    }
  }

  makeSorterKey(){
    let key = undefined
    switch (this.sorterValue){
      case  "spreadMoyen_usd" :
        key = `pair.isfor.${this.isfor}.spreadMoyen_usd`
        break
      case  "negativeFreq" :
        key = `pair.isfor.${this.isfor}.negativeFreq`
        break
      case  "positiveFreq" :
        key = `pair.isfor.${this.isfor}.positiveFreq`
        break
      case  "notEnoughtVolFreq" :
        key = `pair.isfor.${this.isfor}.notEnoughtVolFreq`
        break
      case  "isBestFreq" :
        key = `pair.isfor.${this.isfor}.isBestFreq`
        break
      default :
        key = this.sorterValue
    }
    this.sort.key = key
  }

  initForms (){
    this.filterform = this.formBuilder.group({
      pair : [null],
      banned : [null],
    })
  }

  makeUpdate(){
    this.makeSorterKey()
    this.editRequest()
    this.onUpdate.emit()
  }

  onChangeOrder(){
    this.sort.order *= - 1
    this.makeUpdate()
  }

  subscribeFilters(){
    //Name
    this.filterform.controls['pair'].valueChanges.pipe(
      debounceTime(400),
    ).subscribe((name) => {
      if (!name) delete this.match['pair.name']
      else if(this.searchMod === 'startWith') this.match['pair.name']  = {$regex:  `^${name}`, $options: 'i'}
      else if(this.searchMod === 'endWith') this.match['pair.name']  = {$regex:  `${name}$`, $options: 'i'}
      this.makeUpdate()
    })

    //Filtre all/en services/signalées/éleminée
    this.filterform.controls['banned'].valueChanges.subscribe(
      val => {
        if(val === 'banned') this.match["pair.exclusion.isExclude"] = true
        else if(val === 'allowed') this.match["pair.exclusion.isExclude"] = false
        else delete this.match["pair.exclusion.isExclude"]

        if(val === 'reported')this.match["pair.exclusion.severity"] = { $gt: 0 }
        else delete this.match["pair.exclusion.severity"]

        this.makeUpdate()
      })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }


}
