import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {CryptoService} from "../../../../services/http/crypto.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Reason} from "../../../../models/reason";
import {Severity} from "../../../../models/severity";
import {Symbol} from "../../../../models/symbol";
import {SymbolsService} from "../../../../services/http/symbols.service";

@Component({
  selector: 'app-form-report-symbols',
  templateUrl: './form-report-symbols.component.html',
  styleUrls: ['./form-report-symbols.component.scss']
})
export class FormReportSymbolsComponent implements OnInit {

  constructor(private http: HttpClient,
              private symbolServ : SymbolsService,
              private cryptoServ : CryptoService,
              private formBuilder : FormBuilder) {}

  @Output()
  afterUpdate : EventEmitter<void> = new EventEmitter<void>();
  exclusionForm : FormGroup
  for : string = 'symbol'
  unbanIsSelect : boolean = false
  reasons : Array<Reason> = []
  severities : Array<Severity> = []
  @Input() symbols : Symbol[]
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
    let symbol : Symbol = null
    let strSymbols : string[] = null
    if(this.symbols.length === 1 && this.selectMultiple === false )
      symbol = this.symbols[0]
    else if(this.selectMultiple)
      strSymbols = this.symbols.map(symbol => symbol.name)

    this.exclusionForm = this.formBuilder.group({
      symbols : [symbol?.name || strSymbols || null,Validators.required],
      reasons : [symbol?.exclusion.reasons ||null,[Validators.required]],
      note : [symbol?.exclusion.note || null ],
      severity : [symbol?.exclusion.severity ||null,[Validators.required]],
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
      this.exclusionForm.controls['symbols'].valueChanges.subscribe(
        strSymbol => {
          const symbol = this.symbols.find(symbol => symbol.name === strSymbol)
          if (symbol && symbol.exclusion.severity)
            this.exclusionForm.patchValue({
              note: symbol.exclusion.note || '',
              severity: symbol.exclusion.severity || null,
              reasons : symbol.exclusion.reasons || []
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
    }else if(this.exclusionForm.controls['symbols'].invalid){
      this.exclusionForm.controls['symbols'].markAsDirty();
      this.exclusionForm.controls['symbols'].updateValueAndValidity();
    }
    else
      this.onSubmitToolTip()
  }

  onSubmitToolTip(){
    const formRefacto : Omit<Symbol['exclusion'],'excludeBy'|'isExclude'>&string[] = {
      ...this.exclusionForm.value,
      symbols : this.selectMultiple ? this.exclusionForm.controls['symbols'].value : [this.exclusionForm.controls['symbols'].value]
    }
    if (this.unbanIsSelect){
      this.symbolServ.unreportGroupSymbol(formRefacto['symbols']).subscribe(
        () => {
          this.afterUpdate.emit()
          this.visible = false
        }
      )
    }
    else
      this.symbolServ.reportGroupSymbol( formRefacto).subscribe(
        () => {
          this.afterUpdate.emit()
          this.visible = false
        })
    }



}
