import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {MongoPaginate} from "../../../../models/pagination";
import {debounceTime} from "rxjs/operators";

@Component({
  selector: 'app-filters-markets',
  templateUrl: './filters-markets.component.html',
  styleUrls: ['./filters-markets.component.scss']
})
export class FiltersMarketsComponent implements OnInit {

  constructor(
    private formBuilder : FormBuilder,
    private changeDetector : ChangeDetectorRef // inutile mais pour enlever un avertissement dans la console
  ) { }

  filterform : FormGroup
  match : any = {}
  sort : { key : string, order : number } = { key : '_id', order : 1}

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
      market : [null],
      reported : [null],
      banned : [null],
    })
  }

  onRadioChange(str : string){
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
    this.filterform.controls['market'].valueChanges.pipe(
      debounceTime(400),
    ).subscribe((id) => {
      if (!id) delete this.match.id_exchange
      else this.match.id_exchange = {$regex:  `${id}`, $options: 'i'}
      this.makeUpdate()
    })

    //Banned
    this.filterform.controls['banned'].valueChanges.subscribe(
      val => {
        if(val === 'banned') this.match["exclusion.exchangeIsExclude"] = true
        else if(val === 'allowed') this.match["exclusion.exchangeIsExclude"] = false
        else delete this.match["exclusion.exchangeIsExclude"]
        this.makeUpdate()
      }
    )
    //Reported
    this.filterform.controls['reported'].valueChanges.subscribe(
      val => {
        if(val) this.match["exclusion.severity"] = { $gt: 0 }
        else delete this.match["exclusion.severity"]
        this.makeUpdate()
      }
    )
  }

}
