import { Action } from "@ngrx/store";
import { Tenant } from "hordeflow-common";

export enum TenantsActionTypes {
    LIST_TENANTS = "[Tenants] LIST_TENANTS",
    LIST_TENANTS_SUCCESS = "[Tenants] LIST_TENANTS_SUCCESS",
    ADD_TENANT = "[Tenants] ADD_TENANT",
    ADD_TENANT_SUCCESS = "[Tenants] ADD_TENANT_SUCCESS",
    GET_TENANT = "[Tenants] GET_TENANT",
    GET_TENANT_SUCCESS = "[Tenants] GET_TENANT_SUCCESS",
    DELETE_TENANT = "[Tenants] DELETE_TENANT",
    DELETE_TENANT_SUCCESS = "[Tenants] DELETE_TENANT_SUCCESS",
    TENANTS_ERROR = "[Tenants] TENANTS_ERROR"
}

export class TenantsError implements Action {
    readonly type = TenantsActionTypes.TENANTS_ERROR;
    payload: any;

    constructor(payload: any) {
        this.payload = payload;
    }
}

export class ListTenants implements Action {
    readonly type = TenantsActionTypes.LIST_TENANTS;
    payload: Tenant[];

    constructor(payload: Tenant[]) {
        this.payload = payload;
    }
}

export class ListTenantsSuccess implements Action {
    readonly type = TenantsActionTypes.LIST_TENANTS_SUCCESS;
    payload: Tenant;

    constructor(payload: Tenant) {
        this.payload = payload;
    }
}

export class AddTenant implements Action {
    readonly type = TenantsActionTypes.ADD_TENANT;
    payload: Tenant;

    constructor(payload: Tenant) {
        this.payload = payload;
    }
}

export class AddTenantSuccess implements Action {
    readonly type = TenantsActionTypes.ADD_TENANT_SUCCESS;
    payload: Tenant;

    constructor(payload: Tenant) {
        this.payload = payload;
    }
}

export class GetTenant implements Action {
    readonly type = TenantsActionTypes.GET_TENANT;
    payload: string;

    constructor(payload: string) {
        this.payload = payload;
    }
}

export class GetTenantSuccess implements Action {
    readonly type = TenantsActionTypes.GET_TENANT_SUCCESS;
    payload: Tenant;

    constructor(payload: Tenant) {
        this.payload = payload;
    }
}

export class DeleteTenant implements Action {
    readonly type = TenantsActionTypes.DELETE_TENANT;
    payload: string;

    constructor(payload: string) {
        this.payload = payload;
    }
}

export class DeleteTenantSuccess implements Action {
    readonly type = TenantsActionTypes.DELETE_TENANT_SUCCESS;
    payload: string;

    constructor(payload: string) {
        this.payload = payload;
    }
}

export type TenantsActions =
    | ListTenants
    | ListTenantsSuccess
    | TenantsError
    | AddTenant
    | AddTenantSuccess
    | GetTenant
    | GetTenantSuccess
    | DeleteTenant
    | DeleteTenantSuccess;
