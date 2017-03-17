import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { NotFoundPageComponent } from './not-found-page';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ToolbarComponent } from './toolbar/toolbar.component';

@NgModule({
  imports: [SharedModule],
  declarations: [
    ToolbarComponent,
    NavbarComponent,
    FooterComponent,
    NotFoundPageComponent,
  ],
  exports: [
    ToolbarComponent,
    NavbarComponent,
    FooterComponent,
    NotFoundPageComponent,
  ],
})
export class LayoutModule {
}
