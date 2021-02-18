import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Subject, Subscribable} from "rxjs";
import {Pair} from "../../models/pair";
import {Severity} from "../../models/severity";
import {Reason} from "../../models/reason";
import {Global} from "../../models/global";

@Injectable({
  providedIn: 'root'
})

export class CryptoService {


  constructor(private http : HttpClient) { }
  pairsSubject = new Subject<Pair[]>()
  coinapiSubject = new Subject<Global['coinapi']>()

  url = location.protocol +'//'+ location.host + '/api1/crypto'

  emmitCoinapi(content : Global['coinapi']) {
    this.coinapiSubject.next(content)
  }

  get_coinapi_infos() : void{
    this.http.get<{data : Global['coinapi']}>(`${this.url}/coinapi`).subscribe()
  }

  getSeverities() : Subscribable<{data : Severity[]}> {
    return this.http.get(`${this.url}/exclusion/severities`)
  }

  getReasons(queryParams = undefined) : Subscribable<{data : Reason[]}>{
    const obj = queryParams ? {for : queryParams} : {}
    return this.http.get(`${this.url}/exclusion/reasons`,{params : obj })
  }

  addReasons(body : Reason) : Subscribable<{data : Reason}> {
    return this.http.post(`${this.url}/exclusion/reasons`,body)
  }

  makeInit() : Subscribable<any>{
    return this.http.get(`${this.url}/init`)
  }

}
