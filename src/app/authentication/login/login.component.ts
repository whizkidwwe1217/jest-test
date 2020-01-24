import { Component, OnInit, AfterViewInit, ViewChild, Inject, PLATFORM_ID } from "@angular/core";
import {
	FormBuilder,
	FormGroup,
	FormControl,
	Validators,
	ValidatorFn,
	AbstractControl
} from "@angular/forms";
import { SmartAuthService } from "../services/smart-auth.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Store, select } from "@ngrx/store";
import {
	HttpSearchParams,
	AppInfo,
	LS_TENANT_AUTH_ACCOUNT,
	LS_CATALOG_AUTH_ACCOUNT,
	HttpService,
	URL_APP_INFO
} from "hordeflow-common";
import { tap } from "rxjs/operators";
import { SET_INFO } from "src/app/data/actions/app-info.action";
import { HfSelect, triggerAllFormControlValidation } from "hordeflowkit";
import { DOCUMENT, isPlatformBrowser } from "@angular/common";
import { environment } from "src/environments/environment";
import { AppState } from "src/app/data/app-state";

@Component({
	selector: "app-login",
	templateUrl: "./login.component.html",
	styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit, AfterViewInit {
	loginForm: FormGroup;
	setupForm: FormGroup;
	isTenant: boolean;
	returnUrl: string;
	selectedCompany: any;
	loading = false;
	formSubmitAttempt = false;
	hasErrors = false;
	errorText: string;
	isReady: boolean;
	info: AppInfo = {
		hasCompany: true,
		tenant: null,
		isAdmin: false,
		isTenant: true
	};

	@ViewChild("companyLookup", { static: false }) companyLookup: HfSelect;
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

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private authService: SmartAuthService,
		private http: HttpService,
		private fb: FormBuilder,
		private store: Store<AppState>,
		@Inject(DOCUMENT) private document: Document,
		@Inject(PLATFORM_ID) private platformId: Object
	) {
		this.loginForm = this.fb.group({
			companyId: [null, this.tenantCompanyValidator()],
			username: [null, Validators.required],
			password: [null, Validators.required],
			rememberCredentials: false
		});

		this.setupForm = this.fb.group({
			name: [null, Validators.required],
			address: [null, Validators.required],
			phoneNumber: [null, Validators.required]
		});

		if (isPlatformBrowser(this.platformId)) {
			try {
				const stored = localStorage.getItem("theme");
				if (stored) {
					this.theme = JSON.parse(stored);
				}
			} catch (err) {
				// Nothing to do
			}
			this.linkRef = this.document.createElement("link");
			this.linkRef.rel = "stylesheet";
			this.linkRef.href = this.theme.href;
			this.document.querySelector("head").appendChild(this.linkRef);
		}
	}

	tenantCompanyValidator(): ValidatorFn {
		return (control: AbstractControl): { [key: string]: any } | null => {
			if (this.info.hasCompany) {
				if (!control.value) {
					return { required: true };
				}
			}
			return null;
		};
	}

	onCompanySelected(company) {
		this.selectedCompany = company;
	}

	setupCompany() {
		if (!this.setupForm.valid) {
			this.hasErrors = true;
			this.errorText = "Please fill out all the required fields.";
			return;
		}

		const tenant = this.info.tenant;
		this.http
			.process("api/v1/tenant/initialize", tenant)
			.pipe(
				tap(() => {
					this.loading = true;
					this.isReady = false;
				})
			)
			.subscribe(
				r => {
					this.http.getValue<AppInfo>(URL_APP_INFO).subscribe(info => {
						this.store.dispatch({
							type: SET_INFO,
							payload: info
						});
						this.isReady = true;
					});
				},
				error => {},
				() => {
					this.loading = false;
					this.isReady = true;
				}
			);
	}

	get username() {
		return this.loginForm.get("username");
	}
	get password() {
		return this.loginForm.get("password");
	}
	get companyId() {
		return this.loginForm.get("companyId");
	}
	get rememberCredentials() {
		return this.loginForm.get("rememberCredentials");
	}

	setFormData(data: any, isTenant?: boolean) {
		const login = {
			companyId: isTenant ? data.companyId : null,
			username: data.username,
			password: data.password,
			rememberCredentials: data.rememberCredentials
		};
		this.loginForm.setValue(login);
	}

	ngOnInit() {
		this.store.pipe(select("appInfo")).subscribe(
			info => {
				this.info = info;
				this.isTenant = this.info.isTenant;
				const credentials = this.getStoredCredentials();
				let url: string = this.route.snapshot.queryParams["returnUrl"];

				if (url) {
					if (url.startsWith("/admin") && this.isTenant) {
						url = "/workspace";
					}
				}

				this.returnUrl = url || (!this.isTenant ? "/admin" : "/workspace");

				if (!this.info.hasCompany && this.info.isTenant && !this.info.isAdmin) {
					this.router.navigate(["/"], {
						queryParams: { returnUrl: url }
					});
				}

				if (this.authService.getAuthToken() && this.router.url.indexOf("/login") !== -1) {
					this.loading = true;
					this.authService
						.login(
							credentials.username,
							credentials.password,
							credentials.companyId,
							credentials.rememberCredentials
						)
						.subscribe({
							next: () => {
								if (this.isTenant) {
									this.router.navigate([this.returnUrl]);
								} else {
									this.router.navigate([this.returnUrl], {
										queryParams: { returnUrl: this.returnUrl }
									});
								}
							},
							complete: () => (this.loading = false)
						});
				}

				this.setFormData(
					{
						companyId: credentials.companyId,
						username: credentials.username,
						password: credentials.password,
						rememberCredentials: credentials.rememberCredentials
					},
					this.isTenant
				);
				this.isReady = true;
			},
			error => {
				this.info = {
					hasCompany: true,
					tenant: null,
					isAdmin: false,
					isTenant: true
				};
			}
		);
	}

	ngAfterViewInit() {}

	private getStorageCredentialItem(
		key: string,
		defaultValue: any,
		isJson: boolean = false,
		jsonKey: string = ""
	): any {
		let output =
			localStorage && localStorage.getItem(key) ? localStorage.getItem(key) : defaultValue;
		if (isJson) {
			const storedUser = localStorage.getItem(jsonKey);
			if (storedUser) {
				const user = JSON.parse(storedUser);
				output = user[key];
			} else output = "";
		}
		return output;
	}

	private getStoredCredentials(): {
		companyId: any;
		username: any;
		password: any;
		rememberCredentials: any;
	} {
		return {
			companyId: this.getStorageCredentialItem(
				"companyId",
				"",
				true,
				this.isTenant ? LS_TENANT_AUTH_ACCOUNT : LS_CATALOG_AUTH_ACCOUNT
			),
			username: this.getStorageCredentialItem(
				"username",
				"",
				true,
				this.isTenant ? LS_TENANT_AUTH_ACCOUNT : LS_CATALOG_AUTH_ACCOUNT
			),
			password: this.getStorageCredentialItem(
				"password",
				"",
				true,
				this.isTenant ? LS_TENANT_AUTH_ACCOUNT : LS_CATALOG_AUTH_ACCOUNT
			),
			rememberCredentials: this.getStorageCredentialItem(
				"rememberCredentials",
				false,
				true,
				this.isTenant ? LS_TENANT_AUTH_ACCOUNT : LS_CATALOG_AUTH_ACCOUNT
			)
		};
	}

	login() {
		this.formSubmitAttempt = true;
		this.loading = true;
		this.hasErrors = false;

		if (this.loginForm.valid) {
			const username = this.loginForm.get("username").value;
			const password = this.loginForm.get("password").value;
			const companyId = this.loginForm.get("companyId").value;
			const rememberCredentials = this.loginForm.get("rememberCredentials").value;

			this.loading = true;
			this.isReady = false;

			this.authService.login(username, password, companyId, rememberCredentials).subscribe(
				() => {
					if (this.isTenant) {
						this.router.navigate([this.returnUrl]);
					} else {
						this.router.navigate([this.returnUrl], {
							queryParams: { returnUrl: this.returnUrl }
						});
					}
				},
				err => {
					if (+err.status === 0) {
						this.errorText =
							"Unable to connect to the server. Please contact your system administrator.";
					} else {
						this.errorText = err.statusText;
						if (err.status === 401) {
							this.errorText =
								"The user account does not exists or you do not belong to this company.";
						}
					}
					this.hasErrors = true;
					this.loading = false;
					this.isReady = true;
				},
				() => {
					this.loading = false;
				}
			);
		} else {
			triggerAllFormControlValidation(this.loginForm);
			this.loading = false;
			this.hasErrors = true;
			this.errorText = "";
		}
	}

	getSearchParams(): HttpSearchParams {
		return {
			currentPage: 1,
			pageSize: 10
		};
	}

	reset() {
		this.loginForm.reset();
		this.formSubmitAttempt = false;
	}

	validateAllFormFields(formGroup: FormGroup) {
		Object.keys(formGroup.controls).forEach(field => {
			const control = formGroup.get(field);
			if (control instanceof FormControl) {
				control.markAsTouched({ onlySelf: true });
			} else if (control instanceof FormGroup) {
				this.validateAllFormFields(control);
			}
		});
	}

	touchAll() {
		Object.keys(this.loginForm.controls).forEach(field => {
			const control = this.loginForm.get(field);
			control.markAsTouched({ onlySelf: true });
		});
	}

	isFieldValid(field: string) {
		return (
			(!this.loginForm.get(field).valid && this.loginForm.get(field).touched) ||
			(this.loginForm.get(field).untouched && this.formSubmitAttempt)
		);
	}
}
