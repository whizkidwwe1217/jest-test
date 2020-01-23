import { Entity } from "./entity";

export interface Tenant extends Entity<string> {
	connectionString: string;
	description: string;
	deploymentStatus: string;
	engine: string;
	hostName: string;
	isIsolated: boolean;
	isTenantAdministrator: boolean;
	theme: string;
	id: string;
	name: string;
}
