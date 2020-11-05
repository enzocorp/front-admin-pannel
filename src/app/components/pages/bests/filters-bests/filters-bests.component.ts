import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {MongoPaginate, Paginate} from "../../../../models/pagination";
import {debounceTime} from "rxjs/operators";

@Component({
  selector: 'app-filters-bests',
  templateUrl: './filters-bests.component.html',
  styleUrls: ['./filters-bests.component.scss']
})
export class FiltersBestsComponent implements OnInit {

  constructor(
    private formBuilder : FormBuilder,
  ) { }

  filterform : FormGroup
  match : any = {}
  searchMod : 'startWith'| 'endWith' = 'startWith'
  isFor : 'for1k' | 'for15k' | 'for30k' = "for15k"
  sort : { key : string, order : number } = { key : `${this.isFor}.spread_usd`, order : -1}
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
    this.initForms()
    this.subscribeFilters()
    this.isForChange.emit(this.isFor)
  }

  editRequest () {
    this.request = {
      ...this.request,
      0 : { $match: this.match},
      1 : { $sort : {[this.sort.key] : this.sort.order}},
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
    this.editRequest()
    this.onUpdate.emit()
  }

  onChangeOrder(){
    this.sort.order *= - 1
    this.makeUpdate()
  }

  onIsForChange(isFor){
    let str = this.sort.key
    if(/for[\d]+?k/.test(str))
      this.sort.key = str.replace(/for[\d]+?k/, isFor)
    this.isForChange.emit(isFor)
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
}
