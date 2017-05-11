import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { DecksRoutingModule } from './decks-routing.module';
import { DecksTableComponent } from './decks-table.component';
import { DecksComponent } from './decks.component';
import { DecksContainerComponent } from './decks.container';

@NgModule({
  imports: [CommonModule, SharedModule, DecksRoutingModule],
  declarations: [DecksTableComponent, DecksComponent, DecksContainerComponent],
  // exports: [DecksTableComponent, DecksComponent]
})
export class DecksModule {
}
