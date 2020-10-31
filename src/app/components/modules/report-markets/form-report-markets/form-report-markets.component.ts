import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {CryptoService} from "../../../../services/http/crypto.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Reason} from "../../../../models/reason";
import {Severity} from "../../../../models/severity";
import {Market} from "../../../../models/market";
import {MarketsService} from "../../../../services/http/markets.service";

@Component({
  selector: 'app-form-report-markets',
  templateUrl: './form-report-markets.component.html',
  styleUrls: ['./form-report-markets.component.scss']
})
export class FormReportMarketsComponent implements OnInit {

  constructor(private http: HttpClient,
              private marketServ : MarketsService,
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
  @Input() selectMultiple : boolean = false

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
    this.cryptoServ.getReasons(this.for).subscribe(({data}) => this.reasons = data)
    this.cryptoServ.getSeverities().subscribe(({data}) => this.severities = data)
    this.initForm()
    this.subscribeFilters()
  }

  initForm(){
    let market : Market = null
    let strMarkets : string[] = null
    if(this.markets.length === 1 && this.selectMultiple === false )
      market = this.markets[0]
    else if(this.selectMultiple)
      strMarkets = this.markets.map(market => market.name)

    this.exclusionForm = this.formBuilder.group({
      markets : [market?.name || strMarkets || null,Validators.required],
      reasons : [market?.exclusion.reasons ||null,[Validators.required]],
      note : [market?.exclusion.note || null ],
      severity : [market?.exclusion.severity ||null,[Validators.required]],
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
      this.cryptoServ.addReasons(newReasons).subscribe(
        (resp) => this.reasons.push(resp.data)
      )
    }
  }

  subscribeFilters(){
    //Banned
    if (!this.selectMultiple)
      this.exclusionForm.controls['markets'].valueChanges.subscribe(
        strMarket => {
          const market = this.markets.find(market => market.name === strMarket)
          if (market && market.exclusion.severity)
            this.exclusionForm.patchValue({
              note: market.exclusion.note || '',
              severity: market.exclusion.severity || null,
              reasons : market.exclusion.reasons || []
            })
        }
      )
    //Severity
    this.exclusionForm.controls['severity'].valueChanges.subscribe(
      value => {
        if(value=== 0)
          this.unbanIsSelect = true
        else if(this.unbanIsSelect === true)
          this.unbanIsSelect = false
      }
    )
  }

  checkValidity() : void{
    if (this.exclusionForm.invalid && !this.unbanIsSelect){
      for (const i in this.exclusionForm.controls) {
        this.exclusionForm.controls[i].markAsDirty();
        this.exclusionForm.controls[i].updateValueAndValidity();
      }
    }else if(this.exclusionForm.controls['markets'].invalid){
      this.exclusionForm.controls['markets'].markAsDirty();
      this.exclusionForm.controls['markets'].updateValueAndValidity();
    }
    else
      this.onSubmitToolTip()
  }

  onSubmitToolTip(){
    const formRefacto : Omit<Market['exclusion'],'excludeBy'|'isExclude'>&string[] = {
      ...this.exclusionForm.value,
      markets : this.selectMultiple ? this.exclusionForm.controls['markets'].value : [this.exclusionForm.controls['markets'].value]
    }
    if (this.unbanIsSelect){
      this.marketServ.unreportGroupMarket(formRefacto['markets']).subscribe(
        () => {
          this.afterUpdate.emit()
          this.visible = false
        }
      )
    }
    else
      this.marketServ.reportGroupMarket( formRefacto).subscribe(
        () => {
          this.afterUpdate.emit()
          this.visible = false
        })
    }



}
