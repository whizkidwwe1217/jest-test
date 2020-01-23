import { createReducer, on } from "@ngrx/store";
import { SetInfo, GetInfo } from "../actions/app-info.action";
import { AppInfo } from "hordeflow-common";

const initialState: AppInfo = {
	hasCompany: false,
	isTenant: false,
	isAdmin: true,
	tenant: null
};

const _appInfoReducer = createReducer(
	initialState,
	on(SetInfo, (state, action) => action),
	on(GetInfo, state => state)
);

export function appInfoReducer(state, action) {
	return _appInfoReducer(state, action);
}
