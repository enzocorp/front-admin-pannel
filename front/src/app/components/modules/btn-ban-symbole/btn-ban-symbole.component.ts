import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Pair} from "../../../models/pair";

@Component({
  selector: 'app-btn-ban-symbole',
  templateUrl: './btn-ban-symbole.component.html',
  styleUrls: ['./btn-ban-symbole.component.scss']
})
export class BtnBanSymboleComponent implements OnInit {

  @Input()markets_id : Array<string>
  @Input()pair : Pair
  visible: boolean
  tabColor = ['#aaaaaa','gold','orange','red']
  markets_object : Array<{severity : number, market : string}>
  pairBan : {
    fromAll : boolean,
    fromSome : number,
    color : number,
  } = {fromAll :  false, fromSome : 0, color : 0}

  @Output()
  afterUpdate : EventEmitter<Pair> = new EventEmitter<Pair>();


  ngOnInit(): void {
    this.markets_object = this.markets_id.map(marketid => ({
      market : marketid,
      severity : this.pair.exclusion.fromMarkets.find(item=> item.market === marketid)?.severity
    }))
    this.verifyBan()
  }

  updateData(){
    this.ngOnInit()
    this.afterUpdate.emit(this.pair)
  }

  verifyBan(){
    const pairBan = this.pair.exclusion.fromMarkets
      .filter(item => this.markets_id.includes(item.market))
    this.pairBan.fromAll = pairBan.find(item=> item.market === '*') && pairBan.length === 1
    if(this.pairBan.fromAll)
      this.pairBan.color = this.markets_object[0].severity - 1
    else
      this.pairBan.color = null

    if(!this.pairBan.fromAll){
      let count = 0
      pairBan.filter(item => item.market !== '*').forEach(()=> count++)
      this.pairBan.fromSome = count
      if (count === 1 && this.markets_object.length === 1)
        this.pairBan.color = this.markets_object[0].severity - 1
      else if(this.markets_id.length > 1)
        this.pairBan.color = 2
      else
        this.pairBan.color = null
    }
  }
}
