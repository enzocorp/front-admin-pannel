import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Pair} from "../../../models/pair";

@Component({
  selector: 'app-report-pairs',
  templateUrl: './report-pairs.component.html',
  styleUrls: ['./report-pairs.component.scss']
})
export class ReportPairsComponent implements OnInit {

  constructor() {}
  visible: boolean
  @Input()pair : Pair[]
  @Output()
  afterUpdate : EventEmitter<void> = new EventEmitter<void>();

  ngOnInit(): void {
  }


}
