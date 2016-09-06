import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { appRoutingProviders, routing } from './app.routing';
import { TOKEN_NAME, CUSTOM_AUTH_PROVIDER } from './app.auth.config';
import { AuthService } from './shared/services/auth.service';

@NgModule({
    imports: [BrowserModule, HttpModule, routing],
    declarations: [AppComponent, LoginComponent, HomeComponent],
    bootstrap: [AppComponent],
    providers: [
        appRoutingProviders,
        AuthService, 
        CUSTOM_AUTH_PROVIDER
    ]
})
class AppModule { }

export { AppModule };
