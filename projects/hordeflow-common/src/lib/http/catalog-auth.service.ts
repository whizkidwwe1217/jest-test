import { Injectable } from "@angular/core";
import { BaseAuthService } from "./base-auth.service";
import {
	LS_CATALOG_AUTH_ACCOUNT,
	LS_CATALOG_AUTH_TOKEN,
	URL_CATALOG_BASE,
	URL_CATALOG_AUTH_TOKEN
} from "../auth-constants";
import { HttpClient } from "@angular/common/http";

@Injectable({ providedIn: "root" })
export class CatalogAuthService extends BaseAuthService {
	_baseUrl: string = URL_CATALOG_BASE;

	constructor(http: HttpClient) {
		super(http);
		this.isTenant = false;
		this.tokenUrl = URL_CATALOG_AUTH_TOKEN;
	}

	getTokenLocalStorageKey(): string {
		return LS_CATALOG_AUTH_TOKEN;
	}

	getAccountLocalStorageKey(): string {
		return LS_CATALOG_AUTH_ACCOUNT;
	}
}
