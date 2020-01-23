import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BaseAuthService } from "./base-auth.service";
import {
	URL_TENANT_BASE,
	LS_TENANT_AUTH_TOKEN,
	LS_TENANT_AUTH_ACCOUNT,
	URL_TENANT_AUTH_TOKEN
} from "../auth-constants";

@Injectable({ providedIn: "root" })
export class TenantAuthService extends BaseAuthService {
	_baseUrl: string = URL_TENANT_BASE;

	constructor(http: HttpClient) {
		super(http);
		this.isTenant = true;
		this.tokenUrl = URL_TENANT_AUTH_TOKEN;
	}

	getTokenLocalStorageKey(): string {
		return LS_TENANT_AUTH_TOKEN;
	}

	getAccountLocalStorageKey(): string {
		return LS_TENANT_AUTH_ACCOUNT;
	}
}
