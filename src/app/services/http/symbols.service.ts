import { Injectable } from '@angular/core';
import {Subject, Subscribable} from "rxjs";
import {Symbol} from "../../models/symbol";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class SymbolsService {

  symbolsSubject = new Subject<Symbol[]>()
  url = location.protocol +'//'+ location.host + '/api1/symbols'

  constructor(private http : HttpClient) { }

  emmitSymbols(content : Symbol[]) {
    this.symbolsSubject.next(content)
  }

  getSymbols(filters = {}) : Subscribable<{data :Array<any&Symbol>, metadata : Array<{total : number}>}>{
    const filtersStr : string = JSON.stringify(filters)
    return this.http.get(`${this.url}`,{params: {filters : filtersStr}})
  }

  getSymbol(name :string) : Subscribable<{ data : Symbol }>{
    return this.http.get(`${this.url}/${name}`)
  }

  unreportGroupSymbol(names : string[]) : Subscribable<any>{
    return this.http.post(`${this.url}/unreport`,{data : names})
  }
  reportGroupSymbol(data : Omit<Symbol['exclusion'],'excludeBy'|'isExclude'>&string[]) : Subscribable<any>{
    return this.http.post(`${this.url}/report`, {data})
  }
}
