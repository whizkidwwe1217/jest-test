/**
 * https://msdn.microsoft.com/en-us/magazine/mt846469.aspx
 */
import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { switchMap, tap } from "rxjs/operators";
import { TenantService } from "../tenant.service";
import { HubConnection, HubConnectionBuilder, LogLevel } from "@aspnet/signalr";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { Tenant, CatalogAuthService, HttpService, AppInfo } from "hordeflow-common";
import { HfBreadcrumbService } from "hordeflowkit";
import { TenantStoreActions } from "..";

@Component({
	selector: "app-tenant-detail",
	templateUrl: "./tenant-detail.component.html",
	styleUrls: ["./tenant-detail.component.scss"]
})
export class TenantDetailComponent implements OnInit, OnDestroy {
	loading: boolean;
	id: any;
	tenant: Tenant;
	connection: HubConnection;
	errorMsg: string;
	isDeploying: boolean = false;
	spinner = "hf-three-bounce";
	spinners = [
		{ name: "hf-chasing-dots", description: "Chasing Dots" },
		{ name: "hf-cube-grid", description: "Cube Grid" },
		{ name: "hf-double-bounce", description: "Double Bounce" },
		{ name: "hf-rotating-plane", description: "Rotating Plane" },
		{ name: "hf-spinner-pulse", description: "Spinner Pulse" },
		{ name: "hf-three-bounce", description: "Three Bounce" },
		{ name: "hf-wandering-cubes", description: "Wandering Cubes" },
		{ name: "hf-wave", description: "Wave" },
		{ name: "hf-ripple", description: "Ripple" },
		{ name: "hf-roller", description: "Roller" },
		{ name: "hf-circle", description: "Circle" },
		{ name: "hf-spin-box", description: "Spin Box" }
	];

	items: any[] = [];
	plain: string[];
	vegetable: any;
	confection: any;
	engines: any[];
	engine: any;
	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private service: TenantService,
		private authService: CatalogAuthService,
		private http: HttpService,
		private store: Store<{ appInfo: AppInfo }>,
		private breadcrumbService: HfBreadcrumbService
	) {
		this.items = [
			{
				id: 1,
				text: "Milk",
				avatar: "https://cdn1.iconfinder.com/data/icons/food-drinks-2/512/milk-512.png",
				description:
					"A white nutritious liquid secreted by mammals and used as food by human beings"
			},
			{
				id: 2,
				text: "Chocolate",
				avatar:
					"https://www.google.com.ph/imgres?imgurl=https%3A%2F%2Fimage.flaticon.com%2Ficons%2Fsvg%2F201%2F201714.svg&imgrefurl=https%3A%2F%2Fwww.flaticon.com%2Ffree-icon%2Fchocolate_201714&docid=KdXC4Ec6BH-pcM&tbnid=l3323wMuIB5DkM%3A&vet=10ahUKEwia6ezIgvTcAhWOfSsKHZWoDaMQMwhtKAAwAA..i&w=800&h=800&bih=738&biw=1536&q=chocolate%20icon&ved=0ahUKEwia6ezIgvTcAhWOfSsKHZWoDaMQMwhtKAAwAA&iact=mrc&uact=8",
				description:
					"A food made from roasted ground cacao beans, usually sweetened and eaten as dark brown solid confectionary"
			},
			{
				id: 3,
				text: "Peanut butter",
				avatar:
					"https://cdn4.iconfinder.com/data/icons/food-and-sweets/512/Food_Sweets_peanut_butter-512.png",
				description: "A spread made from ground peanuts"
			},
			{
				id: 4,
				text: "Honey",
				avatar:
					"https://www.google.com.ph/url?sa=i&source=images&cd=&cad=rja&uact=8&ved=2ahUKEwiryd_WgvTcAhWDf30KHZJACZMQjRx6BAgBEAU&url=https%3A%2F%2Fwww.flaticon.com%2Ffree-icon%2Fhoney_168549&psig=AOvVaw3L6-o7JwWDhQv2u_dv2fEO&ust=1534593029293731",
				description: "A sweet yellow liquid produced by bees"
			},
			{
				id: 5,
				text: "Butter",
				avatar: "",
				description:
					"An edible emulsion of fat globules made by churning milk or cream; for cooking and table use"
			},
			{
				id: 6,
				text: "Coffee",
				avatar: "favicon.ico",
				description: "A beverage consisting of an infusion of ground coffee beans"
			},
			{
				id: 8,
				text: "Jelly",
				avatar: "assets/logo-dark.svg",
				description: "Fruit-flavored dessert made from liquid set with gelatin"
			},
			{
				id: 8,
				text: "Cranberry",
				avatar: "assets/graphics/logos/mssql.svg",
				description: "Any of numerous shrubs of genus Vaccinium bearing cranberries"
			}
		];

		this.plain = [
			"Pepper",
			"Tomatoes",
			"Lettuce",
			"Eggplant",
			"Ginger",
			"Garlic",
			"Onions",
			"Cabbage",
			"Parsley",
			"Bitter Gourd"
		];

		this.engines = [
			{
				id: 1,
				text: "Sql Server",
				avatar: "assets/graphics/logos/mssql.svg"
			},
			{
				id: 2,
				text: "MySql Server",
				avatar: "assets/graphics/logos/mysql.svg"
			},
			{
				id: 3,
				text: "PostgreSql",
				avatar: "assets/graphics/logos/postgresql.svg"
			},
			{
				id: 4,
				text: "Sqlite",
				avatar: "assets/graphics/logos/sqlite.svg"
			}
		];

		this.$j = this.http.list("api/v1/admin/catalog");
	}

	$j: Observable<any>;

	ngOnInit() {
		this.route.paramMap
			.pipe(
				tap(() => {
					this.loading = true;
				}),
				switchMap((params: ParamMap) => this.service.getTenant(params.get("id")))
			)
			.subscribe(
				t => {
					this.tenant = t;
					this.breadcrumbService.updateBreadcrumb([]);
					this.isDeploying =
						this.tenant &&
						this.tenant.deploymentStatus &&
						(this.tenant.deploymentStatus.indexOf("In Progress") !== -1 ||
							this.tenant.deploymentStatus.indexOf("Dropping") !== -1);
					this.errorMsg = null;
					//this.initializeHub();
				},
				error => {
					this.tenant = null;
					this.isDeploying = false;
					this.errorMsg = error.error || error.statusText;
					if (error.status === 404) {
						this.router.navigate(["../new"], {
							relativeTo: this.route
						});
					}
				},
				() => {
					this.loading = false;
				}
			);
	}

	deploy() {
		if (this.tenant) {
			this.service.deployTenant(this.tenant).subscribe(
				() => {},
				response => {
					this.errorMsg = response.error.details;
				}
			);
		}
	}

	dropDatabase() {
		if (this.tenant) {
			this.service.dropTenantDatabase(this.tenant).subscribe(() => {});
		}
	}

	deleteTenant() {
		if (this.tenant) {
			// this.service.deleteTenant(this.tenant).subscribe(x => {});
			this.store.dispatch(
				new TenantStoreActions.DeleteRequestAction({
					tenant: this.tenant
				})
			);
		}
	}

	initializeHub() {
		const accessToken = this.authService.getAuthorizationToken().accessToken;

		this.connection = new HubConnectionBuilder()
			.withUrl(`/api/v1/hubs/dbmigrationhub?access_token=${accessToken}`)
			.configureLogging(LogLevel.None)
			.build();

		this.connection.on(
			"OnDeploymentStatus",
			(status: string, tenant: Tenant, error: string) => {
				if (tenant.id === this.tenant.id) {
					this.tenant.deploymentStatus = status;
					this.errorMsg = error;
					this.isDeploying =
						status.indexOf("In Progress") !== -1 || status.indexOf("Dropping") !== -1;
				} else {
					this.isDeploying =
						this.tenant.deploymentStatus.indexOf("In Progress") !== -1 ||
						this.tenant.deploymentStatus.indexOf("Dropping") !== -1;
					this.errorMsg = null;
				}
			}
		);

		this.connection.start().catch(err => console.error(err.toString()));
	}

	ngOnDestroy(): void {
		if (this.connection) this.connection.stop().catch(err => console.error(err.toString()));
	}
}
