import {Component, Input, ChangeDetectionStrategy, OnInit} from 'angular2/core';
import {CHART_DIRECTIVES} from 'angular2-highcharts/index';
import {Game} from '../models/game.model';
import {Result} from '../models/result.enum';
import {StatsService} from '../services/stats.service';
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

  @Input()
  playerId:number;
  @Input()
  deckId:number;

  private options:any = {};

  private labels = {
    [Result.WON]: 'Won',
    [Result.DREW]: 'Drew',
    [Result.LOST]: 'Lost'
  };
  private colours = {
    [Result.WON]: '#356921',
    [Result.DREW]: '#666',
    [Result.LOST]: '#b30001'
  };

  ngOnInit() {
    const series = this.getDataSeries();
    console.log(series);

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
        // stackLabels: {
        //   enabled: true
        // },
        min: 0,
        allowDecimals: false,
        crosshair: true
      },
      plotOptions: {
        column: {
          stacking: 'normal',
          dataLabels: {
            enabled: true,
            color: 'white',
            style: {
              textShadow: '0 0 3px black'
            }
          }
        }
      },
      series: series
    };
  }

  private getDataSeries() {
    const sortedGames = this.getSortedGames();

    if (!this.playerId && !this.deckId) {
      return {
        type: 'column',
        name: 'Games',
        borderWidth: 1,
        borderColor: '#530001',
        color: '#d30001',
        pointRange: 24 * 3600 * 1000,
        data: sortedGames.map(([dateKey, games]:[string, Game[]]) => {
          return [dateKey, games.length];
        })
      };
    }

    if (this.playerId) {
      const results = {
        [Result.WON]: [],
        [Result.DREW]: [],
        [Result.LOST]: []
      };
      sortedGames.forEach(([dateKey, games]:[string, Game[]]) => {
        const resultsForDay:Map<Result, number> = new Map();
        games.forEach((game) => {
          const result = StatsService.getResultForPlayer(game, this.playerId);
          if (resultsForDay.has(result)) {
            const currentValue = resultsForDay.get(result);
            resultsForDay.set(result, currentValue + 1);
          } else {
            resultsForDay.set(result, 1);
          }
        });
        Object.keys(results).forEach((key) => {
          const dayResults = resultsForDay.get(+key);
          if (dayResults) {
            results[key].push([dateKey, dayResults]);
          }
        });
      });

      return Object.keys(results).map((key) => {
        return {
          type: 'column',
          name: this.labels[key],
          borderWidth: 1,
          borderColor: '#530001',
          color: this.colours[key],
          pointRange: 24 * 3600 * 1000,
          data: results[key]
        };
      });
    }

    // console.log(series);
    // return [series].map((dataSeries) => ({
    //   type: 'column',
    //   name: 'Games',
    //   pointRange: 24 * 3600 * 1000,
    //   data: dataSeries
    // }));
  }

  private getSortedGames() {
    return _.chain(this.games).groupBy((game:Game) => {
      return game.date.substr(0, 10);
    }).toPairs()
      .map(([dateKey, games]:[string, Game[]]) => {
        const year = +dateKey.substr(0, 4);
        const month = +dateKey.substr(5, 2) - 1; // goddam zero indexed month
        const date = +dateKey.substr(8, 2);
        const dateInMillis = Date.UTC(year, month, date);
        return [dateInMillis, games];
      }).sortBy('0')
      .value();
  }
}
