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

  getBests(request = {}) : Subscribable<{data : Object}&any>{
    const strRequest : string = JSON.stringify(request)
    return this.http.get(`${this.url}`,{params: {request : strRequest}})
  }

  getLastGroupId() : Subscribable<{ data : string }>{
    return this.http.get(`${this.url}/groupId`)
  }

  getBest(id) : Subscribable<Best>{
    return this.http.get(`${this.url}/${id}`)
  }

}
