import { Entity } from "./entity";

export class Company extends Entity<string> {
	tenantId: string;
	name: string;
	code: string;
}
