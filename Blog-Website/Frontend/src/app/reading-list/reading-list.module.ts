import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReadingListRoutingModule } from './reading-list-routing.module';
import { ReadingComponent } from './reading/reading.component';
import { SharedModule } from '../shared/shared.module';
import { BlogCardComponent } from './blog-card/blog-card.component';

@NgModule({
  declarations: [ReadingComponent, BlogCardComponent],
  imports: [CommonModule, ReadingListRoutingModule, SharedModule],
})
export class ReadingListModule {}
