import { Http, RequestOptions } from '@angular/http';

import { AuthHttp, AuthConfig } from 'angular2-jwt';

import { AuthService } from './shared/services/auth.service';

const CLIENT_ID: string = 'dlPojysYVsEdDoyTelIKYSMM11OUGJ6x';
const DOMAIN: string = 'auth-batressc.auth0.com';
const TOKEN_NAME: string = 'auth_token';
const PROFILE_VAR: string = 'auth_profile';
const DELEGATION = 'https://auth-batressc.auth0.com/delegation';
const DEVICE = 'batriano';
const CUSTOM_AUTH_PROVIDER: any = customProvider();

function customProvider(): any {
    return {
        provide: AuthHttp,
        deps: [
            { provide: Http, useExisting: Http }, 
            { provide: RequestOptions, useExisting: RequestOptions }, 
            { provide: AuthService, useExisting: AuthService} 
        ],
        useFactory: (http: Http, options: RequestOptions, service: AuthService) => {
            return new AuthHttp(new AuthConfig({
                tokenName: TOKEN_NAME,
                tokenGetter: service.getToken
            }), http, options);
        }
    };
}

export { 
    CLIENT_ID,
    DOMAIN,
    TOKEN_NAME,
    PROFILE_VAR,
    DELEGATION,
    DEVICE,
    CUSTOM_AUTH_PROVIDER
}