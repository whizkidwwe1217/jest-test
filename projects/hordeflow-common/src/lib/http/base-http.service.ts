import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import * as _ from "lodash";
import { Observable, from, of } from "rxjs";
import { flatMap } from "rxjs/operators";
import { HttpSearchParams } from "./http-search-params";
import { HttpSearchResponseData } from "./http-search-response-data";

@Injectable({ providedIn: "root" })
export class BaseHttpService {
	constructor(protected http: HttpClient) {}

	getResourceUrl(resource: string): string {
		return resource;
	}

	list<T>(resource: string, params?: HttpParams, headers?: HttpHeaders): Observable<T[]> {
		return this.http.get<T[]>(this.getResourceUrl(resource), {
			headers: this.getDefaultFormUrlHttpHeaders(headers),
			params: params
		});
	}

	json<T>(
		resource: string,
		root?: string,
		params?: HttpParams,
		headers?: HttpHeaders
	): Observable<T> {
		if (root) {
			return this.http
				.get<any>(this.getResourceUrl(resource), {
					headers: this.getDefaultFormUrlHttpHeaders(headers),
					params: params
				})
				.pipe(
					flatMap(response => {
						const data = response[root];
						return of(data);
					})
				);
		}
		return this.http.get<T>(this.getResourceUrl(resource), {
			headers: this.getDefaultFormUrlHttpHeaders(headers),
			params: params
		});
	}

	getValue<T>(resource: string, params?: HttpParams, headers?: HttpHeaders): Observable<T> {
		return this.http.get<T>(this.getResourceUrl(resource), {
			headers: this.getDefaultJsonHttpHeaders(headers),
			params: params
		});
	}

	get<T, K>(resource: string, id: K, params?: HttpParams, headers?: HttpHeaders): Observable<T> {
		return this.http.get<T>(this.getResourceUrl(resource) + "/" + id, {
			headers: this.getDefaultFormUrlHttpHeaders(headers),
			params: params
		});
	}

	create<T>(
		resource: string,
		entity: T,
		params?: HttpParams,
		headers?: HttpHeaders
	): Observable<T> {
		return this.http.post<T>(this.getResourceUrl(resource), entity, {
			headers: this.getDefaultJsonHttpHeaders(headers),
			params: params
		});
	}

	delete<K, T>(
		resource: string,
		id: K,
		params?: HttpParams,
		headers?: HttpHeaders
	): Observable<HttpResponse<T>> {
		return this.http.delete<T>(this.getResourceUrl(resource) + "/" + id, {
			headers: this.getDefaultJsonHttpHeaders(headers),
			observe: "response",
			params: params
		});
	}

	update<K, T>(
		resource: string,
		id: K,
		entity: T,
		params?: HttpParams,
		headers?: HttpHeaders
	): Observable<HttpResponse<T>> {
		return this.http.put<T>(this.getResourceUrl(resource) + "/" + id, entity, {
			headers: this.getDefaultJsonHttpHeaders(headers),
			observe: "response",
			params: params
		});
	}

	search<T>(
		resource: string,
		options: HttpSearchParams,
		rootResource?: boolean,
		params?: HttpParams,
		headers?: HttpHeaders
	): Observable<HttpSearchResponseData<T>> {
		const searchParams = this.getSearchParams(options, params);
		return this.http.get<HttpSearchResponseData<T>>(
			this.getResourceUrl(
				resource + (rootResource ? "" : options.fields ? "/searchdynamic" : "/search")
			),
			{
				params: searchParams,
				headers: this.getDefaultFormUrlHttpHeaders(headers)
			}
		);
	}

	process<TResponse, TPayload>(
		resource: string,
		entity: TPayload,
		params?: HttpParams,
		headers?: HttpHeaders
	): Observable<HttpResponse<TResponse>> {
		return this.http.post<TResponse>(this.getResourceUrl(resource), entity, {
			headers: this.getDefaultJsonHttpHeaders(headers),
			observe: "response",
			params: params
		});
	}

	private getSearchParams<T, Y>(options: HttpSearchParams, extras?: HttpParams): HttpParams {
		let params = new HttpParams()
			.set("currentPage", options.currentPage ? options.currentPage.toString() : "0")
			.set("pageSize", options.pageSize ? options.pageSize.toString() : "0")
			.set("filter", options.filter ? options.filter : "")
			.set("sort", options.sort ? options.sort : "")
			.set("fields", options.fields ? options.fields : "");
		if (extras) {
			extras.keys().forEach(key => {
				params = params.set(key, extras.get(key));
			});
		}
		return params;
	}

	private getDefaultJsonHttpHeaders(headers: HttpHeaders): HttpHeaders {
		let defaultHeaders = new HttpHeaders({
			"Content-Type": "application/json",
			Accept: "application/json"
		});
		if (headers) {
			headers.keys().forEach(key => {
				defaultHeaders = defaultHeaders.set(key, headers.get(key));
			});
		}
		return defaultHeaders;
	}

	private getDefaultFormUrlHttpHeaders(headers: HttpHeaders): HttpHeaders {
		let defaultHeaders = new HttpHeaders({
			"Content-Type": "application/x-www-form-urlencoded",
			Accept: "application/x-www-form-urlencoded"
		});
		if (headers) {
			headers.keys().forEach(key => {
				defaultHeaders = defaultHeaders.set(key, headers.get(key));
			});
		}
		return defaultHeaders;
	}
}
