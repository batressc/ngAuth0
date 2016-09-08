import { Component, AfterViewInit } from '@angular/core';

import { AuthService } from '../shared/services/auth.service'; 

@Component({
    selector: 'ba3-login',
    templateUrl: 'app/login/login.component.html',
    styleUrls: ['app/login/login.component.css']
})
class LoginComponent implements AfterViewInit {
    isAuthenticated: boolean;
    constructor(private auth: AuthService) { 
        this.isAuthenticated = false;
    }

    ngAfterViewInit(): void {
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
}

export { LoginComponent }