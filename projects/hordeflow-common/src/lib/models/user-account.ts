export interface UserAccount {
	username: string;
	password: string;
	companyId?: string;
	rememberCredentials?: boolean;
	loggedOut?: boolean;
}
