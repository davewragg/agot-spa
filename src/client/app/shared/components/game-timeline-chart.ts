import { Component, Input, ChangeDetectionStrategy, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Game } from '../models/game.model';
import { Result } from '../models/result.enum';
import { StatsService } from '../services/stats.service';

@Component({
  moduleId: module.id,
  selector: 'agot-game-timeline-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="row">
      <chart class="col-xs-12 chart-box" [options]="options"></chart>
    </div>
  `,
  styles: [
    `.chart-box {
      height: 300px;
      min-width: 250px;
      max-width: 1000px;
    }`
  ]
})
export class GameTimelineChartComponent implements OnInit, OnChanges {
  @Input()
  games: Game[];

  @Input()
  playerId: string;
  @Input()
  deckId: number;

  public options: any = {};

  private labels: any = {
    [Result.WON]: 'Won',
    [Result.DREW]: 'Drew',
    [Result.LOST]: 'Lost'
  };
  private colours: any = {
    [Result.WON]: '#356921',
    [Result.DREW]: '#666',
    [Result.LOST]: '#b30001'
  };

  constructor(private _statsService: StatsService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.setOptions();
  }

  ngOnInit() {
    this.setOptions();
  }

  setOptions() {
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

  private getDataSeries(): any[] {
    const sortedGames: [number, Game[]][] = this._statsService.getTimelineSortedGames(this.games);

    if (!this.playerId && !this.deckId) {
      return this.getGameOnlyDataSeries(sortedGames);
    }
    return this.getDeckOrPlayerDataSeries(sortedGames);
  }

  private getDeckOrPlayerDataSeries(sortedGames: [number, Game[]][]) {
    const results = this._statsService.getDeckOrPlayerResultsData(sortedGames, this.playerId, this.deckId);

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

  private getGameOnlyDataSeries(sortedGames: [number, Game[]][]) {
    return [{
      type: 'column',
      name: 'Games',
      borderWidth: 1,
      borderColor: '#5a3d0b',
      color: '#8a6d3b',
      pointRange: 24 * 3600 * 1000,
      data: this._statsService.getGamesPlayedData(sortedGames)
    }];
  }
}
