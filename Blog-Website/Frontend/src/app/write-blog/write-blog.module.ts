import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WriteBlogRoutingModule } from './write-blog-routing.module';
import { WriteBlogComponent } from './write-blog/write-blog.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { SaveLoaderComponent } from './save-loader/save-loader.component';
import { SaveLeadImageComponent } from './save-lead-image/save-lead-image.component';

@NgModule({
  declarations: [WriteBlogComponent, SaveLoaderComponent, SaveLeadImageComponent],
  imports: [
    CommonModule,
    WriteBlogRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    QuillModule,
  ],
})
export class WriteBlogModule {}
