import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {CryptoService} from "../../../../services/http/crypto.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Reason} from "../../../../models/reason";
import {Severity} from "../../../../models/severity";
import {Pair} from "../../../../models/pair";
import {PairsService} from "../../../../services/http/pairs.service";

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
  }

  initForm(){
    this.exclusionForm = this.formBuilder.group({
      pairs : [null,Validators.required],
      reasons : [null,[Validators.required]],
      note : [null],
      severity : [null,[Validators.required]],
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
      const strPairs = this.exclusionForm.get('pairs').value
      this.pairServ.unreportGroupPair(strPairs).subscribe(
        () => {
          this.afterUpdate.emit()
          this.visible = false
        }
      )
    }
    else{
      this.pairServ.reportGroupPair( this.exclusionForm.value).subscribe(
        () => {
          this.afterUpdate.emit()
          this.visible = false
        }
      )
    }
  }
}
