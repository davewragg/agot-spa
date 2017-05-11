import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { go } from '@ngrx/router-store';
import { Observable } from 'rxjs/Observable';
import { Player } from '../shared/models/player.model';
import { PlayerStats } from '../shared/models/player-stats.model';
import { FilterCriteria } from '../shared/models/filter-criteria.model';
import * as fromRoot from '../state-management/reducers/root';

@Component({
  moduleId: module.id,
  selector: 'agot-player-details',
  templateUrl: 'player-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerDetailsComponent {
  player$: Observable<Player>;
  playerStats$: Observable<PlayerStats>;
  criteria$: Observable<FilterCriteria>;
  loading$: Observable<boolean>;

  constructor(private route: ActivatedRoute,
              private store: Store<fromRoot.State>) {
    this.player$ = this.store.select(fromRoot.getSelectedPlayer);
    this.playerStats$ = this.store.select(fromRoot.getSelectedPlayerStats);
    this.criteria$ = this.store.select(fromRoot.getPlayerStatsFilterCriteria);
    this.loading$ = this.store.select(fromRoot.getPlayersLoading);
  }

  onDateRangeChange(criteria: FilterCriteria) {
    this.loadPlayerAndStats(criteria);
  }

  private loadPlayerAndStats(criteria?: FilterCriteria) {
    this.store.dispatch(go(['player', this.route.snapshot.params['id'], FilterCriteria.serialise(criteria)]));
  }
}
