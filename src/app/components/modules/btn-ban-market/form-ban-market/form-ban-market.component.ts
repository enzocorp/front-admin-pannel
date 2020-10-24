import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ExclusionService} from "../../../../services/http/exclusion.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Exchange} from "../../../../models/exchange";
import {ExclusionPair, Reason, Severity} from "../../../../models/exclusionPair";

@Component({
  selector: 'app-form-ban-market',
  templateUrl: './form-ban-market.component.html',
  styleUrls: ['./form-ban-market.component.scss']
})
export class FormBanMarketComponent implements OnInit {

  constructor(private http: HttpClient,
              private exclusionService : ExclusionService,
              private formBuilder : FormBuilder) {}

  @Output()
  afterUpdate : EventEmitter<void> = new EventEmitter<void>();
  exclusionForm : FormGroup
  for : string = 'exchange'
  unbanIsSelect : boolean = false
  isBan = false
  reasons : Array<Reason> = []
  severities : Array<Severity> = []

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

  marketValue : Exchange
  @Output()
  marketChange : EventEmitter<Exchange> = new EventEmitter<Exchange>();
  @Input()
  get market(){
    return this.marketValue;
  }
  set market(market : Exchange) {
    this.marketValue = market;
    this.marketChange.emit(this.marketValue);
  }

  ngOnInit(): void {
    this.isBan = this.market.exclusion.severity > 0
    const {exclusion} = this.market
    this.exclusionForm = this.formBuilder.group({
      reasons : [this.isBan ? exclusion.reasons : null,[Validators.required]],
      note : [''],
      severity : [this.isBan ? exclusion.severity : null,[Validators.required]],
    })
    this.exclusionService.getReasons(this.for).subscribe(cont => this.reasons = cont)
    this.exclusionService.getSeverities().subscribe(cont => this.severities = cont)
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

  onSeverityChange(value){
    if(value=== 0)
      this.unbanIsSelect = true
    else if(this.unbanIsSelect === true)
      this.unbanIsSelect = false
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
    if (this.unbanIsSelect){
      this.exclusionService.removeExclusionMarket(this.market.id_exchange).subscribe(
        (resp : Exchange) => {
          this.market = resp
          this.visible = false
          this.afterUpdate.emit()
        })
    }
    else{
      this.exclusionService.modifyExclusionMarket(this.market.id_exchange,formValues).subscribe(
        (resp : Exchange) => {
          this.market = resp
          this.visible = false
          this.afterUpdate.emit()
        })
    }
  }

}
