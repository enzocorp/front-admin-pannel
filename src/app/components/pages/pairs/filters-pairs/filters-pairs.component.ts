import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {debounceTime} from "rxjs/operators";
import {Paginate} from "../../../../models/pagination";

@Component({
  selector: 'app-filters-pairs',
  templateUrl: './filters-pairs.component.html',
  styleUrls: ['./filters-pairs.component.scss']
})
export class FiltersPairsComponent implements OnInit {

  constructor(
    private formBuilder : FormBuilder,
  ) { }

  filterform : FormGroup
  match : any = {}
  sort : { key : string, order : number } = { key : 'pair._id', order : 1}
  searchMod : 'startWith'| 'endWith' = 'startWith'
  isFor : 'for1k' | 'for15k' | 'for30k' = "for15k"
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
    this.isForChange.emit(this.isFor)
  }

  editRequest () {
    this.request = {
      ...this.request,
      3 : { $match: this.match},
      8 : { $sort : {[this.sort.key] : this.sort.order}},
    }
  }

  initForms (){
    this.filterform = this.formBuilder.group({
      pair : [null],
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

  onIsForChange(){
    this.isForChange.emit(this.isFor)
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


}
