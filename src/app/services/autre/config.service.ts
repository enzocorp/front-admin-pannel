import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {graphConfig} from "../../models/global";


@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor() { }
  configSubject = new BehaviorSubject<{collapsed: boolean, theme : boolean}>({
    collapsed : false,
    theme : false
  })
  isforSubject = new BehaviorSubject<graphConfig>({
    isfor : 2000,
    START_GRAPH :  200, //Point de depart du graphique
    END_GRAPH:  20000, //Point de fin du graphique
    PAS_GRAPH:  200 //Saut entre chaque points du graphique
  })
  url = location.protocol +'//'+ location.host + '/api1/crypto'


  emmitConfig(content : {collapsed: boolean, theme : boolean}) {
    this.configSubject.next(content)
  }

  emmitIsfor(graphConfig : graphConfig) {
    this.isforSubject.next(graphConfig)
  }

}
