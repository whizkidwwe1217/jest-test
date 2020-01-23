import { createAction, props } from "@ngrx/store";
import { AppInfo } from "hordeflow-common";

export const SET_INFO = "[AppInfo] SET_INFO";
export const GET_INFO = "[AppInfo] GET_INFO";

export const SetInfo = createAction(SET_INFO, props<AppInfo>());
export const GetInfo = createAction(GET_INFO);
