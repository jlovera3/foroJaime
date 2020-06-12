import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { Dev } from '../model/Dev';
import { UiComponent } from '../common/ui/ui.component';
import { User } from '../model/User';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page{
  user: User;
  developers: Dev[] = [];
  email;
 
 // products: Observable<any[]>;
 
  developer = {};
  //product = {};
 
  selectedView = 'new';
 
  constructor(private db: DatabaseService,
    private ui: UiComponent,
    private local: NativeStorage) { }
 
  ngOnInit() {
    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {
          this.initUser();
          this.db.getPostsOne().subscribe(devs => {
          this.developers = devs;
        });
        }
        //this.products = this.db.getProducts();
      });
    
  }

  public async initUser(){
    this.user = await this.local.getItem('user');
    this.email = this.user.email;
  }
 
  public async addDeveloper() {
    var fecha= this.getFecha();
    console.log(this.email+' con este añado');
    this.db.addDeveloper(this.developer['name'], this.developer['skills'], fecha, this.developer['img'], this.developer['img2'], this.developer['img3'], this.email)
    .then(_ => {
      this.developer = {};
      this.ui.crearToast('Post añadido');
    });
  }


  getFecha(){
    var currentDate = new Date();

    var date = currentDate.getDate();
    var month = currentDate.getMonth(); //Be careful! January is 0 not 1
    var year = currentDate.getFullYear();
    var hour= currentDate.getHours();
    var min= currentDate.getMinutes();
    var sec=currentDate.getSeconds();
    
    var fecha = date + "-" +(month + 1) + "-" + year+"  "+hour+":"+min+":"+sec;
    return fecha;
  }
 
  /*addProduct() {
    this.db.addProduct(this.product['name'], this.product['creator'])
    .then(_ => {
      this.product = {};
    });
  }*/
 
}

