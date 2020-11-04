import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {debounceTime} from "rxjs/operators";
import {Paginate} from "../../../../models/pagination";

@Component({
  selector: 'app-filters-markets',
  templateUrl: './filters-markets.component.html',
  styleUrls: ['./filters-markets.component.scss']
})

export class FiltersMarketsComponent implements OnInit {

  constructor(
    private formBuilder : FormBuilder
  ) { }

  @Output() onUpdate : EventEmitter<void> = new EventEmitter<void>()
  filterform : FormGroup
  match : any = {}
  sort : { key : string, order : number } = { key : 'market._id', order : 1}

  requestValue : Paginate&Record<number,Object>
  @Output()
  requestChange : EventEmitter<Paginate&Record<number,Object>> = new EventEmitter<Paginate&Record<number,Object>>();
  @Input()
  get request(){
    return this.requestValue;
  }
  set request(obj : Paginate&Record<number,Object> ) {
    this.requestValue = obj;
    this.requestChange.emit(this.requestValue)
  }

  ngOnInit(): void {
    this.initForms()
    this.subscribeFilters()
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
      market : [null],
      reported : [null],
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
    this.filterform.controls['market'].valueChanges.pipe(
      debounceTime(400),
    ).subscribe((name) => {
      if (!name) delete this.match['market.name']
      else this.match['market.name'] = {$regex:  `${name}`, $options: 'i'}
      this.makeUpdate()
    })

    //Filtre all/en services/signalées/éleminée
    this.filterform.controls['banned'].valueChanges.subscribe(
      val => {
        if(val === 'banned') this.match["market.exclusion.isExclude"] = true
        else if(val === 'allowed') this.match["market.exclusion.isExclude"] = false
        else delete this.match["market.exclusion.isExclude"]

        if(val === 'reported')this.match["market.exclusion.severity"] = { $gt: 0 }
        else delete this.match["market.exclusion.severity"]

        this.makeUpdate()
      })
  }

}
