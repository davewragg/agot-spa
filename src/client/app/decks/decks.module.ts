import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { DecksRoutingModule } from './decks-routing.module';
import { DecksTableComponent } from './decks-table.component';
import { DecksComponent } from './decks.component';

@NgModule({
  imports: [CommonModule, SharedModule, DecksRoutingModule],
  declarations: [DecksTableComponent, DecksComponent],
  exports: [DecksTableComponent, DecksComponent]
})
export class DecksModule {
}
