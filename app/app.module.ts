import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { appRoutingProviders, routing } from './app.routing';

@NgModule({
    imports: [BrowserModule, routing],
    declarations: [AppComponent, LoginComponent, HomeComponent],
    bootstrap: [AppComponent],
    providers: [appRoutingProviders]
})
class AppModule { }

export { AppModule };
