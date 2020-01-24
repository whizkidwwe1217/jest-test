import { Injectable } from "@angular/core";
import { forkJoin, Observable, Subject } from "rxjs";
import { ServerConfiguration, HttpService } from "hordeflow-common";
import * as _ from "lodash";

@Injectable({ providedIn: "root" })
export class SettingsService {
	public configuration: ServerConfiguration;
	public assemblies: any[] = [];
	public entityConfigurations: any[] = [];
	public properties: string[] = [];
	public assembliesFetch: Subject<{
		config: ServerConfiguration;
		assemblies: any[];
		properties: string[];
	}> = new Subject<{
		config: ServerConfiguration;
		assemblies: any[];
		properties: string[];
	}>();
	public configurationsFetch: Subject<{
		config: ServerConfiguration;
		entityConfigurations: any[];
		properties: string[];
	}> = new Subject<{
		config: ServerConfiguration;
		entityConfigurations: any[];
		properties: string[];
	}>();

	constructor(private http: HttpService) {}

	loadConfigurationsAndAssemblies() {
		const configuration = this.http.getValue<ServerConfiguration>(
			"api/v1/admin/catalog/getconfiguration"
		);

		if (this.assemblies.length === 0) {
			const assemblies = this.http.getValue<any[]>("api/v1/app/assembly");
			forkJoin([configuration, assemblies]).subscribe(results => {
				this.configuration = results[0];
				this.assemblies = results[1];

				const config = _.first(this.assemblies);
				if (config) {
					_.forOwn(config.fileVersionInfo, (value, key) => {
						this.properties.push(key);
					});
				}
				this.assembliesFetch.next({
					config: this.configuration,
					assemblies: this.assemblies,
					properties: this.properties
				});
			});
		} else {
			this.assembliesFetch.next({
				config: this.configuration,
				assemblies: this.assemblies,
				properties: this.properties
			});
		}

		if (this.entityConfigurations.length === 0) {
			const entityConfigurations = this.http.getValue<any[]>("api/v1/app/assembly/entities");
			forkJoin([configuration, entityConfigurations]).subscribe(results => {
				this.configuration = results[0];
				this.entityConfigurations = results[1];

				const config = _.first(this.entityConfigurations);
				if (config) {
					_.forOwn(config.fileVersionInfo, (value, key) => {
						this.properties.push(key);
					});
				}

				this.configurationsFetch.next({
					config: this.configuration,
					entityConfigurations: this.entityConfigurations,
					properties: this.properties
				});
			});
		} else {
			this.configurationsFetch.next({
				config: this.configuration,
				entityConfigurations: this.entityConfigurations,
				properties: this.properties
			});
		}
	}
}
