import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { NewCardComponent } from './GuestLandingPage/new-card/new-card.component';
import { LoaderComponent } from './loader/loader.component';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { GuestPageService } from './Services/guest-page.service';
import { HeroLatestPostsComponent } from './GuestLandingPage/hero-latest-posts/hero-latest-posts.component';
import { SubscribeModalComponent } from './GuestLandingPage/subscribe-modal/subscribe-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { allowIfLoggedIn } from './Guards/auth.guard';
import { ImageUploadComponent } from './image-upload/image-upload.component';
import { BlogCardComponent } from './blog-card/blog-card.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
    NewCardComponent,
    LoaderComponent,
    HeroLatestPostsComponent,
    SubscribeModalComponent,
    ImageUploadComponent,
    BlogCardComponent,
    ChangePasswordComponent,
  ],
  exports: [
    NavbarComponent,
    FooterComponent,
    NewCardComponent,
    LoaderComponent,
    HeroLatestPostsComponent,
    SubscribeModalComponent,
    ImageUploadComponent,
    BlogCardComponent,
    ChangePasswordComponent,
  ],
  imports: [CommonModule, RouterModule, HttpClientModule, ReactiveFormsModule],
})
export class SharedModule {}
