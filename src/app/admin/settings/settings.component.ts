import { Component, OnInit, ViewChild } from "@angular/core";
import { HttpHeaders } from "@angular/common/http";
import { tap, delay } from "rxjs/operators";
import { forkJoin } from "rxjs";
import * as _ from "lodash";
import { ServerConfiguration, HttpService } from "hordeflow-common";
import { BrowserUtils } from "./browser.utils";
import { SettingsService } from "./settings.service";
import { NgProgressComponent } from "ngx-progressbar";

@Component({
	selector: "app-settings",
	templateUrl: "./settings.component.html",
	styleUrls: ["./settings.component.scss"],
	host: {
		id: "content-area",
		"[class.content-area]": "true"
	}
})
export class SettingsComponent implements OnInit {
	configuration: ServerConfiguration;
	assemblies: any[] = [];
	entityConfigurations: any[] = [];
	properties: string[] = [];
	@ViewChild(NgProgressComponent, { static: true })
	progressBar: NgProgressComponent;
	msg: string;
	error: boolean;
	script: string;
	migrations: any[] = [];

	constructor(private http: HttpService, private service: SettingsService) {
		service.assembliesFetch.subscribe(data => {
			this.configuration = data.config;
			this.properties = data.properties;
			this.assemblies = data.assemblies;
		});

		service.configurationsFetch.subscribe(data => {
			this.configuration = data.config;
			this.properties = data.properties;
			this.entityConfigurations = data.entityConfigurations;
		});
	}

	// getBrowserInfo() {
	// 	return BrowserUtils.detect();
	// }

	ngOnInit() {
		this.loadMigrations();
		this.service.loadConfigurationsAndAssemblies();
	}

	getPropertyValue(assembly, key): string {
		return assembly.fileVersionInfo[key];
	}

	loadMigrations() {
		this.http.list<any>("api/v1/admin/catalog/getmigrations").subscribe(migrations => {
			this.migrations = migrations;
		});
	}

	ping() {
		this.msg = "";
		this.error = false;
		this.http.getValue<string>("api/v1/admin/catalog/ping").subscribe(
			x => {
				this.msg = "Ping successful.";
			},
			res => {
				this.error = true;
				this.msg = `Can't ping. ${res.error.details}. ${res.error.message}`;
			}
		);
	}

	generateScript() {
		this.msg = "";
		this.error = false;
		this.http
			.getValue<string>("api/v1/admin/catalog/generatescript")
			.pipe(
				tap(() => this.progressBar.start()),
				delay(10)
			)
			.subscribe(
				script => {
					this.script = script;
					this.msg = "Script generated.";
				},
				res => {
					this.error = true;
					this.msg = `Can't generate migration script. ${res.error.details}. ${res.error.message}`;
				},
				() => this.progressBar.complete()
			);
	}

	deploy() {
		this.msg = "";
		this.error = false;
		const headers = new HttpHeaders({
			"Content-Type": "application/x-www-form-urlencoded"
		});
		return this.http
			.process("api/v1/admin/catalog/migrate", { id: 1 }, null, headers)
			.subscribe(
				x => {
					this.msg = "Deployment successful";
					this.loadMigrations();
				},
				res => {
					this.error = true;
					this.msg = `Error deploying server database. ${res.error.details}. ${res.error.message}`;
				}
			);
	}

	drop() {
		this.msg = "";
		this.error = false;
		const headers = new HttpHeaders({
			"Content-Type": "application/x-www-form-urlencoded"
		});
		return this.http.process("api/v1/admin/catalog/drop", headers).subscribe(
			x => {
				this.msg = "Drop successful";
				this.loadMigrations();
			},
			res => {
				this.error = true;
				this.msg = `Error dropping server database. ${res.error.details}. ${res.error.message}`;
			}
		);
	}
}
