import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ExclusionService} from "../../../../services/http/exclusion.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ExclusionPair, Reason, Severity} from "../../../../models/exclusionPair";

@Component({
  selector: 'app-ban-group-pairs',
  templateUrl: './ban-group-pairs.component.html',
  styleUrls: ['./ban-group-pairs.component.scss']
})
export class BanGroupPairsComponent implements OnInit {

  constructor(private http: HttpClient,
              private exclusionService : ExclusionService,
              private formBuilder : FormBuilder) {}

  @Output()
  afterUpdate : EventEmitter<void> = new EventEmitter<void>();
  exclusionForm : FormGroup
  for : string = 'symbole'
  unbanIsSelect : boolean = false
  reasons : Array<Reason> = []
  severities : Array<Severity> = []
  @Input() pairsList : string[]
  visibleValue : boolean = false
  get visible(){
    return this.visibleValue;
  }
  set visible(bool : boolean) {
    bool ? this.onOpen() : null
    this.visibleValue = bool;
  }
  ngOnInit(): void {
    this.exclusionService.getReasons(this.for).subscribe(cont => this.reasons = cont)
    this.exclusionService.getSeverities().subscribe(cont => this.severities = cont)
    this.initForm()
  }

  initForm(){
    this.exclusionForm = this.formBuilder.group({
      market : ['*'],
      reasons : [null,[Validators.required]],
      note : [null],
      severity : [null,[Validators.required]],
    })
  }

  onOpen(){
    this.unbanIsSelect  = false
    this.exclusionForm.reset({
      market : '*',
      reasons : null,
      note : null,
      severity : null,
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
    const formValues : ExclusionPair = this.exclusionForm.value
    console.log(formValues)
    if (this.unbanIsSelect){
      console.log('unban')
      this.exclusionService.unreportGroupPair(this.pairsList).subscribe(
        () => {
          this.afterUpdate.emit()
          this.visible = false
        }
      )
    }
    else{
      console.log('ban ban')
      this.exclusionService.reportGroupPair(this.pairsList, formValues).subscribe(
        () => {
          this.afterUpdate.emit()
          this.visible = false
        }
      )
    }
  }


}
