import { Component } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { UiComponent } from '../common/ui/ui.component';
import { Dev } from '../model/Dev';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
 
  developers: Dev[] = [];
 
 // products: Observable<any[]>;
 
  developer = {};
  constructor(private db: DatabaseService,
    private ui: UiComponent) { }
 
 
  ngOnInit() {
    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.db.getDevs().subscribe(devs => {
          this.developers = devs;
        })
        //this.products = this.db.getProducts();
        this.sortReverse();
      }
    });
  }

  sortReverse(){
    this.developers= this.developers.sort((a: Dev,b:Dev)=> {
      return b.id-a.id;
    });
  }

  sort(){
    this.developers= this.developers.sort((a: Dev,b:Dev)=> {
      return a.id-b.id;
    });
  }

  sortTitle(){
    this.developers= this.developers.sort((a: Dev,b:Dev)=> {
      if (a.name > b.name) {
        return 1;
      }
      if (a.name < b.name) {
        return -1;
      }
      // a must be equal to b
      return 0;
    });
  }

}
