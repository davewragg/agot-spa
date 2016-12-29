import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { RankingsModule } from '../rankings/rankings.module';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';

@NgModule({
  imports: [CommonModule, HomeRoutingModule, SharedModule, RankingsModule],
  declarations: [HomeComponent],
  exports: [HomeComponent],
  providers: []
})
export class HomeModule { }
