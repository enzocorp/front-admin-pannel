import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Subject, Subscribable} from "rxjs";
import {Pair} from "../../models/pair";

@Injectable({
  providedIn: 'root'
})

export class CryptoService {


  pairsSubject = new Subject<Pair[]>()
  url = location.protocol +'//'+ location.host + '/api1/crypto'

  constructor(private http : HttpClient) { }

  emmitPairs(content : Pair[]) {
    this.pairsSubject.next(content)
  }

  getPairsv2(filters = {}): Subscribable<{data :Array<any>, metadata : Array<{total : number}>}>{
    const filtersStr : string = JSON.stringify(filters)
    return this.http.get(`${this.url}/pairsv2`, {params: {filters : filtersStr}})
  }

  getPair(name) : Subscribable<Pair>{
    return this.http.get(`${this.url}/pairs/${name}`)
  }

  resetMoyennes() : Subscribable<any>{
    return this.http.get(`${this.url}/pairs/resetMoyennes`)
  }

  makeInit() : Subscribable<any>{
    return this.http.get(`${this.url}/init`)
  }

}
