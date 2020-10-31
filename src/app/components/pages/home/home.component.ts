import {Component, OnDestroy, OnInit} from '@angular/core';
import {CryptoService} from "../../../services/http/crypto.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  constructor(
    private cryptoService : CryptoService
  ) { }

  ngOnInit(): void {
  }


  makeInit(){
    this.cryptoService.makeInit().subscribe()
  }

  ngOnDestroy() {
  }

}
