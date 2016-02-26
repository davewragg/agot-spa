import {Component, OnInit} from 'angular2/core';

import {SetOfResults} from '../../shared/models/set-of-results.model';
import {RankingService} from '../../shared/services/ranking.service';
import {RankingsComponent} from './rankings.component';

@Component({
  selector: 'agot-all-rankings',
  moduleId: module.id,
  viewProviders: [RankingService],
  template: `
    <section>
      <h2>Rankings</h2>
      <agot-rankings name="All-time" [rankings]="allResults" [expanded]="true"></agot-rankings>
      <agot-rankings *ngFor="#season of seasons" [name]="season.name" [rankings]="season"></agot-rankings>
    </section>
  `,
  directives: [RankingsComponent]
})
export class AllRankingsComponent implements OnInit {
  allResults:SetOfResults;
  seasons:SetOfResults[];
  loadingError:any = null;

  constructor(private _RankingService:RankingService) {
  }

  ngOnInit() {
    this.loadRankings();
  }

  loadRankings() {
    this._RankingService.getAllRankings()
      .subscribe(
        (data) => {
          this.loadingError = null;
          this.allResults = data.allResults;
          this.seasons = data.seasons;
        },
        (err) => {
          this.loadingError = err._body || err;
        },
        () => console.log('done')
      );
  }
}
