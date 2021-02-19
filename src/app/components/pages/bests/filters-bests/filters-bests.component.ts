import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Paginate} from "../../../../models/pagination";
import {debounceTime} from "rxjs/operators";
import {Subscription} from "rxjs";
import {ConfigService} from "../../../../services/autre/config.service";
import {GraphConfig} from "../../../../models/graphConfig";

@Component({
  selector: 'app-filters-bests',
  templateUrl: './filters-bests.component.html',
  styleUrls: ['./filters-bests.component.scss']
})
export class FiltersBestsComponent implements OnInit,OnDestroy {

  constructor(
    private formBuilder : FormBuilder,
    private configServ : ConfigService
  ) { }

  private subscription : Subscription = new Subscription()
  filterform : FormGroup
  match : any = {}
  searchMod : 'startWith'| 'endWith' = 'startWith'
  isfor : number
  sort : { key : string, way : number }
  checkBoxValue : '__isfor__' | '__pair__' = "__isfor__"
  @Output() isForChange : EventEmitter<string> = new EventEmitter<string>();

  requestValue : Paginate&Record<number,any>
  @Output() onUpdate : EventEmitter<void> = new EventEmitter<void>();

  @Output()
  requestChange : EventEmitter<Paginate&Record<number,any> > = new EventEmitter<Paginate&Record<number,any> >();
  @Input()
  get request(){
    return this.requestValue;
  }
  set request(obj : Paginate&Record<number,any>  ) {
    this.requestValue = obj;
    this.requestChange.emit(this.requestValue)
  }

  ngOnInit(): void {
    this.subscription.add(this.configServ.isforSubject.subscribe((graph: GraphConfig)=> {
      this.isfor = graph.isfor
      if (this.sort) this.makeUpdate()
    } ))
    this.sort = { key : `isfor.${this.isfor}.spread_usd`, way : -1}
    this.initForms()
    this.subscribeFilters()
  }

  editRequest () {
    this.request = {
      ...this.request,
      0 : { $match: this.match},
      1 : { $sort : {[this.sort.key] : this.sort.way}},
    }
  }

  initForms (){
    this.filterform = this.formBuilder.group({
      best : [null],
      banned : [null],
      for1k : [null],
      for15k : [null],
      for30k : [null],
    })
  }

  makeUpdate(){
    this.updateChecboxValues()
    this.editRequest()
    this.onUpdate.emit()
  }

  updateChecboxValues(){
    let key : string = undefined
    if(this.checkBoxValue === '__pair__')
      key = 'pair'
    else if(this.checkBoxValue === "__isfor__")
      key = `isfor.${this.isfor}.spread_usd`
    this.sort.key = key
  }

  onChangeOrder(){
    this.sort.way *= - 1
    this.makeUpdate()
  }


  subscribeFilters(){
    //Name
    this.filterform.controls['best'].valueChanges.pipe(
      debounceTime(400),
    ).subscribe((name) => {
      if (!name) delete this.match['name']
      else if(this.searchMod === 'startWith') this.match['name']  = {$regex:  `^${name}`, $options: 'i'}
      else if(this.searchMod === 'endWith') this.match['name']  = {$regex:  `${name}$`, $options: 'i'}
      this.makeUpdate()
    })
  }


  ngOnDestroy() {
    this.subscription.unsubscribe()
  }
}
