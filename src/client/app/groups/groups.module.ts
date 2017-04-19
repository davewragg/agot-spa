import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { GroupsComponent } from './groups.component';
import { GroupsRoutingModule } from './groups-routing.module';
import { GroupsContainerComponent } from './groups.container';
import { GroupsListComponent } from './groups-list.component';

@NgModule({
  imports: [CommonModule, SharedModule, GroupsRoutingModule],
  declarations: [GroupsComponent, GroupsContainerComponent, GroupsListComponent],
  // exports: []
})
export class GroupsModule {
}
