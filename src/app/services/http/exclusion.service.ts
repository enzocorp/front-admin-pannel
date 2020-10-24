import { Injectable } from '@angular/core';
import {Subscribable} from "rxjs";
import {Pair} from "../../models/pair";
import {HttpClient} from "@angular/common/http";
import {ExclusionMarket, ExclusionPair, Reason, Severity} from "../../models/exclusionPair";
import {Exchange} from "../../models/exchange";

@Injectable({
  providedIn: 'root'
})
export class ExclusionService {

  url = location.protocol + '//' + location.host + '/api1/exclusions'
  constructor(private http: HttpClient) {
  }

  getSeverities() : Subscribable<Severity[]> {
    return this.http.get(`${this.url}/severities`)
  }

  getReasons(queryParams = undefined) : Subscribable<Reason[]>{
    const obj = queryParams ? {for : queryParams} : {}
    return this.http.get(`${this.url}/reasons`,{params : obj })
  }

  addReasons(body : Reason) : Subscribable<{data : Reason}> {
    return this.http.post(`${this.url}/reasons`,body)
  }

  addExclusionPair(name : string,body : ExclusionPair) : Subscribable<Pair>{
    return this.http.post(`${this.url}/pair/${name}`,body)
  }

  updateExclusionPair(name : string,body : ExclusionPair) : Subscribable<Pair>{
    return this.http.put(`${this.url}/pair/${name}`,body)
  }

  removeExclusionPair(name : string,market : string) : Subscribable<Pair>{
      return this.http.delete(`${this.url}/pair/${name}`,{params : {market : market}})
  }

  modifyExclusionMarket(id : string, body : ExclusionMarket) : Subscribable<Exchange>{
    return this.http.put(`${this.url}/exchange/${id}`,body)
  }
  removeExclusionMarket(id : string) : Subscribable<Exchange>{
    return this.http.delete(`${this.url}/exchange/${id}`)
  }
  unreportGroupMarket(ids : string[]) : Subscribable<any>{
    return this.http.post(`${this.url}/exchange/unreport/group`,{list : ids})
  }
  reportGroupMarket(ids : string[], data : ExclusionMarket) : Subscribable<any>{
    return this.http.post(`${this.url}/exchange/report/group`,{list : ids,data})
  }
  unreportGroupPair(ids : string[]) : Subscribable<any>{
    return this.http.post(`${this.url}/pair/unreport/group`,{list : ids})
  }
  reportGroupPair(ids : string[], data : ExclusionPair) : Subscribable<any>{
    return this.http.post(`${this.url}/pair/report/group`,{list : ids,data})
  }



}


