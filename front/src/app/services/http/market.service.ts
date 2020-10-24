import { Injectable } from '@angular/core';
import { Subject, Subscribable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Exchange} from "../../models/exchange";
import {Pair} from "../../models/pair";

@Injectable({
  providedIn: 'root'
})
export class MarketService {



  marketsSubject = new Subject<Exchange[]>()
  url = location.protocol +'//'+ location.host + '/api1/markets'

  constructor(private http : HttpClient) { }

  emmitMarkets(content : Exchange[]) {
    this.marketsSubject.next(content)
  }

  getMarkets(filters = {}) : Subscribable<{data :Array<any>, metadata : Array<{total : number}>}>{
    const filtersStr : string = JSON.stringify(filters)
    return this.http.get(`${this.url}`,{params: {filters : filtersStr}})
  }

  getMarket(id :string) : Subscribable<Exchange>{
    return this.http.get(`${this.url}/${id}`)
  }

  getPodiumPairs(id : string,moyenne : string,sort : string) : Subscribable<any>{
    return this.http.get(`${this.url}/podiumpairs/${id}`, {params : {moyenne,sort}})
  }

  resetMoyennes() : Subscribable<Exchange>{
    return this.http.get(`${this.url}/reset`)
  }

}
