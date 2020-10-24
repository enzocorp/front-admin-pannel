import { Component, OnInit } from '@angular/core';
import {ConfigService} from "../../../services/autre/config.service";

@Component({
  selector: 'app-sider',
  templateUrl: './sider.component.html',
  styleUrls: ['./sider.component.scss']
})
export class SiderComponent implements OnInit {

  constructor(private configServ : ConfigService) { }
  openMap: { [name: string]: boolean } = {
    compte: false,
    pairs: false,
    markets: false,
    kalculator: false,
  }
  config :  {collapsed: boolean, theme : boolean}

  ngOnInit(): void {
    this.configServ.configSubject.subscribe(
      config => this.config = config
    )
  }

  changeConfig(bool){
    this.configServ.emmitConfig({
      ...this.config,
      theme : bool
    })
  }

  openHandler(value: string): void {
    for (const key in this.openMap) {
      if (this.openMap[key] === true && key !== value) {
        this.openMap[key] = false;
      }
    }
  }
}
