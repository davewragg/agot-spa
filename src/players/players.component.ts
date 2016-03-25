import {Component} from 'angular2/core';
import {PlayerService} from '../shared/services/player.service';
import {Player} from '../shared/models/player.model';
import {PlayerLinkComponent} from '../shared/components/player-link.component';
import {Observable} from 'rxjs/Observable';
import {SpinnerComponent} from '../shared/components/spinner.component';

@Component({
  selector: 'agot-all-players',
  moduleId: module.id,
  viewProviders: [PlayerService],
  templateUrl: './players.html',
  directives: [PlayerLinkComponent, SpinnerComponent]
})
export class PlayersComponent {
  players:Observable<Player[]>;
  isLoading:boolean;

  constructor(private _playerService:PlayerService) {
    this.loadPlayers();
  }

  loadPlayers() {
    this.isLoading = true;
    this.players = this._playerService.players;
    this.players.filter((x) => !!x && !!x.length).subscribe(
      () => this.isLoading = false,
      () => this.isLoading = false,
      () => this.isLoading = false
    );
  }
}
