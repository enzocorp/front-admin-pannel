import {AfterViewChecked, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {debounceTime} from "rxjs/operators";
import {MongoPaginate, Paginate} from "../../../../models/pagination";

@Component({
  selector: 'app-filters-pairs',
  templateUrl: './filters-pairs.component.html',
  styleUrls: ['./filters-pairs.component.scss']
})
export class FiltersPairsComponent implements OnInit, AfterViewChecked {

  constructor(
    private formBuilder : FormBuilder,
    private changeDetector : ChangeDetectorRef // inutile mais pour enlever un avertissement dans la console
  ) { }

  filterform : FormGroup
  match : any = {}
  sort : { key : string, order : number } = { key : '_id', order : 1}
  searchMod : 'startWith'| 'endWith' = 'startWith'

  requestValue : MongoPaginate
  @Output() onUpdate : EventEmitter<void> = new EventEmitter<void>();

  @Output()
  requestChange : EventEmitter<MongoPaginate> = new EventEmitter<MongoPaginate>();
  @Input()
  get request(){
    return this.requestValue;
  }
  set request(obj : MongoPaginate ) {
    this.requestValue = obj;
    this.requestChange.emit(this.requestValue)
  }

  ngOnInit(): void {
    this.initForms()
    this.subscribeFilters()
    this.makeUpdate()
  }
  ngAfterViewChecked(){
    this.changeDetector.detectChanges();
  }

  initForms (){
    this.filterform = this.formBuilder.group({
      pair : [null],
      reported : [null],
      banned : [null],
    })
  }

  onRadioChange(str : string){
    if(str === 'banLenght'){
      this.request.addFields = {banLenght: {$size: "$exclusion.fromMarkets"}}
    }
    else
      delete this.request.addFields;
    this.makeUpdate()
  }

  makeUpdate(){
    this.request = {...this.request, match: this.match,sort : {[this.sort.key] : this.sort.order}}
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
    ).subscribe((id) => {
      if (!id) delete this.match.name
      else if(this.searchMod === 'startWith') this.match.name = {$regex:  `^${id}`, $options: 'i'}
      else if(this.searchMod === 'endWith') this.match.name = {$regex:  `${id}$`, $options: 'i'}
      this.makeUpdate()
    })

    //Banned
    this.filterform.controls['banned'].valueChanges.subscribe(
      val => {
        if(val === 'banned') this.match["exclusion.pairIsExclude"] = true
        else if(val === 'allowed') this.match["exclusion.pairIsExclude"] = false
        else delete this.match["exclusion.pairIsExclude"]
        this.makeUpdate()
      }
    )
    //Reported
    this.filterform.controls['reported'].valueChanges.subscribe(
      val => {
        if(val) this.match["exclusion.fromMarkets"] = {$not: {$size: 0}}
        else delete this.match["exclusion.fromMarkets"]
        this.makeUpdate()
      }
    )
  }

}
