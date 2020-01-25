import { HttpService } from "hordeflow-common";
import { of } from "rxjs";

let service: HttpService;
const http = {
	get: jest.fn()
};

beforeEach(() => {
	service = new HttpService(http as any);
});

test("Http Service Test using Jest Mocking", async done => {
	const appInfo = {
		tenant: {
			name: "Globe Cafe",
			description: "Globe Cafe",
			connectionString:
				"Server=HOST_NAME;Initial Catalog=DATABASE_NAME;UID=USER_NAME;Pwd=PASSWORD;",
			hostName: "localhost:5001",
			engine: "SqlServer",
			edition: null,
			isIsolated: false,
			isTenantAdministrator: false,
			deploymentStatus: null,
			subscription: null,
			subscriptionId: null,
			dateCreated: null,
			dateModified: null,
			dateDeleted: null,
			active: true,
			deleted: false,
			theme: "evergreen",
			id: "d46f6c18-5e3b-4d91-bf05-08d6d230ee64",
			concurrencyStamp: "AAAAAAAAlHo=",
			concurrencyTimeStamp: null
		},
		isAdmin: false,
		isTenant: true,
		hasCompany: true
	};

	http.get.mockImplementationOnce(() => of(appInfo));
	service.getValue<any>("https://localhost:5001/api/v1/app/info").subscribe(info => {
		expect(info.tenant.name).not.toBeNull();
		expect(info.tenant.name).toBe("Globe Cafe");
		done();
	});
});
