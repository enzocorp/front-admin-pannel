import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {MarketService} from "../../../../services/http/market.service";
import {CryptoService} from "../../../../services/http/crypto.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Reason} from "../../../../models/reason";
import {Severity} from "../../../../models/severity";
import {Market} from "../../../../models/market";

@Component({
  selector: 'app-form-report-markets',
  templateUrl: './form-report-markets.component.html',
  styleUrls: ['./form-report-markets.component.scss']
})
export class FormReportMarketsComponent implements OnInit {

  constructor(private http: HttpClient,
              private marketServ : MarketService,
              private cryptoServ : CryptoService,
              private formBuilder : FormBuilder) {}

  @Output()
  afterUpdate : EventEmitter<void> = new EventEmitter<void>();
  exclusionForm : FormGroup
  for : string = 'market'
  unbanIsSelect : boolean = false
  reasons : Array<Reason> = []
  severities : Array<Severity> = []
  @Input() markets : Market[]

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

  ngOnInit(): void {
    this.cryptoServ.getReasons(this.for).subscribe(cont => this.reasons = cont)
    this.cryptoServ.getSeverities().subscribe(cont => this.severities = cont)
    this.initForm()
  }

  initForm(){
    this.exclusionForm = this.formBuilder.group({
      markets : [null,Validators.required],
      reasons : [null,[Validators.required]],
      note : [null],
      severity : [null,[Validators.required]],
    })
  }

  onOpen(){
    this.unbanIsSelect  = false
    this.exclusionForm.reset()
  }

  addItem(input: HTMLInputElement): void {
    const status = this.for[0] + Date.now()
    const newReasons : Reason = {
      description : input.value,
      for : this.for,
      status : status
    }
    if (this.reasons.map(item => item.description).indexOf(input.value) === -1 && input.value.length) {
      this.cryptoServ.addReasons(newReasons).subscribe(
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
    if (this.exclusionForm.invalid && !this.unbanIsSelect){
      for (const i in this.exclusionForm.controls) {
        this.exclusionForm.controls[i].markAsDirty();
      }
      return
    }
    if (this.unbanIsSelect){
      const strMarkets = this.exclusionForm.get('markets').value
      this.marketServ.unreportGroupMarket(strMarkets).subscribe(
        () => {
          this.afterUpdate.emit()
          this.visible = false
        }
      )
    }
    else{
      this.marketServ.reportGroupMarket( this.exclusionForm.value).subscribe(
        () => {
          this.afterUpdate.emit()
          this.visible = false
        }
      )
    }
  }

}
