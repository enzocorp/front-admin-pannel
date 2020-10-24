import { Component, OnInit } from '@angular/core';
import {ConfigService} from "../../../services/autre/config.service";
import {IGlobal} from "../../../models/global";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private configServ : ConfigService) { }
  config : {collapsed: boolean, theme : boolean}
  coinapi : IGlobal['coinapi']
  ngOnInit(): void {
    this.configServ.configSubject.subscribe(
      conf => this.config = conf
    )
    this.configServ.coinapiSubject.subscribe(
      coinApiInfo => this.coinapi = coinApiInfo
    )
    this.configServ.get_coinapi()
  }

}
