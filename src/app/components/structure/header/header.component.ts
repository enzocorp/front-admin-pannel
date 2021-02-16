import { Component, OnInit } from '@angular/core';
import {ConfigService} from "../../../services/autre/config.service";
import {Global, graphConfig} from "../../../models/global";
import {CryptoService} from "../../../services/http/crypto.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private configServ : ConfigService,
              private cryptoServ : CryptoService) { }
  config : {collapsed: boolean, theme : boolean}
  coinapi : Global['coinapi']

  ngOnInit(): void {
    this.configServ.configSubject.subscribe(conf => this.config = conf)
    this.cryptoServ.coinapiSubject.subscribe(coinApiInfo => this.coinapi = coinApiInfo)
    this.refreshCoinapi()
  }

  refreshCoinapi(){
    this.cryptoServ.get_coinapi()
  }


}
