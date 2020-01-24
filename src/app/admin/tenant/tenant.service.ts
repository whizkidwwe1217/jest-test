import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { throwError, Observable } from "rxjs";
import { HttpResponse } from "@angular/common/http";
import { URLSearchParams } from "url";
import { Tenant } from "hordeflow-common";

@Injectable()
export class TenantService {
	constructor(private http: HttpClient) {}

	getTenants(): Observable<Tenant[]> {
		//Observable<HttpResponse<Tenant[]>>
		return (
			this.http
				// This returns a full response, use Observable<HttpResponse<Tenant[]>> as return data
				//.get<Tenant[]>('api/v1/catalog', { headers: headers, observe: 'response' })
				.get<Tenant[]>("api/v1/admin/catalog")
				.pipe(catchError(this.handleError))
		);
	}

	getTenant(id: string): Observable<Tenant> {
		return this.http.get<Tenant>(`api/v1/admin/catalog/${id}`);
	}

	createTenant(tenant: Tenant) {
		delete tenant.id;
		return this.http.post<Tenant>("api/v1/admin/catalog", tenant);
	}

	updateTenant(tenant: Tenant) {
		return this.http.put<Tenant>(`api/v1/admin/catalog/${tenant.id}`, tenant);
	}

	deployTenant(tenant: Tenant): Observable<HttpResponse<any>> {
		let headers = new HttpHeaders({
			"Content-Type": "application/x-www-form-urlencoded"
		});
		let body = new HttpParams().set("id", tenant.id);
		return this.http.post("api/v1/admin/catalog/migratetenant", body.toString(), {
			headers: headers,
			observe: "response"
		});
	}

	dropTenantDatabase(tenant: Tenant): Observable<HttpResponse<any>> {
		let headers = new HttpHeaders({
			"Content-Type": "application/x-www-form-urlencoded"
		});
		let body = new HttpParams().set("id", tenant.id);
		return this.http.post("api/v1/admin/catalog/dropdatabase", body.toString(), {
			headers: headers,
			observe: "response"
		});
	}

	deleteTenant(tenant: Tenant) {
		return this.http.delete(`api/v1/admin/catalog/${tenant.id}`);
	}

	private handleError(error: HttpErrorResponse) {
		if (error.error instanceof ErrorEvent) {
			console.error("An error occurred:", error.error.message);
		} else {
			console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
		}
		return throwError("Something bad happened; please try again later.");
	}
}
