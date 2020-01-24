import { Component, Input, Output, EventEmitter } from "@angular/core";
import * as _ from "lodash";
import * as dateFns from "date-fns";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { HttpService } from "hordeflow-common";
import { SmartAuthService } from "src/app/authentication/services/smart-auth.service";
import { PageFormService } from "src/app/shared/services/page-form.service";

@Component({
	selector: "hrf-emp-timesheet",
	templateUrl: "employee-timesheet.component.html",
	styleUrls: ["employee-timesheet.component.scss"]
})
export class EmployeeTimesheetComponent {
	_employee: any;
	@Input() set employee(employee) {
		this._employee = employee;
		if (!_.isEmpty(this._employee)) {
			this.fetchWorkShiftTemplates();
		}
	}

	get employee() {
		return this._employee;
	}

	@Output("workshiftfetched") onWorkShiftFetched: EventEmitter<any> = new EventEmitter();

	workShiftForm: FormGroup;
	isFormEditing: boolean;

	shiftTemplates = [];
	currentShift = {
		monday: null,
		tuesday: null,
		wednesday: null,
		thursday: null,
		friday: null,
		saturday: null,
		sunday: null
	};

	constructor(
		private fb: FormBuilder,
		private service: HttpService,
		private auth: SmartAuthService,
		private formService: PageFormService<any>
	) {
		this.workShiftForm = fb.group(this.getWorkShiftFormControls());
	}

	getWorkShiftFormControls() {
		return {
			mondayShift: [null, Validators.required],
			tuesdayShift: [null, Validators.required],
			wednesdayShift: [null, Validators.required],
			thursdayShift: [null, Validators.required],
			fridayShift: [null, Validators.required],
			saturdayShift: [null, Validators.required],
			sundayShift: [null, Validators.required]
		};
	}

	fetchWorkShiftTemplates() {
		this.service.list("api/v1/time-management/workshift").subscribe(shifts => {
			this.shiftTemplates = shifts;
			this.syncWorkShifts();
		});
	}

	syncWorkShifts() {
		this.service
			.list(`api/v1/time-management/employee/${this.employee.id}/employeeworkshift`)
			.subscribe(ws => {
				const days = [
					"Monday",
					"Tuesday",
					"Wednesday",
					"Thursday",
					"Friday",
					"Saturday",
					"Sunday"
				];

				const mondayShift = _.find(ws, { dayType: days[0] });
				const tuesdayShift = _.find(ws, { dayType: days[1] });
				const wednesdayShift = _.find(ws, { dayType: days[2] });
				const thursdayShift = _.find(ws, { dayType: days[3] });
				const fridayShift = _.find(ws, { dayType: days[4] });
				const saturdayShift = _.find(ws, { dayType: days[5] });
				const sundayShift = _.find(ws, { dayType: days[6] });

				this.workShiftForm.setValue({
					mondayShift: _.get(mondayShift, "workShiftId", null),
					tuesdayShift: _.get(tuesdayShift, "workShiftId", null),
					wednesdayShift: _.get(wednesdayShift, "workShiftId", null),
					thursdayShift: _.get(thursdayShift, "workShiftId", null),
					fridayShift: _.get(fridayShift, "workShiftId", null),
					saturdayShift: _.get(saturdayShift, "workShiftId", null),
					sundayShift: _.get(sundayShift, "workShiftId", null)
				});
				this.workShiftForm.markAsPristine();

				const today = new Date().getDay();
				const shift = _.find(ws, { dayType: days[today - 1] });
				if (shift) {
					const template = _.find(this.shiftTemplates, {
						id: _.get(shift, "workShiftId")
					});
					this.onWorkShiftFetched.emit(template);
				}
			});
	}

	private nullString(o) {
		return o === "null" ? null : o;
	}

	applyWorkShift(e) {
		const shifts = {
			employeeId: this.employee.id,
			mondayShiftId: this.nullString(this.workShiftForm.value.mondayShift),
			tuesdayShiftId: this.nullString(this.workShiftForm.value.tuesdayShift),
			wednesdayShiftId: this.nullString(this.workShiftForm.value.wednesdayShift),
			thursdayShiftId: this.nullString(this.workShiftForm.value.thursdayShift),
			fridayShiftId: this.nullString(this.workShiftForm.value.fridayShift),
			saturdayShiftId: this.nullString(this.workShiftForm.value.saturdayShift),
			sundayShiftId: this.nullString(this.workShiftForm.value.sundayShift)
		};
		this.service
			.process(
				`api/v1/time-management/employee/${
					this.employee.id
				}/employeeworkshift/syncweekworkshifts`,
				shifts
			)
			.subscribe(result => {
				this.workShiftForm.markAsPristine();
			});
	}
}
