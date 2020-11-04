import { Injectable } from '@angular/core';
import {Subject, Subscribable} from "rxjs";
import {Pair} from "../../models/pair";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class PairsService {

  pairsSubject = new Subject<Pair[]>()
  url = location.protocol +'//'+ location.host + '/api1/pairs'

  constructor(private http : HttpClient) { }

  emmitPairs(content : Array<Pair&any>) {
    this.pairsSubject.next(content)
  }

  getPairs(request = {}) : Subscribable<{data : Object}&any>{
    const strRequest : string = JSON.stringify(request)
    return this.http.get(`${this.url}`,{params: {request : strRequest}})
  }

  getPair(name :string) : Subscribable<{ data : Pair }>{
    return this.http.get(`${this.url}/${name}`)
  }

  unreportGroupPair(names : string[]) : Subscribable<any>{
    return this.http.post(`${this.url}/unreport`,{data : names})
  }
  reportGroupPair(data : Omit<Pair['exclusion'],'excludeBy'|'isExclude'>&string[]) : Subscribable<any>{
    return this.http.post(`${this.url}/report`, {data})
  }
  resetMoyennes() : Subscribable<any>{
    return this.http.get(`${this.url}/resetMoyennes`)
  }

}
