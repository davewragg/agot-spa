import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { NotFoundPageComponent } from './not-found-page';

@NgModule({
  imports: [SharedModule],
  declarations: [NotFoundPageComponent],
  exports: [NotFoundPageComponent],
})
export class LayoutModule { }
