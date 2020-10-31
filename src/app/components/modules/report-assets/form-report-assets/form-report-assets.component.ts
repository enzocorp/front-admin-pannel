import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {CryptoService} from "../../../../services/http/crypto.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Reason} from "../../../../models/reason";
import {Severity} from "../../../../models/severity";
import {Asset} from "../../../../models/asset";
import {AssetsService} from "../../../../services/http/assets.service";

@Component({
  selector: 'app-form-report-assets',
  templateUrl: './form-report-assets.component.html',
  styleUrls: ['./form-report-assets.component.scss']
})
export class FormReportAssetsComponent implements OnInit {

  constructor(private http: HttpClient,
              private assetServ : AssetsService,
              private cryptoServ : CryptoService,
              private formBuilder : FormBuilder) {}

  @Output()
  afterUpdate : EventEmitter<void> = new EventEmitter<void>();
  exclusionForm : FormGroup
  for : string = 'asset'
  unbanIsSelect : boolean = false
  reasons : Array<Reason> = []
  severities : Array<Severity> = []
  @Input() assets : Asset[]
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
    let asset : Asset = null
    let strAssets : string[] = null
    if(this.assets.length === 1 && this.selectMultiple === false )
      asset = this.assets[0]
    else if(this.selectMultiple)
      strAssets = this.assets.map(asset => asset.name)

    this.exclusionForm = this.formBuilder.group({
      assets : [asset?.name || strAssets || null,Validators.required],
      reasons : [asset?.exclusion.reasons ||null,[Validators.required]],
      note : [asset?.exclusion.note || null ],
      severity : [asset?.exclusion.severity ||null,[Validators.required]],
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
      this.exclusionForm.controls['assets'].valueChanges.subscribe(
        strAsset => {
          const asset = this.assets.find(asset => asset.name === strAsset)
          if (asset && asset.exclusion.severity)
            this.exclusionForm.patchValue({
              note: asset.exclusion.note || '',
              severity: asset.exclusion.severity || null,
              reasons : asset.exclusion.reasons || []
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
    }else if(this.exclusionForm.controls['assets'].invalid){
      this.exclusionForm.controls['assets'].markAsDirty();
      this.exclusionForm.controls['assets'].updateValueAndValidity();
    }
    else
      this.onSubmitToolTip()
  }

  onSubmitToolTip(){
    const formRefacto : Omit<Asset['exclusion'],'excludeBy'|'isExclude'>&string[] = {
      ...this.exclusionForm.value,
      assets : this.selectMultiple ? this.exclusionForm.controls['assets'].value : [this.exclusionForm.controls['assets'].value]
    }
    if (this.unbanIsSelect){
      this.assetServ.unreportGroupAsset(formRefacto['assets']).subscribe(
        () => {
          this.afterUpdate.emit()
          this.visible = false
        }
      )
    }
    else
      this.assetServ.reportGroupAsset( formRefacto).subscribe(
        () => {
          this.afterUpdate.emit()
          this.visible = false
        })
    }



}
