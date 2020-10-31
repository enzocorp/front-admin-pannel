import { Injectable } from '@angular/core';
import { Subject, Subscribable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Market} from "../../models/market";

@Injectable({
  providedIn: 'root'
})
export class MarketsService {

  marketsSubject = new Subject<Market[]>()
  url = location.protocol +'//'+ location.host + '/api1/markets'

  constructor(private http : HttpClient) { }

  emmitMarkets(content : Market[]) {
    this.marketsSubject.next(content)
  }

  getMarkets(filters = {}) : Subscribable<{data :Array<any&Market>, metadata : Array<{total : number}>}>{
    const filtersStr : string = JSON.stringify(filters)
    return this.http.get(`${this.url}`,{params: {filters : filtersStr}})
  }

  getMarket(name :string) : Subscribable<{ data : Market }>{
    return this.http.get(`${this.url}/${name}`)
  }

  unreportGroupMarket(names : string[]) : Subscribable<any>{
    return this.http.post(`${this.url}/unreport`,{data : names})
  }
  reportGroupMarket(data : Omit<Market['exclusion'],'excludeBy'|'isExclude'>&string[]) : Subscribable<any>{
    return this.http.post(`${this.url}/report`, {data})
  }
}
