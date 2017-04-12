import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { go } from '@ngrx/router-store';
import { FilterCriteria } from '../shared/models/filter-criteria.model';
import { Deck } from '../shared/models/deck.model';
import * as fromRoot from '../state-management/reducers/root';
import * as playerGroupActions from '../state-management/actions/player-group';

@Component({
  moduleId: module.id,
  selector: 'agot-decks',
  templateUrl: 'decks.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DecksComponent {
  @Input()
  title: string;

  selectedGroupId$: Observable<number>;
  criteria$: Observable<FilterCriteria>;
  decks$: Observable<Deck[]>;
  loading$: Observable<boolean>;

  constructor(private store: Store<fromRoot.State>) {
    this.selectedGroupId$ = store.select(fromRoot.getSelectedPlayerGroupId);
    this.criteria$ = store.select(fromRoot.getDecksCriteria);
    this.decks$ = store.select(fromRoot.getFilteredDecks);
    this.loading$ = store.select(fromRoot.getDecksLoading);
  }

  onSelectedGroupChange(partialCriteria: FilterCriteria) {
    const [playerGroupId] = partialCriteria.playerGroupIds;
    this.store.dispatch(new playerGroupActions.SelectAction(playerGroupId));

    this.loadDecks(partialCriteria);
  }

  onFilterChange(partialCriteria: FilterCriteria) {
    this.loadDecks(partialCriteria);
  }

  loadDecks(changedCriteria?: FilterCriteria) {
    let existingCriteria: FilterCriteria;
    this.criteria$.subscribe(x => x = existingCriteria);
    const patchedCriteria = FilterCriteria.patchValues(existingCriteria, changedCriteria);
    this.store.dispatch(go(['/decks', FilterCriteria.serialise(patchedCriteria)]));
  }
}
