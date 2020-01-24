import {
	Component,
	OnInit,
	ViewChild,
	ElementRef,
	TemplateRef,
	AfterViewInit
} from "@angular/core";
import * as _ from "lodash";
import * as dateFns from "date-fns";
import { DataField } from "hordeflow-common";

@Component({
	selector: "hrf-timesheet",
	templateUrl: "timesheets.component.html",
	styleUrls: ["timesheets.component.scss"]
})
export class TimesheetsComponent implements AfterViewInit {
	@ViewChild("booleanTemplate", { static: true }) booleanTemplate: TemplateRef<any>;
	@ViewChild("anchorTemplate", { static: true }) anchorTemplate: TemplateRef<any>;

	fields: DataField<any>[] = [
		{ name: "id", text: "Id", enableSearch: false, hidden: true },
		{ name: "description", text: "Description", enableSearch: true },
		{
			name: "startDate",
			text: "Start Date",
			enableSearch: true,
			render: (field, record, value) => dateFns.format(dateFns.parseISO(value), "MM/dd/yyyy")
		},
		{
			name: "endDate",
			text: "End Date",
			enableSearch: true,
			render: (field, record, value) => dateFns.format(dateFns.parseISO(value), "MM/dd/yyyy")
		},
		{ name: "isLocked", text: "Locked?", enableSearch: true }
	];

	ngAfterViewInit() {
		this.fields[1].template = this.anchorTemplate;
		this.fields[4].template = this.booleanTemplate;
	}
}
