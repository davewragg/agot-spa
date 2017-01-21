import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Config } from './shared/config/env.config';
import './operators';
import { PlayerService } from './shared/services/player.service';
import { Player } from './shared/models/player.model';

/**
 * This class represents the main application component.
 */
@Component({
  moduleId: module.id,
  selector: 'agot-app',
  templateUrl: 'app.component.html',
})
export class AppComponent implements OnInit {
  currentPlayer: Observable<Player>;

  constructor(private playerService: PlayerService) {
    console.log('Environment config', Config);
  }

  ngOnInit(): void {
    this.currentPlayer = this.playerService.getCurrentPlayer();
  }
}
