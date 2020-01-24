import { Component, OnInit, AfterViewInit } from "@angular/core";
import { TenantService } from "./tenant.service";
import { ActivatedRoute, Router } from "@angular/router";
import { routerTransition } from "./animations";
import * as _ from "lodash";
import { Store } from "@ngrx/store";
import { PageService } from "../../workspace/home/services/page.service";
import { Tenant } from "hordeflow-common";
import { TenantStoreState, TenantStoreSelectors, TenantStoreActions } from ".";

@Component({
	selector: "app-tenant",
	templateUrl: "./tenant.component.html",
	styleUrls: ["./tenant.component.scss"],
	host: {
		id: "main-container",
		"[class.content-container]": "true"
	},
	providers: [TenantService],
	animations: [routerTransition]
})
export class TenantComponent implements OnInit, AfterViewInit {
	tenants: Tenant[] = [];
	hasLoaded: boolean;
	collapsed: false;

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private store$: Store<TenantStoreState.TenantState>,
		private pageService: PageService
	) {}

	ngAfterViewInit() {}
	ngOnInit() {
		this.store$.select(TenantStoreSelectors.selectAllTenants).subscribe(tenants => {
			this.tenants = tenants;
			let tenant = _.first(this.tenants);
			let url: string = this.route.snapshot.queryParams["returnUrl"];
			if (tenant && !url) {
				this.router.navigate([tenant.id], {
					relativeTo: this.route
				});
			}
			this.hasLoaded = true;
		});
		this.store$.dispatch(
			new TenantStoreActions.LoadRequestAction({
				url: "api/v1/admin/catalog",
				refresh: !this.hasLoaded
			})
		);
		// this.store$
		//     .select(TenantStoreSelectors.selectTenantError)
		//     .subscribe(x => {
		//         if(x) this.router.navigate(['tenant'])
		//     });
	}

	refresh() {
		this.store$.dispatch(
			new TenantStoreActions.LoadRequestAction({
				url: "api/v1/admin/catalog",
				refresh: true
			})
		);
	}

	getState(outlet) {
		return outlet.isActivated || "";
	}
}
