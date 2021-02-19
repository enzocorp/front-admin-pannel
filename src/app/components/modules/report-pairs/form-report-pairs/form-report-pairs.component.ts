import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {CryptoService} from "../../../../services/http/crypto.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Reason} from "../../../../models/reason";
import {Severity} from "../../../../models/severity";
import {Pair} from "../../../../models/pair";
import {PairsService} from "../../../../services/http/pairs.service";


const BAN_BASE = 'p55'
const BAN_QUOTE = 'p66'

@Component({
  selector: 'app-form-report-pairs',
  templateUrl: './form-report-pairs.component.html',
  styleUrls: ['./form-report-pairs.component.scss']
})
export class FormReportPairsComponent implements OnInit {

  constructor(private http: HttpClient,
              private pairServ : PairsService,
              private cryptoServ : CryptoService,
              private formBuilder : FormBuilder) {}

  @Output()
  afterUpdate : EventEmitter<void> = new EventEmitter<void>();
  exclusionForm : FormGroup
  for : string = 'pair'
  unbanIsSelect : boolean = false
  reasons : Array<Reason> = []
  severities : Array<Severity> = []
  @Input() pairs : Pair[]
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
    this.cryptoServ.getReasons(this.for).subscribe(({data}) => {
      //On filtre les raisons internes ( qui sont liées au ban d'un asset )
      this.reasons = data.filter(reason => ![BAN_BASE,BAN_QUOTE].includes(reason.status))
    })
    this.cryptoServ.getSeverities().subscribe(({data}) => this.severities = data)
    this.initForm()
    this.subscribeFilters()
  }

  initForm(){
    let pair : Pair = null
    let strPairs : string[] = null
    if(this.pairs.length === 1 && this.selectMultiple === false )
      pair = this.pairs[0]
    else if(this.selectMultiple)
      strPairs = this.pairs.map(pair => pair.name)

    this.exclusionForm = this.formBuilder.group({
      pairs : [pair?.name || strPairs || null,Validators.required],
      reasons : [pair?.exclusion.reasons ||null,[Validators.required]],
      note : [pair?.exclusion.note || null ],
      severity : [pair?.exclusion.severity ||null,[Validators.required]],
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
      this.exclusionForm.controls['pairs'].valueChanges.subscribe(
        strPair => {
          const pair = this.pairs.find(pair => pair.name === strPair)
          if (pair && pair.exclusion.severity)
            this.exclusionForm.patchValue({
              note: pair.exclusion.note || '',
              severity: pair.exclusion.severity || null,
              reasons : pair.exclusion.reasons || []
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
    }else if(this.exclusionForm.controls['pairs'].invalid){
      this.exclusionForm.controls['pairs'].markAsDirty();
      this.exclusionForm.controls['pairs'].updateValueAndValidity();
    }
    else
      this.onSubmitToolTip()
  }

  onSubmitToolTip(){
    const formRefacto : Omit<Pair['exclusion'],'excludeBy'|'isExclude'>&string[] = {
      ...this.exclusionForm.value,
      pairs : this.selectMultiple ? this.exclusionForm.controls['pairs'].value : [this.exclusionForm.controls['pairs'].value]
    }
    if (this.unbanIsSelect){
      this.pairServ.unreportGroupPair(formRefacto['pairs']).subscribe(
        () => {
          this.afterUpdate.emit()
          this.visible = false
        }
      )
    }
    else
      this.pairServ.reportGroupPair( formRefacto).subscribe(
        () => {
          this.afterUpdate.emit()
          this.visible = false
        })
    }



}
