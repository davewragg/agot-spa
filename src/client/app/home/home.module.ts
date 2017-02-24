import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { RankingsModule } from '../rankings/rankings.module';
import { GamesModule } from '../games/games.module';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';

@NgModule({
  imports: [HomeRoutingModule, SharedModule, RankingsModule, GamesModule],
  declarations: [HomeComponent],
  // exports: [HomeComponent],
})
export class HomeModule { }
