import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {BehaviorSubject, Subject} from "rxjs";
import {Podium} from "../../../../../models/podium";
import {BaseChartDirective, Label} from "ng2-charts";
import {ChartDataSets} from "chart.js";
import {Best, BestFor} from "../../../../../models/best";
import {Pair} from "../../../../../models/pair";
import {Asset} from "../../../../../models/asset";


interface BestPlus extends Omit<Best,'pair'|'base'|'quote'> {
  pair : Pair
  base : Asset
  quote : Asset
}

@Component({
  selector: 'app-chart-best',
  templateUrl: './chart-best.component.html',
  styleUrls: ['./chart-best.component.scss']
})

export class ChartBestComponent implements OnInit {

  constructor() { }

  @ViewChild(BaseChartDirective) chartRef: BaseChartDirective;
  @Input() bestSubject : BehaviorSubject<BestPlus>
  best : BestPlus

  lineChartOptions = {
    tooltips: {
      callbacks: {
        title : (context) => {
          const {isfor, index} : { isfor: BestFor, index : number } = JSON.parse(context[0].label)
          return `Pour : ${index}$ : Achat: ${isfor.buy.market} ---- Vente: ${isfor.sell.market}`
        },
        label: (context) => {
          const {isfor, index} : { isfor: BestFor, index : number } = JSON.parse(context.label)
          return `Bénéfices : ${(+isfor.spread_usd.toFixed(2)).toLocaleString()} $`
        }
      }
    },
    responsive: true,
    scales: {
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'rentabilité'
        },
        ticks: {
          callback: (value) => '+' + value + ' $' },
      }],
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'dollars investis'
        },
        ticks: {  callback: (value) => {
            const {index} : {index: number} = JSON.parse(value)
            return "$ " + index
          }}
      }]
    },
  }

  lineChart : {xLabels : Label[], yData : ChartDataSets[]} = {
    xLabels : [],
    yData : []
  }

  ngOnInit(): void {
    this.bestSubject.subscribe((best : BestPlus)=>{
      this.best = best
      const obj = {data : [], label : "Bénéfices / dollars investis"}
      const xAxis : Label[] = []
      for(const num in this.best.isfor){
        xAxis.push( JSON.stringify({isfor: this.best.isfor[+num], index : +num })  )
        obj.data.push(this.best.isfor[+num].spread_usd.toFixed(1))
      }
      this.lineChart.xLabels = xAxis
      this.lineChart.yData = [obj]
    })
  }

  onLogarithm(){
    if (this.chartRef.chart.options.scales.yAxes[0]["type"] === "logarithmic" )
      this.chartRef.chart.options.scales.yAxes[0]["type"] = undefined
    else
      this.chartRef.chart.options.scales.yAxes[0]["type"] = "logarithmic"
    this.chartRef.chart.update()
  }

}
