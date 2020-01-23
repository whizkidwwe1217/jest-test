import { Tenant } from "hordeflow-common";
import { TenantsActionTypes, TenantsActions } from "../actions/tenants.action";
import { EntityState, createEntityAdapter } from "@ngrx/entity";

export function tenantsReducer(state: Tenant[] = [], action: TenantsActions) {
    switch (action.type) {
        case TenantsActionTypes.ADD_TENANT_SUCCESS:
            return [...state, action.payload];
        case TenantsActionTypes.GET_TENANT_SUCCESS:
            return state.filter(x => x.id === action.payload.id);
        case TenantsActionTypes.LIST_TENANTS_SUCCESS:
            return action.payload;
        case TenantsActionTypes.TENANTS_ERROR:
            return Object.assign({}, state, { error: action.payload });
        default:
            return state;
    }
}
