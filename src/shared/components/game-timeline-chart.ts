import {Component, Input, ChangeDetectionStrategy, OnInit} from 'angular2/core';
import {CHART_DIRECTIVES} from 'angular2-highcharts/index';
import {Game} from '../models/game.model';
import * as _ from 'lodash';

@Component({
  selector: 'agot-game-timeline-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="row">
      <chart class="col-xs-12" [options]="options"></chart>
    </div>
  `,
  directives: [CHART_DIRECTIVES]
})
export class GameTimelineChart implements OnInit {
  @Input()
  games:Game[];

  private options:any = {};

  ngOnInit() {
    const series = _.chain(this.games).groupBy((game:Game) => {
      return game.date.substr(0, 10);
    }).toPairs()
      .map(([dateKey, games]:[string, Game[]]) => {
        const year = +dateKey.substr(0, 4);
        const month = +dateKey.substr(5, 2) - 1; // goddam zero indexed month
        const date = +dateKey.substr(8, 2);
        return [Date.UTC(year, month, date), games.length];
      }).sortBy('0')
      .value();
    // console.log(series);

    this.options = {
      chart: {},
      title: {
        text: null
      },
      xAxis: {
        type: 'datetime',
      },
      yAxis: {
        title: {
          text: 'Games'
        },
        min: 0,
        allowDecimals: false,
        crosshair: true
      },
      plotOptions: {
        series: {
          borderWidth: 1,
          borderColor: '#530001',
          color: '#d30001',
        }
      },
      series: [{
        type: 'column',
        name: 'Games',
        pointRange: 24 * 3600 * 1000,
        data: series
      }]
    };
  }
}
