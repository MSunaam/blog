import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DraftsRoutingModule } from './drafts-routing.module';
import { DraftsComponent } from './drafts/drafts.component';
import { SharedModule } from '../shared/shared.module';
import { DraftCardComponent } from './draft-card/draft-card.component';

@NgModule({
  declarations: [DraftsComponent, DraftCardComponent],
  imports: [CommonModule, DraftsRoutingModule, SharedModule],
})
export class DraftsModule {}
