import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { go } from '@ngrx/router-store';
import { FilterCriteria } from '../shared/models/filter-criteria.model';
import { Deck } from '../shared/models/deck.model';
import * as fromRoot from '../state-management/reducers/root';
import * as playerGroupActions from '../state-management/actions/player-group.actions';

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

  onSelectedGroupChange(playerGroupId: number) {
    this.store.dispatch(new playerGroupActions.SelectAction(playerGroupId));

    this.loadDecks({ playerGroupIds: [playerGroupId] });
  }

  onFilterChange(partialCriteria: FilterCriteria) {
    this.loadDecks(partialCriteria);
  }

  // onShowMore(newLimit: number) {
  //   this.loadDecks({
  //     limit: newLimit,
  //   });
  // }

  loadDecks(changedCriteria?: object) {
    const patchedCriteria = this.processUpdatedCriteria(changedCriteria);
    this.store.dispatch(go(['/decks', FilterCriteria.serialise(patchedCriteria)]));
  }

  private processUpdatedCriteria(changedCriteria: object) {
    const existingCriteria = this.getExistingCriteria();
    const newCriteria = this.setCurrentPlayerGroup(existingCriteria, changedCriteria);
    return FilterCriteria.patchValues(existingCriteria, newCriteria);
  }

  private getExistingCriteria() {
    let existingCriteria: FilterCriteria;
    this.criteria$.subscribe(x => existingCriteria = x);
    return existingCriteria;
  }

  private setCurrentPlayerGroup(existingCriteria: FilterCriteria, changedCriteria: object) {
    if (existingCriteria.playerGroupIds.length) {
      return changedCriteria;
    }
    let selectedGroupId = this.getSelectedPlayerGroupId();
    return Object.assign({
      playerGroupIds: [selectedGroupId],
    }, changedCriteria);
  }

  private getSelectedPlayerGroupId() {
    let selectedGroupId;
    this.selectedGroupId$.subscribe(x => selectedGroupId = x);
    return selectedGroupId;
  }
}
