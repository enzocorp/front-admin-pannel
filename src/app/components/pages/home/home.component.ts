import {Component, OnDestroy, OnInit} from '@angular/core';
import {CryptoService} from "../../../services/http/crypto.service";
import {Pair} from "../../../models/pair";
import {MongoPaginate, Paginate} from "../../../models/pagination";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  constructor(
    private cryptoService : CryptoService
  ) { }

  sub : Subscription = new Subscription()

  pagination : {total : number, loading : boolean, paginate : Paginate, index : number} = {
    total : 0,
    loading : false,
    paginate : {limit : 20, skip : 0 },
    index : 1
  }
  pairs : Pair[] = []
  request : MongoPaginate = {}

  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<string>();

  ngOnInit(): void {
    this.sub.add(this.cryptoService.pairsSubject.subscribe(
      pairs => {
        this.pairs = pairs
        this.pagination.loading = false
      }
    ))
    this.onUpdate()
  }

  updateCheckedSet(name: string, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(name);
    } else {
      this.setOfCheckedId.delete(name);
    }
  }

  refreshCheckedStatus(): void {
    console.log('refresh')
    this.checked = this.pairs.every(({ name }) => this.setOfCheckedId.has(name));
    this.indeterminate = this.pairs.some(({ name }) => this.setOfCheckedId.has(name)) && !this.checked;
  }

  onItemChecked(name: string, checked: boolean): void {
    this.updateCheckedSet(name, checked);
    this.refreshCheckedStatus();
  }

  onAllChecked(checked: boolean): void {
    this.pairs.forEach(({ name }) => this.updateCheckedSet(name, checked));
    this.refreshCheckedStatus();
  }

  onUpdate(){
    this.request = {...this.request,...this.pagination.paginate}
    this.cryptoService.getPairsv2(this.request).subscribe(
      (resp) => {
        this.cryptoService.emmitPairs(resp.data)
        this.refreshCheckedStatus()
        this.pagination.total = resp.metadata[0].total
      }
    )
  }

  test(){
    const list =[... this.setOfCheckedId.values()]
    this.setOfCheckedId.clear()
    this.refreshCheckedStatus()
    console.log('list',list,'clear',this.setOfCheckedId.values());
  }

  ngOnDestroy() {
    this.sub.unsubscribe()
  }

}
