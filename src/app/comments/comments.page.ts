import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService } from '../services/database.service';
import { Dev } from '../model/Dev';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { User } from '../model/User';
import { Comment } from '../model/Comment';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.page.html',
  styleUrls: ['./comments.page.scss'],
})
export class CommentsPage implements OnInit {
  developer: Dev = null;
  comentarios: Comment []= [];
  comment = {};
  user: User;
  img;
  devId;
 
  constructor(private route: ActivatedRoute,
     private db: DatabaseService,
     private local: NativeStorage) { }
 
  ngOnInit() {
    this.initUser();
    this.route.paramMap.subscribe(params => {
      this.devId = params.get('id');
      console.log(this.devId);
 
      this.db.getDeveloper(this.devId).then(data => {
        this.developer = data;
        console.log(this.developer);
      });
    });
    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {
          this.db.loadComments(this.devId);
          this.db.getComments().subscribe(coms => {
          this.comentarios = coms;
        });
        }
        //this.products = this.db.getProducts();
      });
  }

  public async initUser(){
    this.user = await this.local.getItem('user');
    this.img = this.user.imageUrl;
  }

 refresh(){
    this.db.loadComments(this.devId);
    this.db.getComments().subscribe(coms => {
      this.comentarios = coms;
    });
 }

}