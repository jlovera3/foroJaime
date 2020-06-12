import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Globalization } from '@ionic-native/globalization/ngx';
import { HttpClient, HttpClientModule } from '@angular/common/http'
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { AuthGuardService } from './services/auth-guard.service';
import { AuthService } from './services/auth.service';
import { NativeStorage} from '@ionic-native/native-storage/ngx';

import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Facebook } from '@ionic-native/facebook/ngx';

import { UiComponent } from './common/ui/ui.component';
import { firebaseConfig } from '../environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { SQLite } from '@ionic-native/sqlite/ngx';
 

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
  declarations: [AppComponent,UiComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule, 
    AngularFireModule.initializeApp(firebaseConfig), //Modulo 1 a importa
    AngularFireAuthModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    }),
  ],
  providers: [
    GooglePlus,
    UiComponent,
    NativeStorage,
    AuthGuardService,
    AuthService,
    TranslateService,
    HttpClient,
    Globalization,
    StatusBar,
    Facebook,
    SplashScreen,    
    SQLite,
    SQLitePorter,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }