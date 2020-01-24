import { Component, Input, ChangeDetectionStrategy } from "@angular/core";
import * as _ from "lodash";
import { HttpService } from "hordeflow-common";
import { HttpClient } from "@angular/common/http";

@Component({
	selector: "hrf-emp-job-details",
	templateUrl: "employee-job-details.component.html",
	styleUrls: ["employee-job-details.component.scss"]
})
export class EmployeeJobDetailsComponent {
	_employee: any;
	accJobDetailsExpanded: boolean = true;
	accSkillsExpanded: boolean = false;
	accJobHistoryExpanded: boolean = false;

	constructor(private http: HttpClient) {}

	@Input() set employee(employee) {
		this._employee = employee;
	}

	get employee() {
		return this._employee;
	}

	newSkill(e) {
		this.http.get("https://localhost:9001/api/v1/app/info").subscribe(x => console.log(x));
	}
}
