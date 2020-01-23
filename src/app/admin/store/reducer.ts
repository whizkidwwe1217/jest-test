import { Actions, ActionTypes } from "./actions";
import { tenantAdapter, initialState, TenantState } from "./state";

export function tenantReducer(state = initialState, action: Actions): TenantState {
	switch (action.type) {
		case ActionTypes.LOAD_REQUEST:
		case ActionTypes.ADD_REQUEST:
		case ActionTypes.EDIT_REQUEST:
		case ActionTypes.DELETE_REQUEST:
			return {
				...state,
				isLoading: true,
				error: null
			};
		case ActionTypes.LOAD_SUCCESS:
			return tenantAdapter.addAll(action.payload.tenants, {
				...state,
				isLoading: false,
				error: null
			});
		case ActionTypes.ADD_SUCCESS:
			return tenantAdapter.addOne(action.payload.tenant, {
				...state,
				isLoading: false,
				error: null
			});
		case ActionTypes.EDIT_SUCCESS:
			return tenantAdapter.updateOne(
				{
					id: action.payload.tenant.id,
					changes: action.payload.tenant
				},
				{
					...state,
					isLoading: false,
					error: null
				}
			);
		case ActionTypes.DELETE_SUCCESS:
			return tenantAdapter.removeOne(action.payload.tenant.id, {
				...state,
				isLoading: false,
				error: null
			});
		case ActionTypes.FAILURE:
			return {
				...state,
				isLoading: false,
				error: action.payload.error
			};
		default:
			return state;
	}
}
