import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../shared/services/auth.service';

@Component({
    selector: 'ba3-home',
    templateUrl: 'app/home/home.component.html',
    styleUrls: ['app/home/home.component.css']
})
class HomeComponent implements OnInit {
    imgProfile: string;
    nickNameProfile: string; 

    constructor(private auth: AuthService, private router: Router) { 
        this.imgProfile = '';
        this.nickNameProfile = '';
    }

    ngOnInit(): void {
        this.auth.getLocalProfile()
            .then(profile => {
                if (profile) {
                    this.imgProfile = profile.picture;
                    this.nickNameProfile = profile.nickname;
                } else {
                    this.imgProfile = '';
                    this.nickNameProfile = '';
                }
            })
            .catch(error => {
                console.log('Ha ocurrido un error');
            });
    }

    logout(): void {
        this.auth.logout();
        this.router.navigate(['login']);
    }
}

export { HomeComponent }