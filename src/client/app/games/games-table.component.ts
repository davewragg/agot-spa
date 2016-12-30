import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
// import { ROUTER_DIRECTIVES } from '@angular/router';
import { Game } from '../shared/models/game.model';
// import { PlayerLinkComponent } from '../../shared/components/player-link.component';
// import { TimeAgoPipe } from '../../shared/pipes/time-ago-pipe';
// import { DateFormatPipe } from '../../shared/pipes/date-format-pipe';
import { ReferenceDataService } from '../shared/services/reference-data.service';
import { Observable } from 'rxjs/Observable';
import { Venue } from '../shared/models/venue.model';
// import { DeckLinkComponent } from '../../shared/components/deck-link.component';
// import { DeckClassBadgeComponent } from '../../shared/components/deck-class-badge.component';

@Component({
  moduleId: module.id,
  selector: 'agot-games-table',
  templateUrl: 'games-table.component.html',
  // pipes: [TimeAgoPipe, DateFormatPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // directives: [
  //   ROUTER_DIRECTIVES,
  //   PlayerLinkComponent,
  //   DeckLinkComponent,
  //   DeckClassBadgeComponent,
  // ]
})
export class GamesTableComponent {
  @Input()
  games: Game[];

  constructor(private _referenceDataService: ReferenceDataService) {
  }

  getVenue(venueId: number): Observable<Venue> {
    return this._referenceDataService.getVenue(venueId);
  }

  getVenueName(venueId: number): Observable<string> {
    return this.getVenue(venueId).map((venue: Venue) => {
      return venue && venue.name;
    });
  }
}
