import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { HttpModule } from '@angular/http';
import { ToasterService } from 'angular2-toaster';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AboutModule } from './about/about.module';
import { HomeModule } from './home/home.module';
import { SharedModule } from './shared/shared.module';
import {
  CacheService,
  DataService,
  DeckService,
  GameService,
  NotificationService,
  PlayerService,
  RankingService,
  ReferenceDataService,
  SeasonService,
  StatsService,
  ThronesDbService
} from './shared/services/index';

@NgModule({
  imports: [BrowserModule, HttpModule, AppRoutingModule, AboutModule, HomeModule, SharedModule.forRoot()],
  declarations: [AppComponent],
  providers: [
    {
      provide: APP_BASE_HREF,
      useValue: '<%= APP_BASE %>'
    },
    ToasterService,
    CacheService,
    DataService,
    DeckService,
    GameService,
    NotificationService,
    PlayerService,
    RankingService,
    ReferenceDataService,
    SeasonService,
    StatsService,
    ThronesDbService
  ],
  bootstrap: [AppComponent]

})
export class AppModule {
}
