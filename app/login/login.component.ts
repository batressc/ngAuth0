import { Component } from '@angular/core';

import { AuthService } from '../shared/services/auth.service'; 

@Component({
    selector: 'ba3-login',
    templateUrl: 'app/login/login.component.html',
    styleUrls: ['app/login/login.component.css']
})
class LoginComponent {
    constructor(private auth: AuthService) { }
}

export { LoginComponent }