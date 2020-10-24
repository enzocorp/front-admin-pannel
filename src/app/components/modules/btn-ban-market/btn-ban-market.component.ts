import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Exchange} from "../../../models/exchange";

@Component({
  selector: 'app-btn-ban-market',
  templateUrl: './btn-ban-market.component.html',
  styleUrls: ['./btn-ban-market.component.scss']
})
export class BtnBanMarketComponent implements OnInit {

  constructor() {}

  visible: boolean
  @Input()market : Exchange
  color = ['#aaaaaa','gold','orange','red']
  @Output()
  afterUpdate : EventEmitter<Exchange> = new EventEmitter<Exchange>();

  ngOnInit(): void {
  }

}
