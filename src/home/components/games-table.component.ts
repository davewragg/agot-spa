import {Component, Input, ChangeDetectionStrategy} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {Game} from '../../shared/models/game.model';
import {FactionBadgeComponent} from '../../shared/components/faction-badge.component';
import {AgendaBadgeComponent} from '../../shared/components/agenda-badge.component';
import {PlayerLinkComponent} from '../../shared/components/player-link.component';
import {TimeAgoPipe} from '../../shared/pipes/time-ago-pipe';
import {DateFormatPipe} from '../../shared/pipes/date-format-pipe';
import {ReferenceDataService} from '../../shared/services/reference-data.service';
import {Observable} from 'rxjs/Observable';
import {Venue} from '../../shared/models/venue.model';

@Component({
  selector: 'agot-games-table',
  moduleId: module.id,
  templateUrl: './games-table.html',
  pipes: [TimeAgoPipe, DateFormatPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  directives: [ROUTER_DIRECTIVES, PlayerLinkComponent, FactionBadgeComponent, AgendaBadgeComponent]
})
export class GamesTableComponent {
  @Input()
  games:Game[];

  constructor(private _referenceDataService:ReferenceDataService) {
  }

  getVenue(venueId:number):Observable<Venue> {
    return this._referenceDataService.getVenue(venueId);
  }

  getVenueName(venueId:number):Observable<string> {
    return this.getVenue(venueId).map((venue:Venue) => {
      return venue && venue.name;
    });
  }
}
