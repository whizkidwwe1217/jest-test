import { Component, ViewChild, ChangeDetectionStrategy, OnInit, TemplateRef } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
	HttpService,
	DataSource,
	DataWebApiDataSource,
	DataField,
	UriResource
} from "hordeflow-common";
import * as dateFns from "date-fns";
import { of } from "rxjs";
import * as _ from "lodash";
import { PersonPipe } from "src/app/shared/pipes/person.pipe";
import { DatagridViewPage } from "hordeflowkit";

@Component({
	selector: "hrf-timesheet-details",
	templateUrl: "timesheet-details.component.html",
	styleUrls: ["timesheet-details.component.scss"],
	providers: [
		{
			provide: DataSource,
			useClass: DataWebApiDataSource,
			deps: [HttpService]
		}
	],
	changeDetection: ChangeDetectionStrategy.Default
})
export class TimesheetDetailsComponent implements OnInit {
	timesheetId: number;
	timesheet: any;
	selectedEmployees: any[];
	details: any[] = [];
	onEmployeeSelectorOpen: boolean;
	@ViewChild("grid", { static: false }) gridView: DatagridViewPage<any>;
	@ViewChild("checkTimeTemplate", { static: true }) checkTimeTemplate: TemplateRef<any>;
	@ViewChild("anchorPerson", { static: true }) anchorPerson: TemplateRef<any>;

	commands = [
		{
			name: "btnGenerate",
			text: "Generate",
			click: e => this.generate()
		}
	];

	fields: DataField<any>[] = [
		{ name: "id", text: "Id", enableSearch: false, hidden: true },
		{
			name: "employee",
			text: "Employee",
			render: (field, record, value) =>
				new PersonPipe().transform({
					firstName: record.firstName,
					lastName: record.lastName
				})
		},
		{ name: "lastName", text: "Last Name", enableSearch: true, hidden: true },
		{ name: "firstName", text: "First Name", enableSearch: true, hidden: true }
	];

	timesheetDetailFields: DataField<any>[] = [
		{ name: "id", text: "Id", enableSearch: false, hidden: true },
		{
			name: "employee",
			text: "Employee",
			enableSearch: false
		},
		{
			name: "workShift",
			text: "Shift",
			enableSearch: false,
			render: (field, record, value) => {
				return `<span style="font-style: italic;">${this.getFormattedTime(
					record.workShift.startTime
				)}-${this.getFormattedTime(record.workShift.endTime)}</span>`;
			}
		},
		{
			name: "employee.lastName",
			text: "Last Name",
			enableSearch: true,
			hidden: true
		},
		{
			name: "employee.firstName",
			text: "First Name",
			enableSearch: true,
			hidden: true
		},
		{
			name: "employee.middleName",
			text: "Middle Name",
			enableSearch: true,
			hidden: true
		},
		{
			name: "date",
			text: "Date",
			enableSearch: true,
			render: (field, record, value) =>
				dateFns.format(dateFns.parseISO(record.date), "MM/dd/yyyy")
		},
		{
			name: "day",
			text: "Day",
			enableSearch: false,
			render: (field, record, value) => dateFns.format(dateFns.parseISO(record.date), "eee")
		},
		{
			name: "checkIn",
			text: "Check In",
			enableSearch: true
		},
		{
			name: "checkOut",
			text: "Check Out",
			enableSearch: true
		},
		{
			name: "totalHours",
			text: "Total Hours"
		},
		{
			name: "creditedHours",
			text: "Credited Hours",
			render: (field, record, value) => {
				if (value > 0) return `<b>${value}</b>`;
				return _.isEmpty(value) ? 0 : value;
			}
		},
		{ name: "basicHours", text: "Basic" },
		{
			name: "tardyHours",
			text: "Tardy",
			render: (field, record, value) => {
				if (value > 0) return `<b style="color:red">${value}</b>`;
				return _.isEmpty(value) ? 0 : value;
			}
		},
		{ name: "totalOvertimeHours", text: "OT" },
		{
			name: "undertimeHours",
			text: "UT",
			render: (field, record, value) => {
				if (value > 0) return `<b style="color:red">${value}</b>`;
				return _.isEmpty(value) ? 0 : value;
			}
		},
		{ name: "nightDifferentialHours", text: "ND" },
		{ name: "employeeId", text: "Employee Id", hidden: true }
	];

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private http: HttpService,
		public dataSource: DataSource<any>
	) {
		route.paramMap.subscribe(_route => {
			this.timesheetId = +_route.get("id");
			const url = `api/v1/time-management/timesheet/${this.timesheetId}/detail`;
			// http.list(url).subscribe(details => {
			// 	this.onEmployeeSelectorOpen = details.length === 0;
			// 	this.details = details;
			// 	const resource: UriResource = new UriResource().setUrl(url, true);
			// 	(dataSource as DatagridHttpDataSource<any>).setResource(resource, null);
			// 	setTimeout(() => {
			// 		this.grid.grid.loadData();
			// 	}, 100);
			// });
			const resource: UriResource = new UriResource().setUrl(url, false);
			(dataSource as DataWebApiDataSource<any>).setResource(resource, null);
			// setTimeout(() => {
			// 	this.grid.grid.loadData();
			// }, 100);
		});
	}

	navigateToEmployee(data) {
		this.router.navigate(["./workspace/home/hr/employees", data.record.employeeId]);
	}

	getFormattedTime = value => dateFns.format(dateFns.parseISO(value), "h:mm a");

	generate() {
		if (this.timesheetId) {
			this.onEmployeeSelectorOpen = true;
		}
	}

	selectionChange(selected) {
		this.selectedEmployees = selected;
	}

	accept = () => {
		return of(this.selectedEmployees);
	};

	onAccepted(e) {
		const timesheetEmployeeIds = _.map(this.selectedEmployees, s => s.id);
		this.http
			.process(`api/v1/time-management/timesheet/${this.timesheetId}/generatetimesheet`, {
				timesheetId: this.timesheetId,
				employeeIds: timesheetEmployeeIds
			})
			.subscribe(details => {
				//this.details = [1];
				setTimeout(() => {
					this.gridView.grid.loadData();
				}, 100);
			});
	}

	private loadTimesheetInfo() {
		const resource = new UriResource().setUrl(`api/v1/time-management/timesheet`);
		const dataSource = new DataWebApiDataSource(this.http).setResource(resource);
		dataSource.read(this.timesheetId).subscribe(ts => {
			this.timesheet = ts;
		});
	}

	ngOnInit() {
		_.find(this.timesheetDetailFields, { name: "employee" }).template = this.anchorPerson;
		_.find(this.timesheetDetailFields, { name: "checkIn" }).template = this.checkTimeTemplate;
		_.find(this.timesheetDetailFields, { name: "checkOut" }).template = this.checkTimeTemplate;

		this.loadTimesheetInfo();
	}
}
