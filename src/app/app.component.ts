import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { SET_INFO, SetInfo } from "./data/actions/app-info.action";
import * as _ from "lodash";
import { AppInfo, HttpService, URL_APP_INFO } from "hordeflow-common";
import {
	Router,
	RouterEvent,
	RouteConfigLoadStart,
	RouteConfigLoadEnd,
	NavigationStart,
	NavigationEnd,
	NavigationError,
	NavigationCancel
} from "@angular/router";
import { AppState } from "./data/app-state";

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
	title = "HordeFlow";
	info: AppInfo;
	autoFetchAppInfo: boolean = true;
	public isShowingRouteLoadIndicator: boolean;
	lazyLoadedModuleName: string = "page";

	constructor(private http: HttpService, private router: Router, private store: Store<AppState>) {
		this.isShowingRouteLoadIndicator = false;

		// *************************************************************************** //
		// CAUTION: Even though we are preloading our lazy-loading modules with the
		// "PreloadAllModules" configuration, the following Router events still fire
		// when the RouterPreloader's requests for the remote code are initiated and
		// completed, respectively. As such, this code is still relevant. And, on a
		// slower connection, may still show the loading indicator shortly after the
		// application has been bootstrapped (depending on what the initial URL of
		// the application is).
		// *************************************************************************** //

		// As the router loads modules asynchronously (via loadChildren), we're going to
		// keep track of how many asynchronous requests are currently active. If there is
		// at least one pending load request, we'll show the indicator.
		let asyncLoadCount = 0;

		// As the user navigates around the application, we're going to keep track of how
		// many pending navigation requests are currently active. This way, we can know
		// if the asynchronous module loading is [possibly] happening because of a user
		// navigation; or, if it's happening as part of the pre-loading.
		let navigationCount = 0;

		// The Router emits special events for "loadChildren" configuration loading. We
		// just need to listen for the Start and End events, amidst the rest of the
		// events, in order to determine if we have any pending configuration requests.
		router.events.subscribe((event: RouterEvent): void => {
			if (event instanceof RouteConfigLoadStart) {
				if (event.route.data && event.route.data.lazyLoadedModuleName) {
					this.lazyLoadedModuleName = `${event.route.data.lazyLoadedModuleName} module`;
				} else {
					this.lazyLoadedModuleName = "page";
				}
				asyncLoadCount++;
			} else if (event instanceof RouteConfigLoadEnd) {
				asyncLoadCount--;
			} else if (event instanceof NavigationStart) {
				navigationCount++;
			} else if (
				event instanceof NavigationEnd ||
				event instanceof NavigationError ||
				event instanceof NavigationCancel
			) {
				navigationCount--;
			}

			// If there is at least one pending asynchronous config load request AND
			// it is taking place while a the user is actively navigating around the
			// application, then let's show the loading indicator. This way, we don't
			// show the loading indicator during the preloading of lazy modules. This
			// isn't an exact science, since the navigation may not be tied to the
			// config load request. But, the small delay in rendering the indicator
			// should make the fuzzy-association a non-issue (as unrelated navigation
			// events will start and end almost instantly).
			// --
			// CAUTION: I'm using CSS to include a small delay such that this loading
			// indicator won't be seen by people with sufficiently fast connections.
			this.isShowingRouteLoadIndicator = !!(navigationCount && asyncLoadCount);
		});
	}

	ngOnInit(): void {
		if (this.autoFetchAppInfo) {
			this.fetchAppInfo().subscribe(info => {
				this.info = info;
				this.store.dispatch(SetInfo(info));
			});
		}
	}

	fetchAppInfo() {
		return this.http.getValue<AppInfo>(URL_APP_INFO);
	}
}
