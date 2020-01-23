import { Observable, from, of, empty, EMPTY } from "rxjs";
import { HttpParams, HttpHeaders, HttpResponse } from "@angular/common/http";
import { switchMap, flatMap } from "rxjs/operators";
import * as _ from "lodash";
import { UriResource } from "./uri-resource";
import { DataField } from "./data-field";
import { FilterGroup } from "../utils/datafilter";
import { TextUtils } from "../utils/text.utils";
import { AuthToken } from "../models/auth-token";
import { HttpService } from "../http/http.service";
import { JwtProvider } from "../security/jwt-provider";
import { JwtClaims } from "../security/jwt-claims";
import { HttpSearchResponseData } from "../http/http-search-response-data";
import { HttpSearchParams } from "../http/http-search-params";

export interface IDataSource<T> {
	getStore(): Observable<T | any> | T[] | Function | UriResource | string;
	sort(): IDataSource<T>;
	page(from: number, size: number): IDataSource<T>;
	filter(filter: FilterGroup): IDataSource<T>;
	select(fields: DataField<T>[]): IDataSource<T>;
	fetch(): Observable<any>;
	create(record: T): Observable<T>;
	update(record: T, id?: number): Observable<HttpResponse<T> | any>;
	destroy(id: number): Observable<HttpResponse<T> | any>;
	destroyBatch(entityList: { entities: T[] }): Observable<HttpResponse<T> | any>;
	destroyBatchById(entityIdList: { entityIds: number[] }): Observable<HttpResponse<T> | any>;
	read(id: number): Observable<HttpResponse<T> | any>;
	getResource(): UriResource;
}

export abstract class DataSource<T> implements IDataSource<T> {
	public from: number = 1;
	public size: number = 50;
	public filterGroup: FilterGroup;
	public fieldNames: string;

	private buildFieldsString(fields: DataField<T>[] | string[]): string {
		if (!this.fieldNames) {
			let isStringArray = false;
			if (fields.length > 0 && typeof fields[0] === "string") {
				isStringArray = true;
			}

			if (isStringArray) {
				this.fieldNames = _.join(fields);
			} else {
				this.fieldNames = _.join(
					_.map(fields, (f: DataField<T>) => TextUtils.camelize(f.name))
				);
			}
		}
		return this.fieldNames;
	}

	abstract getStore(): Observable<T | any> | T[] | Function;

	getResource(): UriResource {
		return null;
	}

	select(fields: DataField<T>[]): IDataSource<T> {
		this.buildFieldsString(fields);
		return this;
	}

	sort(): IDataSource<T> {
		return this;
	}

	filter(filterGroup: FilterGroup): IDataSource<T> {
		this.filterGroup = filterGroup;
		return this;
	}

	page(from: number, size: number) {
		this.from = from;
		this.size = size;
		return this;
	}

	fetch(): Observable<T | any> {
		const ds = this.getStore();

		if (typeof ds == "function") {
			return from(ds());
		} else if (ds as Observable<T>) {
			return ds as Observable<T>;
		}

		return ds as Observable<any>;
	}

	create(record: T): Observable<T> {
		return of(record);
	}

	update(record: T, id?: number): Observable<HttpResponse<T> | any> {
		return of(record);
	}

	destroy(id: number): Observable<HttpResponse<T> | any> {
		return EMPTY;
	}

	destroyBatch(entityList: { entities: T[] }): Observable<HttpResponse<T> | any> {
		return EMPTY;
	}

	destroyBatchById(entityIdList: { entityIds: number[] }): Observable<HttpResponse<T> | any> {
		return EMPTY;
	}

	read(id: number): Observable<HttpResponse<T> | any> {
		return EMPTY;
	}
}

export class ArrayDataSource<T> extends DataSource<T> {
	data: T[];

	setData(data: T[]) {
		this.data = data;
	}

	getStore(): T[] {
		return this.data;
	}

	fetch(): Observable<T | any> {
		const output: HttpSearchResponseData<T> = {
			currentPage: this.from,
			pageSize: this.size,
			pageCount: this.data ? this.data.length / this.size : 0,
			total: this.data ? this.data.length : 0,
			data: this.data
		};
		return of(output);
	}
}

export interface IDataSourceAuthentication {
	auth: AuthToken;
	action: Function;
}

export class DataHttpDataSource<T> extends DataSource<T> {
	private resource: UriResource;
	private root: string = "";
	private params: HttpParams;
	private auth: Observable<any>;

	setResource(resource: UriResource, params?: HttpParams, root?: string): DataHttpDataSource<T> {
		this.resource = resource;
		this.root = root;
		this.params = params;
		return this;
	}

	getResource(): UriResource {
		return this.resource;
	}

	constructor(private http: HttpService) {
		super();
	}

	getStore(): Observable<HttpSearchResponseData<T>> {
		let obs$: Observable<T>;
		if (this.auth) {
			obs$ = this.auth.pipe(
				switchMap((authToken: AuthToken) => {
					const headers: HttpHeaders = new HttpHeaders({
						CompanyId: this.getCompany(authToken),
						Authorization: `${"Bearer"} ${authToken.accessToken}`
					});
					return this.http.json<T>(
						_.defaultTo(this.resource.listUrl, ""),
						this.root,
						this.params,
						headers
					);
				})
			);
		}

		obs$ = this.http.json<T>(_.defaultTo(this.resource.listUrl, ""), this.root, this.params);

		return obs$.pipe(
			flatMap((response: T) => {
				const records: T[] = _.isArray(response) ? response : [];
				const output: HttpSearchResponseData<T> = {
					currentPage: this.from,
					pageSize: this.size,
					pageCount: records.length / this.size,
					total: records.length,
					data: records
				};
				return of(output);
			})
		);
	}

	authentication(auth: Observable<AuthToken>): IDataSource<T> {
		this.auth = auth;
		return this;
	}

	fetch(): Observable<HttpSearchResponseData<T>> {
		return this.getStore();
	}

	private getCompany(authToken: AuthToken): string {
		const jwtProvider = new JwtProvider();
		const token = jwtProvider.decodeToken(authToken.accessToken);
		const company = _.get(token, JwtClaims.Company);
		return company;
	}
}

export class DataWebApiDataSource<T> extends DataSource<T> {
	private resource: UriResource;
	private root = false;
	private params: HttpParams;
	private auth: Observable<any>;

	setResource(
		resource: UriResource,
		params?: HttpParams,
		root?: boolean
	): DataWebApiDataSource<T> {
		this.resource = resource;
		this.root = root ? root : resource.root;
		this.params = params;
		return this;
	}

	getResource() {
		return this.resource;
	}

	constructor(private http: HttpService) {
		super();
	}

	getStore(): Observable<HttpSearchResponseData<T>> {
		const searchParams: HttpSearchParams = {
			currentPage: this.from,
			pageSize: this.size,
			filter: JSON.stringify(this.filterGroup),
			fields: this.fieldNames
		};

		if (this.auth) {
			return this.auth.pipe(
				switchMap((authToken: AuthToken) => {
					const headers: HttpHeaders = new HttpHeaders({
						CompanyId: this.getCompany(authToken),
						Authorization: `${"Bearer"} ${authToken.accessToken}`
					});
					return this.http.search<T>(
						_.defaultTo(this.resource.listUrl, ""),
						searchParams,
						this.root,
						this.params,
						headers
					);
				})
			);
		}

		return this.http.search<T>(
			_.defaultTo(this.resource.listUrl, ""),
			searchParams,
			this.root,
			this.params
		);
	}

	authentication(auth: Observable<AuthToken>): IDataSource<T> {
		this.auth = auth;
		return this;
	}

	fetch(): Observable<HttpSearchResponseData<T>> {
		return this.getStore();
	}

	create(record: T): Observable<T> {
		return this.http.create<T>(this.resource.createUrl, record);
	}

	update(record: T, id?: number): Observable<HttpResponse<T> | any> {
		return this.http.update<number, T>(
			this.resource.updateUrl,
			id ? id : _.get(record, "id"),
			record
		);
	}

	destroy(id: number): Observable<HttpResponse<T> | any> {
		return this.http.delete<number, T>(this.resource.destroyUrl, id);
	}

	destroyBatch(entityList: { entities: T[] }): Observable<HttpResponse<T> | any> {
		return this.http.process(`${this.resource.destroyUrl}/batch_delete`, entityList);
	}

	destroyBatchById(entityIdList: { entityIds: number[] }): Observable<HttpResponse<T> | any> {
		return this.http.process(`${this.resource.destroyUrl}/batch_delete_by_id`, entityIdList);
	}

	read(id: number): Observable<HttpResponse<T> | any> {
		return this.http.get<T, number>(this.resource.readUrl, id);
	}

	private getCompany(authToken: AuthToken): string {
		const jwtProvider = new JwtProvider();
		const token = jwtProvider.decodeToken(authToken.accessToken);
		const company = _.get(token, JwtClaims.Company);
		return company;
	}
}
