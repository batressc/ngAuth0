import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Response } from '@angular/http';

import { AuthHttp } from 'angular2-jwt'; 

@Injectable()
class DataService {
    constructor(private authHttp: AuthHttp) { }

    getData(): Observable<Response> {
        return this.authHttp.get('http://localhost:22435/api/Shipments')
    }
}

export { DataService }