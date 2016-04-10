import {Component, Input, ChangeDetectionStrategy, OnInit} from 'angular2/core';
import {CHART_DIRECTIVES, Highcharts} from 'angular2-highcharts/index';
import {Stats} from '../models/stats.model';

@Component({
  selector: 'agot-played-stats-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <chart [options]="options"></chart>
  `,
  directives: [CHART_DIRECTIVES]
})
export class PlayedStatsChart implements OnInit {
  @Input()
  stats:Stats;

  private options:any = {};

  ngOnInit() {
    this.options = {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
      },
      title: {
        text: 'Results breakdown'
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
              color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
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
