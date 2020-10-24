import { Injectable } from '@angular/core';
import {IGlobal} from "../../models/global";
import {BehaviorSubject, Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor(private http : HttpClient) { }
  configSubject = new BehaviorSubject<{collapsed: boolean, theme : boolean}>({
    collapsed : false,
    theme : false
  })
  url = 'http://localhost:3200/api1'
  coinapiSubject = new Subject<IGlobal['coinapi']>()

  emmitCoinapi(content : IGlobal['coinapi']) {
    this.coinapiSubject.next(content)
  }
  emmitConfig(content : {collapsed: boolean, theme : boolean}) {
    this.configSubject.next(content)
  }
  get_coinapi() : void{
    this.http.get(`${this.url}/crypto/coinapi`).subscribe(
      ({data} : {data : any}) => this.emmitCoinapi( data.coinapi)
    )
  }
}
