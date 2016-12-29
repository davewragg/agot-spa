import { Component, Input, Output, EventEmitter } from '@angular/core';
// import { ROUTER_DIRECTIVES } from '@angular/router';
import { Game } from '../shared/models/game.model';
// import { GamePlayersComponent } from './game-players.component';
// import { DateFormatPipe } from '../shared/pipes/date-format-pipe';
import { ReferenceDataService } from '../shared/services/reference-data.service';
import { Observable } from 'rxjs/Observable';
import { Venue } from '../shared/models/venue.model';

@Component({
  selector: 'agot-view-game',
  templateUrl: 'game/view-game.html',
  // directives: [GamePlayersComponent, ROUTER_DIRECTIVES],
  // pipes: [DateFormatPipe]
})
export class ViewGameComponent {
  @Input()
  game: Game;
  @Output()
  edit: EventEmitter<Game> = new EventEmitter<Game>();
  @Output()
  deleteGame: EventEmitter<Game> = new EventEmitter<Game>();

  deleting: boolean = false;

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

  onEdit() {
    this.edit.emit(this.game);
  }

  onDelete(force: boolean) {
    if (!force) {
      this.deleting = true;
    } else {
      this.deleteGame.emit(this.game);
    }
  }
}