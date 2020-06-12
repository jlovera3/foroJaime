import { DatabaseService } from './../services/database.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Dev } from '../model/Dev';
 
@Component({
  selector: 'app-post',
  templateUrl: './post.page.html',
  styleUrls: ['./post.page.scss'],
})
export class PostPage implements OnInit {
  developer: Dev = null;
 
  constructor(private route: ActivatedRoute, private db: DatabaseService, private router: Router, private toast: ToastController) { }
 
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      let devId = params.get('id');
 
      this.db.getDeveloper(devId).then(data => {
        this.developer = data;
      });
    });
  }
 
  delete() {
    this.db.deleteDeveloper(this.developer.id).then(() => {
      this.router.navigateByUrl('tabs/tab2');
    });
  }
 
  updateDeveloper() {
    this.db.updateDeveloper(this.developer).then(async (res) => {
      let toast = await this.toast.create({
        message: 'Post actualizado',
        duration: 3000
      });
      toast.present();
      this.router.navigateByUrl('tabs/tab2');
    });
  }
}
