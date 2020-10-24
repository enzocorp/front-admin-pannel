import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {MongoPaginate} from "../../../../models/pagination";
import {debounceTime} from "rxjs/operators";

@Component({
  selector: 'app-filters-bests',
  templateUrl: './filters-bests.component.html',
  styleUrls: ['./filters-bests.component.scss']
})
export class FiltersBestsComponent implements OnInit {


  constructor(
    private formBuilder: FormBuilder,
    private changeDetector: ChangeDetectorRef // inutile mais pour enlever un avertissement dans la console
  ) {
  }

  filterform: FormGroup
  match: any = {}
  sort: { key: string, order: number } = {key: 'spread_15kusd', order: -1}
  searchMod: 'startWith' | 'endWith' = 'startWith'

  requestValue: MongoPaginate
  @Output() onUpdate: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  requestChange: EventEmitter<MongoPaginate> = new EventEmitter<MongoPaginate>();

  @Input()
  get request() {
    return this.requestValue;
  }

  set request(obj: MongoPaginate) {
    this.requestValue = obj;
    this.requestChange.emit(this.requestValue)
  }

  ngOnInit(): void {
    this.initForms()
    this.subscribeFilters()
    this.makeUpdate()
  }

  ngAfterViewChecked() {
    this.changeDetector.detectChanges();
  }

  initForms() {
    this.filterform = this.formBuilder.group({
      best: [null],
    })
  }

  onRadioChange(str: string) {
    if (str === 'banLenght') {
      this.request.addFields = {banLenght: {$size: "$exclusion.fromMarkets"}}
    } else
      delete this.request.addFields;
    this.makeUpdate()
  }

  makeUpdate(){
    this.request = {
      ...this.request,
      match: this.match,
      sort : {[this.sort.key] : this.sort.order}}
    this.onUpdate.emit()
  }


  onChangeOrder() {
    this.sort.order *= -1
    this.makeUpdate()
  }

  subscribeFilters() {
    //Name
    this.filterform.controls['best'].valueChanges.pipe(
      debounceTime(400),
    ).subscribe((id) => {
      if (!id) delete this.match.pair
      else if (this.searchMod === 'startWith') this.match.pair = {$regex: `^${id}`, $options: 'i'}
      else if (this.searchMod === 'endWith') this.match.pair = {$regex: `${id}$`, $options: 'i'}
      this.makeUpdate()
    })
  }
}
