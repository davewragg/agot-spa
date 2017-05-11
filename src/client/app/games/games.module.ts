import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { GamesTableComponent } from './games-table.component';
import { GamesComponent } from './games.component';
import { GamesRoutingModule } from './games-routing.module';
import { GamesContainerComponent } from './games.container';

@NgModule({
  imports: [CommonModule, SharedModule, GamesRoutingModule],
  declarations: [GamesTableComponent, GamesComponent, GamesContainerComponent],
  exports: [GamesTableComponent, GamesComponent]
})
export class GamesModule {
}
