import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BaseHttpService } from "./base-http.service";

@Injectable({ providedIn: "root" })
export class HttpService extends BaseHttpService {
	constructor(http: HttpClient) {
		super(http);
	}
}
