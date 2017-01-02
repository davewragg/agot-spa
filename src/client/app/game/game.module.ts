import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { GameRoutingModule } from './game-routing.module';
import { DeckChooserComponent } from './deck-selector/deck-chooser.component';
import { DeckSelectorComponent } from './deck-selector/deck-selector.component';
import { ExistingDeckSelectorComponent } from './deck-selector/existing-deck-selector.component';
import { GameDetailsComponent } from './game-details.component';
import { GameFormComponent } from './game-form.component';
import { GamePlayerRowComponent } from './game-player-row.component';
import { GamePlayersComponent } from './game-players.component';
import { NewGamePlayerFormComponent } from './new-game-player-form.component';
import { ViewGameComponent } from './view-game.component';

@NgModule({
  imports: [CommonModule, SharedModule, GameRoutingModule],
  declarations: [
    DeckChooserComponent,
    DeckSelectorComponent,
    ExistingDeckSelectorComponent,
    GameDetailsComponent,
    GameFormComponent,
    GamePlayerRowComponent,
    GamePlayersComponent,
    NewGamePlayerFormComponent,
    ViewGameComponent,
  ],
  // exports: []
})
export class GameModule {
}
