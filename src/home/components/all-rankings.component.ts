import {Component, OnInit, Input} from 'angular2/core';

import {SetOfResults} from '../../shared/models/set-of-results.model';
import {RankingService} from '../../shared/services/ranking.service';
import {RankingsComponent} from './rankings.component';
import {SpinnerComponent} from '../../shared/components/spinner.component';

@Component({
  selector: 'agot-all-rankings',
  moduleId: module.id,
  viewProviders: [RankingService],
  template: `
    <section>
      <br>
      <agot-spinner [isRunning]="isLoading"></agot-spinner>
      <agot-rankings name="All-time" [rankings]="allResults" [expanded]="true"></agot-rankings>
      <div *ngIf="!hideSeasons">
        <agot-rankings *ngFor="#season of seasons" [name]="season.name" [rankings]="season"></agot-rankings>
      </div>
    </section>
  `,
  directives: [RankingsComponent, SpinnerComponent]
})
export class AllRankingsComponent implements OnInit {
  @Input()
  hideSeasons:boolean = false;

  allResults:SetOfResults;
  seasons:SetOfResults[];
  loadingError:any = null;
  isLoading:boolean;

  constructor(private _RankingService:RankingService) {
  }

  ngOnInit() {
    this.loadRankings();
  }

  loadRankings() {
    this.isLoading = true;
    this._RankingService.getAllRankings()
      .subscribe(
        (data) => {
          this.loadingError = null;
          this.allResults = data.allResults;
          this.seasons = data.seasons;
        },
        (err) => {
          this.loadingError = err._body || err;
          this.isLoading = false;
        },
        () => {
          console.log('done');
          this.isLoading = false;
        }
      );
  }
}
