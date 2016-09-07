import { Component, OnInit } from '@angular/core';

import { AuthService } from '../shared/services/auth.service'; 

@Component({
    selector: 'ba3-login',
    templateUrl: 'app/login/login.component.html',
    styleUrls: ['app/login/login.component.css']
})
class LoginComponent implements OnInit {
    isAuthenticated: boolean;
    constructor(private auth: AuthService) { 
        this.isAuthenticated = false;
    }

    ngOnInit(): void {
        this.setAuthentication();
    }

    private setAuthentication(): void {
        this.auth.authenticated()
            .then(result => this.isAuthenticated = result)
            .catch(error => {
                console.log('Error en la recuperación de la autenticación');
                this.isAuthenticated = false;
            });
    }

    login(): void {
        this.auth.login();
        //Esta llamada falla ya que login es asincrono. CORREGIR!
        this.setAuthentication();
    }

    logout(): void {
        this.auth.logout();
        //Esta llamada falla ya que logout es asincrono. CORREGIR!
        this.setAuthentication();
    }
}

export { LoginComponent }