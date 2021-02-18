import { Injectable } from '@angular/core';
import {BehaviorSubject, Subject, Subscribable} from "rxjs";
import {GraphConfig} from "../../models/graphConfig";
import {Apikey} from "../../models/apikey";
import {HttpClient} from "@angular/common/http";


@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor(private http : HttpClient  ) { }

  configSubject = new BehaviorSubject<{collapsed: boolean, theme : boolean}>({
    collapsed : false,
    theme : false
  })
  keysSubject = new Subject<Apikey[]>()
  url = location.protocol +'//'+ location.host + '/api1/crypto'

  isforSubject = new BehaviorSubject<GraphConfig>({
    isfor : 2000,
    START_GRAPH :  200, //Point de depart du graphique
    END_GRAPH:  20000, //Point de fin du graphique
    PAS_GRAPH:  200 //Saut entre chaque points du graphique
  })



  emmitConfig(content : {collapsed: boolean, theme : boolean}) {
    this.configSubject.next(content)
  }

  emmitIsfor(graphConfig : GraphConfig) {
    this.isforSubject.next(graphConfig)
  }

  emmitApikeys(keys : Apikey[]) {
    this.keysSubject.next(keys)
  }

  getKeys():Subscribable<{data : Apikey[]}>{
    return this.http.get(`${this.url}/apikey`)
  }

  addKey(key : {key: string, mail? : string}):Subscribable<any>{
    return this.http.post(`${this.url}/apikey`,key)
  }

  removeApikey(key : string){
    return this.http.delete(`${this.url}/apikey/${key}`)
  }

  chooseOtherKey(key : string){
    return this.http.get(`${this.url}/apikey/choose/${key}`)
  }
}
