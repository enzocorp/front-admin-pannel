import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Paginate} from "../../../../models/pagination";

import {debounceTime} from "rxjs/operators";

@Component({
  selector: 'app-filters-assets',
  templateUrl: './filters-assets.component.html',
  styleUrls: ['./filters-assets.component.scss']
})
export class FiltersAssetsComponent implements OnInit {

  constructor(
    private formBuilder : FormBuilder,
  ) {}

  filterform : FormGroup
  match : any = {}
  sort : { key : string, order : number } = { key : 'name', order : 1}
  searchMod : 'acronyme'| 'fullname' = 'acronyme'
  requestValue : Paginate&{0: Object, 1 : Object}
  @Output() onUpdate : EventEmitter<void> = new EventEmitter<void>();

  @Output()
  requestChange : EventEmitter<Paginate&{0: Object, 1 : Object} > = new EventEmitter<Paginate&{0: Object, 1 : Object} >();
  @Input()
  get request(){
    return this.requestValue;
  }
  set request(obj : Paginate&{0: Object, 1 : Object}  ) {
    this.requestValue = obj;
    this.requestChange.emit(this.requestValue)
  }

  ngOnInit(): void {
    this.initForms()
    this.subscribeFilters()
    this.makeUpdate()
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
      asset : [null],
      banned : [null],
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

  subscribeFilters(){
    //Name
    this.filterform.controls['asset'].valueChanges.pipe(
      debounceTime(400),
    ).subscribe((word) => {
      if (!word) {
        delete this.match['name']
        delete this.match['longName']
        delete this.match['contient']
      }
      else if(this.searchMod === 'acronyme') this.match['name']  = {$regex:  `^${word}`, $options: 'i'}
      else if(this.searchMod === 'fullname') this.match['longName']  = {$regex:  `^${word}`, $options: 'i'}
      else if(this.searchMod === 'contient') this.match['name']  = {$regex:  `${word}`, $options: 'i'}
      this.makeUpdate()
    })

    //Filtre all/en services/signalées/éleminée
    this.filterform.controls['banned'].valueChanges.subscribe(
      val => {
        if(val === 'banned') this.match["exclusion.isExclude"] = true
        else if(val === 'allowed') this.match["exclusion.isExclude"] = false
        else delete this.match["exclusion.isExclude"]

        if(val === 'reported')this.match["exclusion.severity"] = { $gt: 0 }
        else delete this.match["exclusion.severity"]

        this.makeUpdate()
      })
  }

}
