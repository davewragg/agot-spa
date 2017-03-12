import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { PlayersRoutingModule } from './players-routing.module';
import { PlayersComponent } from './players.component';
import { PlayersContainerComponent } from './players.container';

@NgModule({
  imports: [CommonModule, SharedModule, PlayersRoutingModule],
  declarations: [
    PlayersContainerComponent,
    PlayersComponent,
  ],
  // exports: [PlayersTableComponent, PlayersComponent]
})
export class PlayersModule {
}
