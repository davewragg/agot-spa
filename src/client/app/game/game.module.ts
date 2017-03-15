import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { GameRoutingModule } from './game-routing.module';
import { DeckModule } from '../deck/deck.module';
import { DeckChooserComponent } from './deck-selector/deck-chooser.component';
import { DeckSelectorComponent } from './deck-selector/deck-selector.component';
import { ExistingDeckSelectorComponent } from './deck-selector/existing-deck-selector.component';
import { GameDetailsComponent } from './game-details.component';
import { GameFormComponent } from './game-form.component';
import { GamePlayerRowComponent } from './game-player-row.component';
import { GamePlayersComponent } from './game-players.component';
import { NewGamePlayerFormComponent } from './new-game-player-form.component';
import { ViewGameComponent } from './view-game.component';
import { CreateGameComponent } from './create-game.component';
import { GameExistsGuard } from '../state-management/guards/game-exists';
import { ViewGamePageComponent } from './game.container';
import { SelectedGamePageComponent } from './selected-game.container';

@NgModule({
  imports: [CommonModule, SharedModule, GameRoutingModule, DeckModule],
  declarations: [
    CreateGameComponent,
    DeckChooserComponent,
    DeckSelectorComponent,
    ExistingDeckSelectorComponent,
    GameDetailsComponent,
    GameFormComponent,
    GamePlayerRowComponent,
    GamePlayersComponent,
    NewGamePlayerFormComponent,
    ViewGameComponent,
    ViewGamePageComponent,
    SelectedGamePageComponent,
  ],
  providers: [
    GameExistsGuard,
  ]
  // exports: []
})
export class GameModule {
}
