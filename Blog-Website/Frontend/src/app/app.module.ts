import {
  AfterViewInit,
  CUSTOM_ELEMENTS_SCHEMA,
  NgModule,
  OnInit,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { JwtModule } from '@auth0/angular-jwt';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RefreshInterceptor } from './shared/Interceptors/refresh.interceptor';
import { SwiperModule } from 'swiper/angular';
import { UserService } from './shared/Services/user.service';
import { PostService } from './shared/Services/post.service';
import { LoaderService } from './shared/Services/loader.service';

export function tokenGetter() {
  return localStorage.getItem('access_token');
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    HttpClientModule,
    SwiperModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        throwNoTokenError: false,
        allowedDomains: ['localhost:3000'],
      },
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: RefreshInterceptor, multi: true },
    UserService,
    PostService,
    LoaderService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
