import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { SharedModule } from '../shared/shared.module';
import { HomeComponent } from './home/home.component';
import { ReadingListsComponent } from './components/reading-lists/reading-lists.component';

import { GuestPageService } from '../shared/Services/guest-page.service';
import { ProfileComponent } from './profile/profile.component';
import { ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { SwiperModule } from 'swiper/angular';

@NgModule({
  declarations: [
    LandingPageComponent,
    HomeComponent,
    ReadingListsComponent,
    ProfileComponent,
  ],
  providers: [GuestPageService],
  imports: [
    SwiperModule,
    CommonModule,
    PagesRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    QuillModule,
  ],
})
export class PagesModule {}
