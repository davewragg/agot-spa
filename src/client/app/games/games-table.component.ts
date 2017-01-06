import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Game } from '../shared/models/game.model';
import { ReferenceDataService } from '../shared/services/reference-data.service';
import { Observable } from 'rxjs/Observable';
import { Venue } from '../shared/models/venue.model';

@Component({
  moduleId: module.id,
  selector: 'agot-games-table',
  templateUrl: 'games-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
