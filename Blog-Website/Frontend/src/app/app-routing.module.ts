import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesModule } from './pages/pages.module';
import { AuthModule } from './auth/auth.module';
import { UserPageModule } from './user-page/user-page.module';
import { PostModule } from './post/post.module';
import { WriteBlogModule } from './write-blog/write-blog.module';
import { DraftsModule } from './drafts/drafts.module';

const routes: Routes = [
  { path: '', loadChildren: () => PagesModule },
  { path: 'auth', loadChildren: () => AuthModule },
  { path: 'user', loadChildren: () => UserPageModule },
  { path: 'post', loadChildren: () => PostModule },
  { path: 'write-blog', loadChildren: () => WriteBlogModule },
  { path: 'drafts', loadChildren: () => DraftsModule },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
