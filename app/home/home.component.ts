import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/map';

import { AuthService } from '../shared/services/auth.service';
import { DataService } from '../shared/services/data.service';

@Component({
    selector: 'ba3-home',
    templateUrl: 'app/home/home.component.html',
    styleUrls: ['app/home/home.component.css']
})
class HomeComponent implements OnInit {
    imgProfile: string;
    nickNameProfile: string;
    data: Array<any>; 

    constructor(private auth: AuthService, private dataService: DataService) { 
        this.imgProfile = '';
        this.nickNameProfile = '';
        this.data = [];
    }

    ngOnInit(): void {
        let profile = this.auth.getLocalProfile();
        if (profile) {
            this.imgProfile = profile.picture;
            this.nickNameProfile = profile.nickname;
        }
        this.getData();
    }

    logout(): void {
        this.auth.logout();
    }

    getData(): void {
        this.dataService.getData().map(result => result.json())
            .subscribe(
                data => { this.data = data; },
                error => console.log(error),
                () => console.log('Datos obtenidos')
            );
    }
}

export { HomeComponent }