import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DraftsRoutingModule } from './drafts-routing.module';
import { DraftsComponent } from './drafts/drafts.component';
import { SharedModule } from '../shared/shared.module';
import { DraftCardComponent } from './draft-card/draft-card.component';
import { DeleteModalComponent } from './delete-modal/delete-modal.component';

@NgModule({
  declarations: [DraftsComponent, DraftCardComponent, DeleteModalComponent],
  imports: [CommonModule, DraftsRoutingModule, SharedModule],
})
export class DraftsModule {}
