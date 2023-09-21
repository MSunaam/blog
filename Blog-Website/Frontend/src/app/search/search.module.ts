import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchRoutingModule } from './search-routing.module';
import { SearchPageComponent } from './search-page/search-page.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

import { BlogSearchComponent } from './blog-search/blog-search.component';

@NgModule({
  declarations: [SearchPageComponent, BlogSearchComponent],
  imports: [
    CommonModule,
    SearchRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class SearchModule {}
