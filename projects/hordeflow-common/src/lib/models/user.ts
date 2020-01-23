import { Entity } from "./entity";

export class User extends Entity<number> {
	companyId: string;
	email: string;
	emailConfirmed: boolean;
	isConfirmed: boolean;
	isSystemAdministrator: boolean;
	lockoutEnabled: boolean;
	lockoutEnd: Date;
	mobileNo: string;
	recoveryEmail: string;
	securityStamp: string;
	tenantId: string;
	twoFactorEnabled: string;
	userName: string;
}
