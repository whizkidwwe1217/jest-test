import { Injectable, Injector } from "@angular/core";
import {
	HttpInterceptor,
	HttpEvent,
	HttpHandler,
	HttpRequest,
	HttpErrorResponse,
	HttpClient,
	HttpResponse
} from "@angular/common/http";
import { Observable, of } from "rxjs";
import * as dateFns from "date-fns";
import * as _ from "lodash";
import {
	CatalogAuthService,
	TenantAuthService,
	URL_APP_ASSEMBLY,
	URL_APP_COMPANIES,
	URL_TENANT_AUTH_TOKEN,
	URL_CATALOG_AUTH_TOKEN,
	UserAccount,
	AuthToken,
	AppInfo,
	URL_APP_INFO,
	JwtProvider
} from "hordeflow-common";
import { switchMap, tap } from "rxjs/operators";
import { Store } from "@ngrx/store";
import { SmartAuthService } from "../../authentication/services/smart-auth.service";
import { Router, ActivatedRoute } from "@angular/router";
import { AppState } from "src/app/data/app-state";

@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {
	appInfo: AppInfo;
	constructor(
		private injector: Injector,
		private store: Store<AppState>,
		private authCatalog: CatalogAuthService,
		private authTenant: TenantAuthService,
		private router: Router,
		private route: ActivatedRoute
	) {
		this.store.subscribe(state => (this.appInfo = state.appInfo));
	}

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		if (this.isWhitelistedUrl(req.url)) return next.handle(req);

		let authToken: AuthToken;
		let account: UserAccount;

		if (this.appInfo.isTenant) {
			authToken = this.authTenant.getAuthorizationToken();
			account = this.authTenant.getAccount();
		} else {
			authToken = this.authCatalog.getAuthorizationToken();
			account = this.authCatalog.getAccount();
		}

		if (authToken && authToken.accessToken) {
			const jwtProvider = new JwtProvider();
			const isTokenExpired = jwtProvider.isTokenExpired(authToken.accessToken, 0.09);

			if (!isTokenExpired) {
				return next.handle(this.setToken(req, authToken));
			} else {
				const sas = this.injector.get(SmartAuthService);
				return sas.refreshToken(authToken).pipe(
					tap(
						e => {
							// Do something with successful requests.
						},
						err => {
							if (err instanceof HttpErrorResponse) {
								this.router.navigate(["./login"], {
									queryParams: {
										returnUrl: this.router.url,
										reason: "Invalid refresh token."
									}
								});
							}
						}
					),
					switchMap((token: AuthToken) => {
						return next.handle(this.setToken(req, token));
					})
				);
			}
		}

		return next.handle(req);
	}

	setToken(req: HttpRequest<any>, authToken: AuthToken) {
		let companyId = "";
		let tenantId = "";
		if (this.appInfo.isTenant) {
			companyId = this.authTenant.getAccount().companyId;
			tenantId = this.appInfo.tenant.id;
		} else {
			companyId = this.authCatalog.getAccount().companyId;
		}
		return req.clone({
			setHeaders: {
				Authorization: `${"Bearer"} ${authToken.accessToken}`,
				CompanyId: _.isUndefined(companyId) ? "" : companyId,
				TenantId: _.isUndefined(tenantId) ? "" : tenantId
			}
		});
	}

	isWhitelistedUrl(url: string): boolean {
		// matches 'api/v1/tenant/initialize' and 'api/v1/auth/account/refreshtoken' exactly
		// C# version: ^\/?api/(?=((?!/).)*/(tenant/initialize|account/refreshtoken))(v|version).+
		const regex = /^\/?api\/(?=((?!\/).)*\/(tenant\/initialize|auth\/account\/refreshtoken))(v|version).+/;

		return (
			this.matches(url, URL_CATALOG_AUTH_TOKEN) ||
			this.matches(url, URL_TENANT_AUTH_TOKEN) ||
			this.matches(url, URL_APP_ASSEMBLY) ||
			this.matches(url, URL_APP_COMPANIES) ||
			this.matches(url, URL_APP_INFO) ||
			regex.test(url)
		);
	}

	matches(url: string, endpoint: string): boolean {
		return url.indexOf(endpoint) !== -1;
	}
}
