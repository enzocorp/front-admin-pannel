import { Component, OnInit } from '@angular/core';
import {Asset} from "../../../models/asset";
import {HttpClient} from "@angular/common/http";
import {AssetsService} from "../../../services/http/assets.service";
import {SymbolsService} from "../../../services/http/symbols.service";
import {CryptoService} from "../../../services/http/crypto.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {Paginate} from "../../../models/pagination";


interface resp_data {
  metadata : {total : number},
  data : Asset[]
}

@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.scss']
})
export class AssetsComponent implements OnInit {

  constructor(
    private http : HttpClient,
    private assetsService : AssetsService,
    private symbolsServ : SymbolsService,
    private cryptoServ : CryptoService,
    private activatedRoute : ActivatedRoute,
    private router : Router,
  ) { }

  private subscription : Subscription = new Subscription()
  assets : Array<Asset> = []
  colors = ['green','default','gold','orange','red']
  strSeverities  : string[]
  pagination : {total : number,paginate : Paginate, index : number} = {
    total : null,
    paginate : {limit : 20, skip : 0 },
    index : 1
  }
  loading : boolean = true
  request : Paginate&{0: Object, 1 : Object} = {
    skip : this.pagination.paginate.skip,
    limit : this.pagination.paginate.limit,
    0 :{$match: {}}, //Gérer par le filtreur
    1:{$sort : {}} //Gérer par le filtreur
  }
  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<string>();
  arrChecked : Asset[] = []

  ngOnInit(): void {
    this.subscription.add(this.assetsService.assetsSubject.subscribe((assets : Asset[])=> {
      this.assets = assets
    } ))
    this.cryptoServ.getSeverities().subscribe(
      ({data})=> {
        this.strSeverities = data.sort((a, b) => a.severity - b.severity).map(severity => severity.description)
      })
  }

  /*-----------------------On update ----------------------------------*/

  onGroupUpdate(){
    this.onUpdate()
    this.setOfCheckedId.clear()
    this.arrChecked = []
    this.setOfCheckedId.clear()
    this.refreshCheckedStatus()
  }

  onUpdate(){
    if (!this.loading)
      this.loading = true
    this.request = {...this.request,skip : this.pagination.paginate.skip, limit : this.pagination.paginate.limit}
    this.assetsService.getAssets(this.request).subscribe(
      (resp: resp_data ) => {
        let assets : Asset[] = resp ? resp.data : []
        this.assetsService.emmitAssets(assets)
        this.pagination.total = resp?.metadata.total || 0
        this.refreshCheckedStatus()
        this.loading = false
      }
    )
  }


  /*----------------------Tableau---------------------*/
  updateCheckedSet(name: string, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(name);
      this.arrChecked.push(this.assets.find(asset => asset.name === name))
    } else {
      this.setOfCheckedId.delete(name);
      this.arrChecked = this.arrChecked.filter(asset => asset.name !== name)
    }
  }

  refreshCheckedStatus(): void {
    this.checked = this.assets.every(({ name }) => this.setOfCheckedId.has(name));
    this.indeterminate = (!!this.arrChecked.length && !this.checked) ||
      (!!this.arrChecked.length && !this.assets.some(({ name }) => this.setOfCheckedId.has(name)))
  }

  onItemChecked(name: string, checked: boolean): void {
    this.updateCheckedSet(name, checked);
    this.refreshCheckedStatus();
  }

  onAllChecked(checked: boolean): void {
    this.assets.forEach(({ name }) => this.updateCheckedSet(name, checked));
    this.refreshCheckedStatus();
  }

  /*--------------------- Navigation ------------------------*/

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }
}
