import { Component, OnInit } from '@angular/core';
import {ConfigService} from "../../../services/autre/config.service";
import {Apikey} from "../../../models/apikey";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor(
    private configServ : ConfigService
  ) { }

  keys : Apikey[] = []

  ngOnInit(): void {
    this.configServ.keysSubject.subscribe((keys) => this.keys = keys)
    this.reload()
  }

  reload(){
    this.configServ.getKeys().subscribe(({data})=> this.configServ.emmitApikeys(data))
  }

  removeKey(key : string){
    this.configServ.removeApikey(key).subscribe( ()=> this.reload())
  }

  chooseThisKey(key : string){
    this.configServ.chooseOtherKey(key).subscribe(()=> this.reload())
  }

}
