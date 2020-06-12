import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './services/auth-guard.service';

const routes: Routes = [
  
    
  { 
    path: 'login', loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  { 
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    canActivate:[AuthGuardService] //esto se ejecuta antes que loadChildren
  },
  { 
    path: '', redirectTo: 'login', pathMatch: 'full' 
  },
  {
    path:  'post/:id',
    loadChildren: () => import('./post/post.module').then( m => m.PostPageModule)
  },
  {
    path: 'comments/:id',
    loadChildren: () => import('./comments/comments.module').then( m => m.CommentsPageModule)
  },
  {
    path: 'add/:id',
    loadChildren: () => import('./comments/add/add.module').then(m => m.AddPageModule)
  },
  {
    path: 'edit/:id',
    loadChildren: () => import('./comments/edit/edit.module').then(m => m.EditPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
