import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Asset} from "../../../models/asset";

@Component({
  selector: 'app-report-assets',
  templateUrl: './report-assets.component.html',
  styleUrls: ['./report-assets.component.scss']
})
export class ReportAssetsComponent implements OnInit {

  constructor() {}
  visible: boolean
  @Input()assets : Asset[]
  @Input()selectMultiple : boolean = false
  @Output()
  afterUpdate : EventEmitter<boolean> = new EventEmitter<boolean>();

  ngOnInit(): void {
  }


}
