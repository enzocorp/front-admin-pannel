import { Injectable } from '@angular/core';
import {Subject, Subscribable} from "rxjs";
import {Asset} from "../../models/asset";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AssetsService {

  assetsSubject = new Subject<Asset[]>()
  url = location.protocol +'//'+ location.host + '/api1/assets'

  constructor(private http : HttpClient) { }

  emmitAssets(content : Asset[]) {
    this.assetsSubject.next(content)
  }

  getAssets(filters = {}) : Subscribable<{data :Array<any&Asset>, metadata : Array<{total : number}>}>{
    const filtersStr : string = JSON.stringify(filters)
    return this.http.get(`${this.url}`,{params: {filters : filtersStr}})
  }

  getAsset(name :string) : Subscribable<{ data : Asset }>{
    return this.http.get(`${this.url}/${name}`)
  }

  unreportGroupAsset(names : string[]) : Subscribable<any>{
    return this.http.post(`${this.url}/unreport`,{data : names})
  }
  reportGroupAsset(data : Omit<Asset['exclusion'],'excludeBy'|'isExclude'>&string[]) : Subscribable<any>{
    return this.http.post(`${this.url}/report`, {data})
  }
}
