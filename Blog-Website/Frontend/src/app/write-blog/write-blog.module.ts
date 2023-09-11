import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WriteBlogRoutingModule } from './write-blog-routing.module';
import { WriteBlogComponent } from './write-blog/write-blog.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';

@NgModule({
  declarations: [WriteBlogComponent],
  imports: [
    CommonModule,
    WriteBlogRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    QuillModule,
  ],
})
export class WriteBlogModule {}
