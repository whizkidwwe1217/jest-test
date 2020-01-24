import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from "@angular/core";

import * as _ from "lodash";
import * as dateFns from "date-fns";

import { HttpService } from "hordeflow-common";
import { NumberCardComponent } from "@swimlane/ngx-charts";
import { HttpHeaders } from "@angular/common/http";

const monthName = new Intl.DateTimeFormat("en-us", { month: "short" });
const weekdayName = new Intl.DateTimeFormat("en-us", { weekday: "short" });

@Component({
	selector: "app-dashboard",
	templateUrl: "./dashboard.component.html",
	styleUrls: ["./dashboard.component.scss"],
	host: {
		id: "main-container",
		"[class.content-container]": "true"
	}
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {
	migrations: any[] = [];
	migrationChartData: any[] = [];
	max: number;

	// heatmap
	heatmapMin: number = 0;
	heatmapMax: number = 50000;
	heatmapEntries: any[] = [];

	@ViewChild(NumberCardComponent, { static: true })
	numberCard: NumberCardComponent;

	tenantsByEngine: any[] = [];

	constructor(private http: HttpService) {}

	loadTenants() {
		this.http.search("api/v1/admin/catalog", { pageSize: 50, currentPage: 1 }).subscribe(t => {
			this.tenantsByEngine = [
				{
					name: "SQL Server",
					value: _.filter(t.data, {
						engine: "SqlServer"
					}).length
				},
				{
					name: "MySQL",
					value: _.filter(t.data, {
						engine: "MySql"
					}).length
				},
				{
					name: "PostgreSql",
					value: _.filter(t.data, {
						engine: "PostgreSql"
					}).length
				}
			];
		});
	}

	activate(data) {
		console.log(data);
	}

	loadMigrations() {
		this.http.list<any>("api/v1/admin/catalog/getmigrations").subscribe(migrations => {
			this.migrations = migrations;
			this.max = migrations.length;
			const applied = _.filter(migrations, m => m.applied);
			const notApplied = _.filter(migrations, m => !m.applied);
			this.migrationChartData = [];
			this.migrationChartData.push({
				name: "Applied",
				value: applied.length
			});
			this.migrationChartData.push({
				name: "Not Applied",
				value: notApplied.length
			});

			this.loadHeatmap();
		});
	}

	calendarAxisTickFormatting(mondayString: string) {
		const monday = new Date(mondayString);
		const month = monday.getMonth();
		const day = monday.getDate();
		const year = monday.getFullYear();
		const lastSunday = new Date(year, month, day - 1);
		const nextSunday = new Date(year, month, day + 6);
		return lastSunday.getMonth() !== nextSunday.getMonth() ? monthName.format(nextSunday) : "";
	}

	calendarTooltipText(c): string {
		return `
		  <span class="tooltip-label">${c.label} • ${c.cell.date.toLocaleDateString()}</span>
		  <span class="tooltip-val">${c.data.toLocaleString()}</span>
		`;
	}

	loadHeatmap() {
		// const heatmapData = _.map(this.migrations, (m) => {
		// 	const migrationDate = this.parseMigrationDate(m.id);
		// 	return {
		// 		name: m.id,
		// 		value:  Math.floor(10000 + Math.random() * 50000)
		// 	}
		// });
		// today
		const now = new Date();
		const todaysDay = now.getDate();
		const thisDay = new Date(now.getFullYear(), now.getMonth(), todaysDay);

		// Monday
		const thisMonday = new Date(
			thisDay.getFullYear(),
			thisDay.getMonth(),
			todaysDay - thisDay.getDay() + 1
		);
		const thisMondayDay = thisMonday.getDate();
		const thisMondayYear = thisMonday.getFullYear();
		const thisMondayMonth = thisMonday.getMonth();

		// 52 weeks before monday
		const calendarData = [];
		const getDate = d => new Date(thisMondayYear, thisMondayMonth, d);
		for (let week = -52; week <= 0; week++) {
			const mondayDay = thisMondayDay + week * 7;
			const monday = getDate(mondayDay);

			// one week
			const series = [];
			for (let dayOfWeek = 7; dayOfWeek > 0; dayOfWeek--) {
				const date = getDate(mondayDay - 1 + dayOfWeek);

				// skip future dates
				if (date > now) {
					continue;
				}

				// value
				const value = dayOfWeek < 6 ? date.getMonth() + 1 : 0;

				series.push({
					date,
					name: weekdayName.format(date),
					value
				});
			}

			calendarData.push({
				name: monday.toString(),
				series
			});
		}
		this.heatmapMax = 14;
		this.heatmapEntries = calendarData;
	}

	parseMigrationDate(id: string) {
		const dateString = id.slice(0, id.indexOf("_"));
		const year = dateString.slice(0, 4);
		const month = dateString.slice(4, 6);
		const day = dateString.slice(6, 8);
		const hour = dateString.slice(8, 10);
		const minute = dateString.slice(10, 12);
		const second = dateString.slice(12, 14);
		const parsedDate = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
		return dateFns.format(dateFns.parseISO(parsedDate), "MM/dd/yyyy hh:mm:ss a");
	}

	applyMigrations() {
		const headers = new HttpHeaders({
			"Content-Type": "application/x-www-form-urlencoded"
		});
		return this.http
			.process("api/v1/admin/catalog/migrate", { id: 1 }, null, headers)
			.subscribe(x => {
				this.loadMigrations();
			});
	}

	ngOnInit() {
		this.loadMigrations();
		this.loadTenants();
	}

	ngAfterViewInit() {}

	ngOnDestroy(): void {}
}
