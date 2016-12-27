import { Component, Input, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Stats } from '../models/stats.model';

@Component({
  selector: 'agot-played-stats-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="row">
      <chart class="col-xs-12" [options]="options"></chart>
    </div>
  `,
  // directives: [CHART_DIRECTIVES]
})
export class PlayedStatsChartComponent implements OnInit {
  @Input()
  stats: Stats;

  private options: any = {};

  ngOnInit() {
    this.options = {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: true,
        type: 'pie',
        spacing: [0, 0, 0, 0],
        style: {
          fontFamily: 'Tahoma, Roboto, "Helvetica Neue", sans-serif',
          fontSize: '14px'
        }
      },
      title: {
        text: null
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage}%</b>'
      },
      plotOptions: {
        pie: {
          borderColor: 'black',
          colors: ['#356921', '#B30001', '#666'],
          dataLabels: {
            enabled: true,
            inside: true,
            format: '<b>{point.name}</b>',
            style: {
              color: 'black'
            }
          }
        }
      },
      series: [{
        name: 'Result type',
        colorByPoint: true,
        data: [{
          name: 'Won',
          y: this.stats.winPercentage
        }, {
          name: 'Lost',
          y: this.stats.lossPercentage
        }, {
          name: 'Draw/Unfinished',
          y: 100 - this.stats.winPercentage - this.stats.lossPercentage
        }]
      }]
    };
  }
}
