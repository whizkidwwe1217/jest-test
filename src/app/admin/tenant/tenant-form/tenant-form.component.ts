import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { switchMap } from "rxjs/operators";
import { TenantService } from "../tenant.service";
import { Store } from "@ngrx/store";
import { Tenant, HttpService, AppInfo } from "hordeflow-common";
import { HfBreadcrumbService } from "hordeflowkit";
import { AppState } from "src/app/data/app-state";
import { TenantStoreActions } from "..";

@Component({
	selector: "app-tenant-form",
	templateUrl: "./tenant-form.component.html",
	styleUrls: ["./tenant-form.component.scss"]
})
export class TenantFormComponent implements OnInit {
	tenantForm: FormGroup;
	tenant: Tenant;
	title: string;
	themes = [
		{
			name: "Default",
			theme: "clarity light"
		},
		{
			name: "Default Dark",
			theme: "clarity dark"
		},
		{
			name: "Evergreen",
			theme: "evergreen"
		},
		{
			name: "Nutanix",
			theme: "nutanix"
		}
	];

	databaseProviders = [
		{
			name: "SqlServer",
			description: "Microsoft Sql Server",
			template: "Server=HOST_NAME;Initial Catalog=DATABASE_NAME;UID=USER_NAME;Pwd=PASSWORD;"
		},
		{
			name: "MySql",
			description: "MySql",
			template: "Host=localhost;Port=3306;Database=mysql-db;UID=sa;PWD=masterkey;"
		},
		{
			name: "PostgreSql",
			description: "Postgre SQL",
			template:
				"Host=HOST_NAME;Database=DATABASE_NAME;Username=USER_NAME;Password=PASSWORD;Port=5432;"
		},
		{
			name: "Sqlite",
			description: "Sqlite",
			template: "Data Source=DATABASE_FILENAME;"
		}
	];

	constructor(
		private route: ActivatedRoute,
		private fb: FormBuilder,
		private http: HttpService,
		private service: TenantService,
		private store: Store<AppState>,
		private breadcrumbService: HfBreadcrumbService
	) {}

	ngOnInit() {
		this.title = "Register New Tenant";
		this.tenantForm = this.fb.group({
			id: [null],
			name: ["", Validators.required],
			hostName: ["", Validators.required],
			description: "",
			databaseProvider: [null, Validators.required],
			isDedicated: false,
			isTenantAdministrator: false,
			connectionString: ["", Validators.required],
			theme: ["default light"]
		});

		this.route.paramMap
			.pipe(
				switchMap((params: ParamMap) => {
					if (params.get("id")) return this.service.getTenant(params.get("id"));
					return null;
				})
			)
			.subscribe(
				t => {
					this.tenant = t;
					this.tenantForm.patchValue(t);
					this.title = `Update ${this.tenant.name}`;
					const breadcrumbs = [
						{ label: "Tenants", url: "../../" },
						{
							label: `${this.tenant.id}`,
							url: `${this.tenant.id}`
						},
						{ label: `Update ${this.tenant.name}` }
					];
					this.breadcrumbService.updateBreadcrumb(breadcrumbs);
				},
				error => {}
			);
	}

	onSelect(databaseProvider) {
		if (databaseProvider && !this.tenant)
			this.tenantForm.patchValue({
				connectionString: databaseProvider.template
			});
	}

	save() {
		if (this.tenantForm.valid) {
			if (!this.tenant) {
				const tenant = this.tenantForm.value;
				delete tenant.id;
				this.store.dispatch(new TenantStoreActions.AddRequestAction({ tenant }));
			} else {
				const t = Object.assign(this.tenant, this.tenantForm.value as Tenant);
				this.store.dispatch(new TenantStoreActions.EditRequestAction({ tenant: t }));
			}
		}
	}
}
