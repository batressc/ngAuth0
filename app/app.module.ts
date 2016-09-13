import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './app.routing.guard';
import { appRoutingProviders, routing } from './app.routing';
import { AuthService } from './shared/services/auth.service';
import { TOKEN_NAME, CUSTOM_AUTH_PROVIDER } from './app.auth.config';

import { DataService } from './shared/services/data.service';
import { Http, ConnectionBackend, HttpModule } from '@angular/http';

@NgModule({
    imports: [BrowserModule, routing, HttpModule],
    declarations: [AppComponent, LoginComponent, HomeComponent],
    bootstrap: [AppComponent],
    providers: [
        /*Http,
        ConnectionBackend,*/
        AuthGuard,
        appRoutingProviders,
        DataService,
        AuthService,
        CUSTOM_AUTH_PROVIDER
    ]
})
class AppModule { }

export { AppModule };
