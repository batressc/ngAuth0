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

    private setAuthentication(): void {
        this.auth.isValidToken()
            .then(result => this.isAuthenticated = result)
            .catch(error => {
                console.log('Error en la recuperación de la autenticación');
                this.isAuthenticated = false;
            });
    }

    ngOnInit(): void {
        this.setAuthentication();
    }

    login(): void {
        this.auth.login();
    }

    logout(): void {
        this.auth.logout();
        location.reload();
    }
}

export { LoginComponent }