import { Component } from '@angular/core';
import {ConfigService} from "./services/autre/config.service";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(
    private configServ : ConfigService,
    private titleServ : Title
              ) { }

  title = 'crypto-arbitrage';
  config :  {collapsed: boolean, theme : boolean}

  ngOnInit(): void {
    this.titleServ.setTitle(this.title)
    this.configServ.configSubject.subscribe(
      config => this.config = config
    )
  }

}
