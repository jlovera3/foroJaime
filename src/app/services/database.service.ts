import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { HttpClient } from '@angular/common/http';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { BehaviorSubject, Observable } from 'rxjs';
import { Dev } from '../model/Dev';
import { User } from '../model/User';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Comment } from '../model/Comment';

 
@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private database: SQLiteObject;
  private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);
 
  developers = new BehaviorSubject([]);
  comments = new BehaviorSubject([]);
  posts = new BehaviorSubject([]);

  email;
  user: User;
 
  constructor(private plt: Platform, 
    private sqlitePorter: SQLitePorter, 
    private sqlite: SQLite, 
    private http: HttpClient, 
    private local: NativeStorage) {

    this.plt.ready().then(() => {
      if(this.plt.is('capacitor')){
        this.sqlite.create({
          name: 'developers.db',
          location: 'default'
        })
        .then((db: SQLiteObject) => {
            this.database = db;
            this.seedDatabase();
        });
      }else{
        this.sqlite = new SQLite();
        this.sqlite.create({
          name: 'developers.db',
          location: 'default'
        }).then((db: SQLiteObject) => {
          this.database = db;
          this.seedDatabase();
        }).catch(e => {
          console.log(e);
        });
      }

    });
  }
 
  public async seedDatabase() {
    this.http.get('assets/seed.sql', { responseType: 'text'})
    .subscribe(sql => {
      this.sqlitePorter.importSqlToDb(this.database, sql)
        .then(async _ => {
          this.loadDevelopers();
          this.user = await this.local.getItem('user');
          this.email = this.user.email;
          this.loadDevelopersForOne(this.email);
          this.loadComments(0);
          this.dbReady.next(true);
        })
        .catch(e => console.error(e));
    });
  }
 
  getDatabaseState() {
    return this.dbReady.asObservable();
  }
 
  getDevs(): Observable<Dev[]> {
    return this.developers.asObservable();
  }

  getPostsOne(): Observable<Dev[]>{
    return this.posts.asObservable();
  }
 
  getComments(): Observable<Comment[]> {
    return this.comments.asObservable();
  }

  loadDevelopers() {
    return this.database.executeSql('SELECT * FROM developer', []).then(data => {
      let developers: Dev[] = [];
 
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          console.log(data);
 
          developers.push({ 
            id: data.rows.item(i).id,
            name: data.rows.item(i).name, 
            skills: data.rows.item(0).skills, 
            fecha: data.rows.item(i).fecha,
            img: data.rows.item(i).img,
            img2: data.rows.item(i).img2,
            img3: data.rows.item(i).img3,
            email: data.rows.item(i).email
           });
        }
      }
      this.developers.next(developers);
    });
  }

  loadDevelopersForOne(email) {
    console.log(email+' con este busco');
    return this.database.executeSql('SELECT * FROM developer WHERE email = ?', [email]).then(data => {
      let post: Dev[] = [];
 
      if (data.rows.length > 0) {
        console.log('Detecta alguno')
        for (var i = 0; i < data.rows.length; i++) { 

          post.push({ 
            id: data.rows.item(i).id,
            name: data.rows.item(i).name, 
            skills: data.rows.item(i).skills, 
            fecha: data.rows.item(i).fecha,
            img: data.rows.item(i).img,
            img2: data.rows.item(i).img2,
            img3: data.rows.item(i).img3,
            email: data.rows.item(i).email
           });
        }
      }
      this.posts.next(post);
      console.log(this.posts);
    });
  }
 
  addDeveloper(name, skills, date, img, img2, img3, email) {
    let data = [name, skills, date, img, img2, img3, email];
    return this.database.executeSql('INSERT INTO developer (name, skills, fecha, img, img2, img3, email) VALUES (?, ?, ?, ?, ?, ?, ?)', data).then(data => {
      this.loadDevelopers();
    });
  }
 
  getDeveloper(id): Promise<Dev> {
    return this.database.executeSql('SELECT * FROM developer WHERE id = ?', [id]).then(data => {
      return {
        id: data.rows.item(0).id,
        name: data.rows.item(0).name, 
        skills: data.rows.item(0).skills, 
        fecha: data.rows.item(0).fecha,
        img: data.rows.item(0).img,
        img2: data.rows.item(0).img2,
        img3: data.rows.item(0).img3,
        email: data.rows.item(0).email
      }
    });
  }
 
  deleteDeveloper(id) {
    return this.database.executeSql('DELETE FROM developer WHERE id = ?', [id]).then(_ => {
      this.loadDevelopers();
      this.loadComments(id);
    });
  }
 
  updateDeveloper(dev: Dev) {
    let data = [dev.name, dev.skills, dev.img, dev.img2, dev.img3];
    return this.database.executeSql(`UPDATE developer SET name = ?, skills = ?, img = ?, img2 = ?, img3 = ? WHERE id = ${dev.id}`, data).then(data => {
      this.loadDevelopers();
    })
  }
 
  loadComments(id) {
    let query = 'SELECT * FROM comment WHERE postId = ?';
    return this.database.executeSql(query, [id]).then(data => {
      let com = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          com.push({ 
            id: data.rows.item(i).id,
            msg: data.rows.item(i).msg,
            email: data.rows.item(i).email,
            avatar: data.rows.item(i).avatar,
            img: data.rows.item(i).img,
            postId: data.rows.item(i).postId
           });
        }
      }
      this.comments.next(com);
      console.log(com);
    });
  }
 
  addComment(msg, avatar, img, postId) {
    let data = [msg, avatar, img, this.email, postId];
    return this.database.executeSql('INSERT INTO comment (msg, avatar, img, email, postId) VALUES (?, ?, ?, ?, ?)', data);
  }
  
  getComment(id): Promise<Comment> {
    return this.database.executeSql('SELECT * FROM comment WHERE id = ?', [id]).then(data => {
      return {
        id: data.rows.item(0).id,
        msg: data.rows.item(0).msg, 
        email: data.rows.item(0).email,
        avatar: data.rows.item(0).avatar, 
        img: data.rows.item(0).img,
        postId: data.rows.item(0).postId
      }
    });
  }
  deleteComment(id) {
    return this.database.executeSql('DELETE FROM comment WHERE id = ?', [id]).then(_ => {
      this.loadDevelopers();
      this.loadComments(id);
    });
  }
  updateComment(com: Comment) {
    let data = [com.msg, com.img];
    return this.database.executeSql(`UPDATE comment SET msg = ?, img = ? WHERE id = ${com.id}`, data).then(data => {
      
    })
  }
 
}