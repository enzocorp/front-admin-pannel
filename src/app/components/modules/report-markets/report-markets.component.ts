import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Market} from "../../../models/market";

@Component({
  selector: 'app-report-markets',
  templateUrl: './report-markets.component.html',
  styleUrls: ['./report-markets.component.scss']
})
export class ReportMarketsComponent implements OnInit {

  constructor() {}
  visible: boolean
  @Input()markets : Market[]
  @Input()selectMultiple : boolean = false
  @Output()
  afterUpdate : EventEmitter<boolean> = new EventEmitter<boolean>();

  ngOnInit(): void {
  }


}
