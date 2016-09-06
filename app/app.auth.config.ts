import { Http, RequestOptions } from '@angular/http';
import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { AuthService } from './shared/services/auth.service';

const CLIENT_ID: string = 'dlPojysYVsEdDoyTelIKYSMM11OUGJ6x';
const DOMAIN: string = 'auth-batressc.auth0.com';
const TOKEN_NAME: string = 'auth_token';
const CUSTOM_AUTH_PROVIDER: any = {
    provide: AuthHttp,
    deps: [Http, RequestOptions, AuthService],
    useFactory: (http: Http, options: RequestOptions, customService: AuthService) => {
        return new AuthHttp(new AuthConfig({
            tokenName: TOKEN_NAME,
            tokenGetter: customService.isTokenNotExpired()
        }), http, options);
    }
};

export { 
    CLIENT_ID,
    DOMAIN,
    TOKEN_NAME,
    CUSTOM_AUTH_PROVIDER
}