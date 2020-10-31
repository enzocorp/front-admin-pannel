import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor() { }
  configSubject = new BehaviorSubject<{collapsed: boolean, theme : boolean}>({
    collapsed : false,
    theme : false
  })
  url = location.protocol +'//'+ location.host + '/api1/crypto'



  emmitConfig(content : {collapsed: boolean, theme : boolean}) {
    this.configSubject.next(content)
  }

}
