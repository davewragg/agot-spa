import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { GamesTableComponent } from './games-table.component';
import { GamesComponent } from './games.component';
import { GamesRoutingModule } from './games-routing.module';

@NgModule({
  imports: [CommonModule, SharedModule, GamesRoutingModule],
  declarations: [GamesTableComponent, GamesComponent],
  exports: [GamesTableComponent, GamesComponent]
})
export class GamesModule {
}
