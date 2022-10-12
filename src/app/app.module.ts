import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {HttpClientModule} from "@angular/common/http";
import { LoginOrRegisterComponent } from './login-or-register/login-or-register.component';
import { RenderControlComponent } from './render-control/render-control.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { UserPageComponent } from './user-page/user-page.component';
import { UserHomeComponent } from './user-home/user-home.component';
import { EventCreateComponent } from './event-create/event-create.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginOrRegisterComponent,
    RenderControlComponent,
    UserPageComponent,
    UserHomeComponent,
    EventCreateComponent
  ],
    imports: [
        BrowserModule,
        HttpClientModule,
        NgbModule,
        ReactiveFormsModule,
        FormsModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
