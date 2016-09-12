import { Component, OnInit } from '@angular/core';

import { AuthService } from '../shared/services/auth.service'; 

@Component({
    selector: 'ba3-login',
    templateUrl: 'app/login/login.component.html',
    styleUrls: ['app/login/login.component.css']
})
class LoginComponent implements OnInit {
    isAuthenticated: boolean;

    constructor(private authService: AuthService) { 
        this.isAuthenticated = false;
    }

    ngOnInit(): void {
        this.isAuthenticated = this.authService.isValidToken();
    }

    login(): void {
        this.authService.login();
    }

    logout(): void {
        this.authService.logout();
        window.location.reload();
    }
}

export { LoginComponent }