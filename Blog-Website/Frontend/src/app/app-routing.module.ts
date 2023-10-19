import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesModule } from './pages/pages.module';
import { AuthModule } from './auth/auth.module';
import { UserPageModule } from './user-page/user-page.module';
import { PostModule } from './post/post.module';
import { WriteBlogModule } from './write-blog/write-blog.module';
import { DraftsModule } from './drafts/drafts.module';
import { PreviewPostModule } from './preview-post/preview-post.module';
import { SearchModule } from './search/search.module';
import { ReadingListModule } from './reading-list/reading-list.module';
import { authGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: '', loadChildren: () => PagesModule },
  { path: 'auth', loadChildren: () => AuthModule },
  {
    path: 'user',
    loadChildren: () => UserPageModule,
  },
  { path: 'post', loadChildren: () => PostModule },
  {
    path: 'write-blog',
    loadChildren: () => WriteBlogModule,
    canActivate: [authGuard],
  },
  {
    path: 'drafts',
    loadChildren: () => DraftsModule,
    canActivate: [authGuard],
  },
  {
    path: 'preview',
    loadChildren: () => PreviewPostModule,
    canActivate: [authGuard],
  },
  { path: 'search', loadChildren: () => SearchModule },
  { path: 'reading-list', loadChildren: () => ReadingListModule },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
