import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Symbol} from "../../../models/symbol";

@Component({
  selector: 'app-report-symbols',
  templateUrl: './report-symbols.component.html',
  styleUrls: ['./report-symbols.component.scss']
})
export class ReportSymbolsComponent implements OnInit {

  constructor() {}
  visible: boolean
  @Input()symbols : Symbol[]
  @Input()selectMultiple : boolean = false
  @Output()
  afterUpdate : EventEmitter<boolean> = new EventEmitter<boolean>();

  ngOnInit(): void {
  }


}
