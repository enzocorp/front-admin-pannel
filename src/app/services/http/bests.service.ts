import { Injectable } from '@angular/core';
import {Subject, Subscribable} from "rxjs";
import {Best} from "../../models/best";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class BestsService {

  bestsSubject = new Subject<Best[]>()
  url = location.protocol +'//'+ location.host + '/api1/bests'

  constructor(private http : HttpClient) { }

  emmitBests(content) {
    this.bestsSubject.next(content)
  }

  calculBests() : Subscribable<{data : string, [key: string]: any }> {
    return this.http.get(`${this.url}/calcul`)
  }

  resetBests() : Subscribable<any> {
    return this.http.get(`${this.url}/reset`)
  }

  getBests(filters = {}) : Subscribable<{data :Array<Best>, metadata : Array<{total : number}>}>{
    const filtersStr : string = JSON.stringify(filters)
    return this.http.get(`${this.url}`, {params: {filters : filtersStr}})
  }

  getBest(id) : Subscribable<Best>{
    return this.http.get(`${this.url}/${id}`)
  }

}
