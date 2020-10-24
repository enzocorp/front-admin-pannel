import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ExclusionService} from "../../../../services/http/exclusion.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CryptoService} from "../../../../services/http/crypto.service";
import {Pair} from "../../../../models/pair";
import {ExclusionPair, Reason, Severity} from "../../../../models/exclusionPair";
import {Subscription} from "rxjs";
import {Exchange} from "../../../../models/exchange";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit, OnDestroy{

  constructor(private http: HttpClient,
              private exclusionService : ExclusionService,
              private formBuilder : FormBuilder,
              private cryptoServ : CryptoService) {}

  color = ['#aaaaaa','gold','orange','red']
  exclusionForm : FormGroup
  for : string = 'symbole'
  unban : boolean = false
  reasons : Array<Reason> = []
  severities : Array<Severity> = []
  selectedMarketIsBan : boolean = false

  @Output()
  afterSubmit : EventEmitter<void> = new EventEmitter<void>();

  visibleValue : boolean = false
  @Output()
  visibleChange : EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input()
  get visible(){
    return this.visibleValue;
  }
  set visible(bool : boolean) {
    this.visibleValue = bool;
    this.visibleChange.emit(this.visibleValue);
  }

  marketsValue : Array<{market : string, severity : number }> = []
  @Output()
  marketsChange : EventEmitter<{market : string, severity : number }[]> = new EventEmitter<{market : string, severity : number }[]>();
  @Input()
  get markets() : Array<{market : string, severity : number }> {
    return this.marketsValue;
  }
  set markets(markets : Array<{market : string, severity : number }>) {
    this.marketsValue = markets;
    this.marketsChange.emit(markets);
  }

  pairValue : Pair = undefined
  @Output()
  pairChange : EventEmitter<Pair> = new EventEmitter<Pair>();
  @Input()
  get pair() : Pair{
    return this.pairValue;
  }
  set pair(pair : Pair) {
    this.pairValue = pair;
    this.pairChange.emit(pair);
  }

  ngOnInit(): void {
    this.initForm()
    this.setMarketIsBan()
    this.exclusionService.getReasons(this.for).subscribe(cont => this.reasons = cont)
    this.exclusionService.getSeverities().subscribe(cont => this.severities = cont)
  }

  initForm (){
    const isAll = this.markets.length === 1 && this.markets[0].market === '*'
    const exclusion = this.markets.length === 1 &&
      this.pair.exclusion.fromMarkets.find(item => item.market === this.markets[0].market)
    const market = this.markets.length === 1 && this.markets[0].market
    this.exclusionForm = this.formBuilder.group({
      reasons : [exclusion ? exclusion.reasons : null,[Validators.required]],
      note : [exclusion ? exclusion.note : ''],
      market : [market ? exclusion?.market || market : null,[Validators.required]],
      severity : [exclusion ? exclusion.severity : null,[Validators.required]],
    })
  }

  addItem(input: HTMLInputElement): void {
    const status = this.for[0] + Date.now()
    const newReasons : Reason = {
      description : input.value,
      for : this.for,
      status : status
    }
    if (this.reasons.map(item => item.description).indexOf(input.value) === -1 && input.value.length) {
      this.exclusionService.addReasons(newReasons).subscribe(
        (resp) => this.reasons.push(resp.data)
      )
    }
  }


  onMarketChange(value){
    this.setMarketIsBan(value)
    if (this.selectedMarketIsBan) {
      const exclusion = this.pair.exclusion.fromMarkets.find(item => item.market === value)
      const {severity,note,reasons} = exclusion
      this.exclusionForm.patchValue({severity, note, reasons})
    } else if(value != null){
      this.exclusionForm.patchValue({
        note: '',
        severity: null,
        reasons : null
      })
    }
  }

  onSeverityChange(value){
    if(value=== 0)
      this.unban = true
    else if(this.unban === true)
      this.unban = false
  }

  setMarketIsBan(thisMarket : string = ''){
    const market = thisMarket || this.exclusionForm.value.market
    const selected = this.markets.find(item=> item.market === market)
    this.selectedMarketIsBan = !!(selected && this.pair.exclusion.fromMarkets
      .find(item => item.market === selected.market))
  }

  onSubmitToolTip(){
    if (this.exclusionForm.invalid){
      for (const i in this.exclusionForm.controls) {
        this.exclusionForm.controls[i].markAsDirty();
        this.exclusionForm.controls[i].updateValueAndValidity();
      }
      return
    }
    const formValues : ExclusionPair = this.exclusionForm.value
    this.setMarketIsBan()
    if (this.unban){
      this.exclusionService.removeExclusionPair(this.pair.name, formValues.market).subscribe(
        resp => {
          this.pair = resp
          this.afterSubmit.emit()
          this.visible = false
        }
      )
    }
    else if(this.selectedMarketIsBan) {
      this.exclusionService.updateExclusionPair(this.pair.name,formValues).subscribe(
        resp => {
          this.pair = resp
          this.afterSubmit.emit()
          this.visible = false
        }
      )
    }
    else{
      this.exclusionService.addExclusionPair(this.pair.name,formValues).subscribe(
        resp => {
          this.pair = resp
          this.afterSubmit.emit()
          this.visible = false
        }
      )
    }
  }

  ngOnDestroy() {
  }

}
