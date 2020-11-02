import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Paginate} from "../../../models/pagination";

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {

  constructor() { }

  @Input()limitOptions = [10,20,30,50,100,300]
  paginateValue : Paginate = {
    limit : 20,
    skip : 0
  }
  @Input() total : number
  @Output() onUpdate : EventEmitter<Paginate> = new EventEmitter<Paginate>();

  @Output()
  paginateChange : EventEmitter<Paginate> = new EventEmitter<Paginate>();
  @Input()
  get paginate(){
    return this.paginateValue;
  }
  set paginate(obj : Paginate ) {
    this.paginateValue = obj;
    this.paginateChange.emit(this.paginateValue)
  }

  indexValue : number = 1
  @Output()
  indexChange : EventEmitter<number> = new EventEmitter<number>();
  @Input()
  get index(){
    return this.indexValue;
  }
  set index(bool : number ) {
    this.indexValue = bool;
    this.indexChange.emit(bool)
  }

  ngOnInit(): void {}

  makeUpdata(){
    this.onUpdate.emit(this.paginateValue)
  }

  onLimitChange(newLimit : number){
    this.paginate.limit = newLimit
    this.makeUpdata()
  }

  onIndexChange(newIndex : number){
    this.index = newIndex
    this.paginate.skip = (newIndex-1) * this.paginate.limit
    this.makeUpdata()
  }

}
