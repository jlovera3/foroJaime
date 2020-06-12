import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService } from 'src/app/services/database.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Dev } from 'src/app/model/Dev';
import { User } from 'src/app/model/User';
import { Comment } from 'src/app/model/Comment';
import { UiComponent } from 'src/app/common/ui/ui.component';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit {
  comment: Comment = null;
  comentario: {};
  user: User;
  msg;
  img;
  avatar;
  devId;
  constructor(private route: ActivatedRoute,
    private db: DatabaseService,
    private local: NativeStorage,
    private router: Router,
    private ui: UiComponent) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.devId = params.get('id');
 
      this.db.getComment(this.devId).then(data => {
        this.comment = data;
        this.msg=this.comment.msg;
        this.img=this.comment.img;
      });
    });
    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {
          this.initUser();
        }
        //this.products = this.db.getProducts();
      });
  }

  public async initUser(){
    this.user = await this.local.getItem('user');
    this.avatar = this.user.imageUrl;
  }

  delete(){
    this.db.deleteComment(this.devId)
    .then(_ => {
      this.router.navigateByUrl('tabs/tab2');
   });
 }
 
 updateComment() {
   this.comment.img=this.img;
   this.comment.msg=this.msg;
  this.db.updateComment(this.comment).then(async (res) => {
    let toast = await this.ui.crearToast('Comentario actualizado');
    this.router.navigateByUrl('tabs/tab2');
  });
}
}
