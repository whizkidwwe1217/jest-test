import { Component, OnInit, PLATFORM_ID, Inject, AfterViewInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { fromEvent, Observable } from "rxjs";

import { isPlatformBrowser, DOCUMENT } from "@angular/common";
import { SmartAuthService } from "../authentication/services/smart-auth.service";
import { PageService } from "./home/services/page.service";
import { Store, select } from "@ngrx/store";
import { AppInfo, Tenant } from "hordeflow-common";
import { environment } from "../../environments/environment";
import { AppState } from "../data/app-state";

@Component({
	selector: "app-workspace",
	templateUrl: "./workspace.component.html",
	styleUrls: ["./workspace.component.scss"],
	host: {
		id: "main-container",
		"[class.content-container]": "true"
	}
})
export class WorkspaceComponent implements OnInit {
	returnUrl: string;
	isOnline: boolean = true;
	hasNewUpdates: boolean = false;
	loggingOut: boolean = false;
	isProduction: boolean;
	username: string;
	appInfo$: Observable<AppInfo>;
	linkRef: HTMLLinkElement;
	themes = [
		{
			name: "Clarity Light",
			href: `assets/themes/clarity-light${environment.production ? ".min" : ""}.css`
		},
		{
			name: "Clarity Dark",
			href: `assets/themes/clarity-dark${environment.production ? ".min" : ""}.css`
		},
		{
			name: "Evergreen",
			href: `assets/themes/evergreen${environment.production ? ".min" : ""}.css`
		},
		{
			name: "Nutanix",
			href: `assets/themes/nutanix${environment.production ? ".min" : ""}.css`
		}
	];
	theme = this.themes[0];

	switchThemeMode() {
		this.switchTheme(this.theme.name === "default dark" ? 0 : 1);
	}

	switchTheme(themeIndex: number) {
		new Observable(observable => {
			this.theme = this.themes[themeIndex];
			localStorage.setItem("theme", JSON.stringify(this.theme));
			this.linkRef.href = this.theme.href;
			observable.next(this.theme);
			observable.complete();
		}).subscribe();
	}

	getThemeIconTitle(): string {
		return `Switch to ${this.theme.name === "dark" ? "Light" : "Dark"} theme.`;
	}

	checkNetworkConnection() {
		let offline = fromEvent(window, "offline");
		let online = fromEvent(window, "online");

		offline.subscribe(() => {
			this.isOnline = navigator.onLine;
		});

		online.subscribe(() => {
			this.isOnline = navigator.onLine;

			this.checkNetworkStatus();
		});
	}

	checkNetworkStatus() {
		// @TODO
	}

	constructor(
		@Inject(DOCUMENT) private document: Document,
		@Inject(PLATFORM_ID) private platformId: Object,
		private authService: SmartAuthService,
		private route: ActivatedRoute,
		private router: Router,
		public pageService: PageService,
		private store: Store<AppState>
	) {
		this.isProduction = environment.production;

		this.username = authService.getLoggedAccount().username;

		if (isPlatformBrowser(this.platformId)) {
			try {
				const stored = localStorage.getItem("theme");
				if (stored) {
					this.theme = JSON.parse(stored);
				}
			} catch (err) {}
			this.linkRef = this.document.createElement("link");
			this.linkRef.rel = "stylesheet";
			this.linkRef.href = this.theme.href;
			this.document.querySelector("head").appendChild(this.linkRef);
		}
		this.checkNetworkConnection();
	}

	ngOnInit() {
		this.returnUrl = this.router.url;
		this.appInfo$ = this.store.pipe(select("appInfo"));
	}

	login() {
		this.authService.logout();
		this.router.navigate(["/login"], { queryParams: { returnUrl: this.router.url } });
	}
}
