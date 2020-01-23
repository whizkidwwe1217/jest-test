import { Action } from "@ngrx/store";
import { Tenant } from "hordeflow-common";

export enum ActionTypes {
	LOAD_REQUEST = "[Tenant] Load Request",
	FAILURE = "[Tenant] Failure",
	LOAD_SUCCESS = "[Tenant] Load Success",
	ADD_REQUEST = "[Tenant] Add Request",
	ADD_SUCCESS = "[Tenant] Add Success",
	EDIT_REQUEST = "[Tenant] Edit Request",
	EDIT_SUCCESS = "[Tenant] Edit Success",
	DELETE_REQUEST = "[Tenant] Delete Request",
	DELETE_SUCCESS = "[Tenant] Delete Success"
}

export class LoadRequestAction implements Action {
	readonly type = ActionTypes.LOAD_REQUEST;
	constructor(public payload: { url: string; refresh: boolean }) {}
}

export class FailureAction implements Action {
	readonly type = ActionTypes.FAILURE;
	constructor(public payload: { error: string }) {}
}

export class LoadSuccessAction implements Action {
	readonly type = ActionTypes.LOAD_SUCCESS;
	constructor(public payload: { tenants: Tenant[] }) {}
}

export class AddRequestAction implements Action {
	readonly type = ActionTypes.ADD_REQUEST;
	constructor(public payload: { tenant: Tenant }) {}
}

export class AddSuccesstAction implements Action {
	readonly type = ActionTypes.ADD_SUCCESS;
	constructor(public payload: { tenant: Tenant }) {}
}

export class EditRequestAction implements Action {
	readonly type = ActionTypes.EDIT_REQUEST;
	constructor(public payload: { tenant: Tenant }) {}
}

export class EditSuccesstAction implements Action {
	readonly type = ActionTypes.EDIT_SUCCESS;
	constructor(public payload: { tenant: Tenant }) {}
}

export class DeleteRequestAction implements Action {
	readonly type = ActionTypes.DELETE_REQUEST;
	constructor(public payload: { tenant: Tenant }) {}
}

export class DeleteSuccessAction implements Action {
	readonly type = ActionTypes.DELETE_SUCCESS;
	constructor(public payload: { tenant: Tenant }) {}
}

export type Actions =
	| LoadRequestAction
	| FailureAction
	| LoadSuccessAction
	| AddRequestAction
	| AddSuccesstAction
	| EditRequestAction
	| EditSuccesstAction
	| DeleteRequestAction
	| DeleteSuccessAction;
