import { UserClaims } from "./user-claims";

export interface AuthToken {
	accessToken: string;
	refreshToken: string;
}
