import { Page, PageTagType } from "./page";

export class PageRegistry {
	private pages: Array<Page> = [];
	private static _instance: PageRegistry;

	public static get Instance() {
		return this._instance || (this._instance = new this());
	}

	private constructor() {
		const pgPlayground = new Page(
			"Quick Links",
			"component-playground",
			"cursor-hand-click",
			false,
			false,
			[
				{
					name: "HordeFlow Kit",
					route: "hf-list",
					tag: {
						name: "Internal",
						type: PageTagType.Internal
					}
				}
			]
		);

		const pgHr = new Page("Organization", "hr", "applet-executive-team", true);
		pgHr.subPages.push(
			{ name: "Employees", route: "employees" },
			{ name: "Departments", route: "departments", permission: "departments.manage" },
			{ name: "Teams", route: "teams", permission: "teams.manage" },
			{ name: "Positions", route: "positions" },
			{ name: "Approvers", route: "time-of-request-approvers" }
		);

		const pgTimeManagement = new Page("Time Management", "time-management", "clock", true);
		pgTimeManagement.tag = { name: "Trial", type: PageTagType.Internal };
		pgTimeManagement.subPages.push(
			{ name: "Timesheets", route: "timesheets" },
			{ name: "Time Logs", route: "time-logs" },
			{ name: "Work Shifts", route: "work-shifts" },
			{ name: "Time-off Requests", route: "time-off-requests" },
			{ name: "Request Types", route: "time-off-request-types" }
		);

		const pgPayroll = new Page("Payroll", "payroll", "dollar-bill", true);
		pgPayroll.subPages.push(
			{ name: "Paysheets", route: "paysheets" },
			{ name: "Adjustments", route: "payroll-adjustments" },
			{ name: "Pay Items", route: "pay-items" }
		);

		const pgInventory = new Page("Inventory", "inventory", "bundle", true, true);
		pgInventory.disableRouting = true;
		pgInventory.subPages.push(
			{ name: "Items", route: "items" },
			{ name: "Receipts", route: "receipts" },
			{ name: "Adjustments", route: "adjustments" },
			{ name: "Transfers", route: "transfers" },
			{ name: "Stock Tracking", route: "stock-tracking" },
			{ name: "Valuations", route: "valuations" },
			{ name: "Commodities", route: "commodities" },
			{ name: "Categories", route: "categories" },
			{ name: "Units of Measurement", route: "units-of-measurement" }
		);

		const pgPurchasing = new Page("Purchasing", "purchasing", "shopping-bag", true, true);
		pgPurchasing.subPages = [
			{ name: "Purchase Orders", route: "purchase-orders" },
			{ name: "Vouchers", route: "vouchers" },
			{ name: "Vendors", route: "vendors" }
		];

		const pgSales = new Page("Sales", "sales", "shopping-cart", true, true);
		pgSales.subPages = [
			{ name: "Sales Orders", route: "sales-orders" },
			{ name: "Invoices", route: "invoices" },
			{ name: "Customers", route: "customers" }
		];

		const pgAdministration = new Page(
			"Administration",
			"administration",
			"administrator",
			true,
			true
		);
		pgAdministration.subPages.push(
			{ name: "Number Sequences", route: "number-sequences" },
			{ name: "Government Tables", route: "government-tables" },
			{ name: "Locations", route: "locations" },
			{ name: "Payroll Groups", route: "payroll-group", icon: "group" },
			{ name: "Payroll Cycle", route: "payroll-cycle", icon: "group" }
		);

		const pgAccounting = new Page("General Ledger", "accounting", "list");
		const pgSettings = new Page("Settings", "settings", "cog", true, true);
		const pgPreferences = new Page("Preferences", "preferences", "slider");
		const pgSecurity = new Page("Security", "security", "shield");
		const pgCompanySettings = new Page("Company Profile", "company-profile", "company");

		const pgPlugins = new Page("Plugins", "plugins", "plugin");
		pgSettings.subPages.push(pgPreferences);
		pgSettings.subPages.push(pgSecurity);
		pgSettings.subPages.push(pgCompanySettings);
		pgSettings.subPages.push(pgPlugins);

		this.pages.push(new Page("Getting Started", "getting-started", "bubble-exclamation"));
		pgAdministration.subPages.push(new Page("Currencies", "currencies", "dollar"));
		pgAdministration.subPages.push(new Page("Companies", "companies", "building"));
		pgAccounting.subPages.push(new Page("Accounts", "accounts", "book"));
		pgAccounting.subPages.push(new Page("Account Categories", "account-categories", "group"));

		this.pages.push(pgAccounting);
		this.pages.push(pgHr);
		this.pages.push(pgTimeManagement);
		this.pages.push(pgPayroll);
		this.pages.push(pgInventory);
		this.pages.push(pgPurchasing);
		this.pages.push(pgSales);
		this.pages.push(pgAdministration);
		this.pages.push(pgSettings);
		this.pages.push(new Page("About", "about", "help-info"));
	}

	getPages(): Page[] {
		return this.pages;
	}
}
