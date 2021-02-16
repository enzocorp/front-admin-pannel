import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {graphConfig} from "../../../models/global";
import {Subscription} from "rxjs";
import {ConfigService} from "../../../services/autre/config.service";
import {NzMarks} from "ng-zorro-antd";

@Component({
  selector: 'app-isfor-slider',
  templateUrl: './isfor-slider.component.html',
  styleUrls: ['./isfor-slider.component.scss']
})
export class IsforSliderComponent implements OnInit,OnDestroy {

  constructor(
    private configServ:ConfigService
  ) { }
  private subscription : Subscription = new Subscription()
  graphConfig : graphConfig
  marks : NzMarks = {}
  @Input() showTooltip : boolean = true

  ngOnInit(): void {
    this.subscription.add(this.configServ.isforSubject.subscribe((graph: graphConfig)=> this.graphConfig = graph ))
    this.makeMarks()
  }


  makeMarks(){
    for (let i:number = this.graphConfig.START_GRAPH; i <= this.graphConfig.END_GRAPH; i += this.graphConfig.END_GRAPH/5){
      this.marks[i] = {
        label: `</span><strong>${i}</strong>&nbsp;$`
      }
      if(i === this.graphConfig.START_GRAPH) {
        i -= this.graphConfig.START_GRAPH
      }
    }
  }

  onIsforChange(number){
    this.graphConfig.isfor = number
    this.configServ.emmitIsfor(this.graphConfig)
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

}
