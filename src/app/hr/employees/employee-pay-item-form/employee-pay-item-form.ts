import { Component, forwardRef, Input } from "@angular/core";
import { Validators, FormBuilder } from "@angular/forms";
import { HttpService } from "hordeflow-common";
import { ActivatedRoute } from "@angular/router";
import { DatagridEditor, DatagridEditorAccountService } from "hordeflowkit";
import { SmartAuthService } from "src/app/authentication/services/smart-auth.service";

@Component({
	templateUrl: "./employee-pay-item-form.html",
	selector: "hf-emp-pay-item-form",
	providers: [
		{
			provide: DatagridEditorAccountService,
			useExisting: forwardRef(() => SmartAuthService)
		},
		{
			provide: DatagridEditor,
			useExisting: forwardRef(() => EmployeePayItemFormComponent)
		}
	]
})
export class EmployeePayItemFormComponent extends DatagridEditor {
	_employeeId: any;

	buildFormControls() {
		return {
			employeeId: [null, Validators.required],
			payItemId: [null, Validators.required]
		};
	}

	get employeeId() {
		return this._employeeId;
	}

	@Input() set employeeId(value: any) {
		this._employeeId = value;
	}
}
