
import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ChartDataSets} from "chart.js";
import {BaseChartDirective, Label} from "ng2-charts";
import {Subject} from "rxjs";
import {Podium} from "../../../../models/podium";

@Component({
  selector: 'app-chart-podium',
  templateUrl: './chart-podium.component.html',
  styleUrls: ['./chart-podium.component.scss']
})
export class ChartPodiumComponent implements OnInit {

  constructor() { }

  @ViewChild(BaseChartDirective) chartRef: BaseChartDirective;

  @Input() podiumSubject : Subject<Podium[]>
  podiumBests : Podium[]

  lineChartOptions = {
    title : {
      display: true,
      text: "Graph des meilleurs paires pour chaque tranche de prix"
    },
    tooltips: {
      callbacks: {
        title : (context) => {
          const item : Podium = JSON.parse(context[0].label)
          return `La pair ${item.pair} pour ${item.index}$`
        },
        label: (context) => {
          const item : Podium = JSON.parse(context.label)
          return `Bénéfices : ${(+item.spread_usd.toFixed(2)).toLocaleString()} $`
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
        ticks: {  callback: (value) => '+' + value + ' $' },
      }],
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'dollars investis'
        },
        ticks: {  callback: (value) => {
            const item : Podium = JSON.parse(value)
            return "$ " + item.index
        }}
      }]
    },
  }

  lineChart : {xLabels : Label[], yData : ChartDataSets[]} = {
    xLabels : [],
    yData : []
  }

  onLogarithm(){
    if (this.chartRef.chart.options.scales.yAxes[0]["type"] === "logarithmic" )
      this.chartRef.chart.options.scales.yAxes[0]["type"] = undefined
    else
      this.chartRef.chart.options.scales.yAxes[0]["type"] = "logarithmic"
    this.chartRef.chart.update()
  }

  ngOnInit(): void {
    this.podiumSubject.subscribe( (podium : Podium[]) => {
      this.podiumBests = podium.sort((a,b)=> a.index - b.index)
      const obj = {data : [], label : "Bénéfices / dollars investis"}
      const xAxis : Label[] = []
      this.podiumBests.forEach(item =>{
        xAxis.push(JSON.stringify(item))
        obj.data.push(item.spread_usd)
      })
      this.lineChart.xLabels = xAxis
      this.lineChart.yData = [obj]
      })
  }


}

