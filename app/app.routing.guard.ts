import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router';

import { AuthService } from './shared/services/auth.service';  

@Injectable()
class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) { }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.authService.isValidToken()) return true;
        else {
            this.router.navigate(['login']);
            return false;
        }
    }
}

export { AuthGuard }