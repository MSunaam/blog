import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PreviewPostRoutingModule } from './preview-post-routing.module';
import { PreviewComponent } from './preview/preview.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [PreviewComponent],
  imports: [CommonModule, PreviewPostRoutingModule, SharedModule],
})
export class PreviewPostModule {}
