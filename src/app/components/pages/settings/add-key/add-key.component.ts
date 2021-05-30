import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ConfigService} from "../../../../services/autre/config.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-add-key',
  templateUrl: './add-key.component.html',
  styleUrls: ['./add-key.component.scss']
})
export class AddKeyComponent implements OnInit {

  constructor(
    private configServ : ConfigService,
    private formBuilder : FormBuilder,
  ) { }

  formApikey : FormGroup
  @Output() afterSubmit : EventEmitter<void> = new EventEmitter<void>();

  ngOnInit(): void {
    this.initform()
  }

  initform(){
    this.formApikey = this.formBuilder.group({
      mail : ["pasdemail@gmail.com"],
      key : [null,Validators.required],
    })
  }

  onSubmit(){
    this.configServ.addKey(this.formApikey.value).subscribe(
      () => this.afterSubmit.emit()
    )
  }

}
