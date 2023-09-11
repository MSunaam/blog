import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WriteBlogComponent } from './write-blog/write-blog.component';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [{ path: '', component: WriteBlogComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WriteBlogRoutingModule {}
