import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService } from 'src/app/services/database.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Dev } from 'src/app/model/Dev';
import { User } from 'src/app/model/User';
import { Comment } from 'src/app/model/Comment';

@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
})
export class AddPage implements OnInit {
  developer: Dev = null;
  comentario: {};
  user: User;
  msg;
  img;
  avatar;
  devId;
 
  constructor(private route: ActivatedRoute,
     private db: DatabaseService,
     private local: NativeStorage,
     private router: Router) { }
 
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.devId = params.get('id');
 
      this.db.getDeveloper(this.devId).then(data => {
        this.developer = data;
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
 
 addComment(){
     this.db.addComment(this.msg, this.avatar, this.img, this.devId)
     .then(_ => {
       this.router.navigate(['../tab2']);
    });
  }
}