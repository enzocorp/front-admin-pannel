import { Component, OnInit } from '@angular/core';
import {ConfigService} from "../../../services/autre/config.service";
import {CryptoService} from "../../../services/http/crypto.service";
import {Apikey} from "../../../models/apikey";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private configServ : ConfigService,
              private cryptoServ : CryptoService) { }
  config : {collapsed: boolean, theme : boolean}
  apikey : Apikey

  ngOnInit(): void {
    this.configServ.configSubject.subscribe(conf => this.config = conf)
    this.cryptoServ.coinapiSubject.subscribe(apikey => this.apikey = apikey)
    this.refreshCoinapi()
  }

  refreshCoinapi(){
    this.cryptoServ.get_coinapi_infos()
  }

}
