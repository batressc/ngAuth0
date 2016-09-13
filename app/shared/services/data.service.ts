import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Response } from '@angular/http';

import { AuthService } from './auth.service';

@Injectable()
class DataService {
    constructor(private authService: AuthService, private http: Http) { }

    getData(): Observable<Response> {
        let headers: Headers = new Headers();
        headers.append('Authorization', `Bearer ${this.authService.getToken()}`);
        return this.http.get('http://localhost:22435/api/Shipments', { headers: headers });
    }
}

export { DataService }