export enum JwtClaims {
	GivenName = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname",
	Surname = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname",
	Permission = "https://auth.hordeflow.com/2019/identity/claims/permission",
	Role = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role",
	NameIdentifier = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier",
	Company = "https://auth.hordeflow.com/2019/identity/claims/company",
	Tenant = "https://auth.hordeflow.com/2019/identity/claims/tenant",
	Id = "https://auth.hordeflow.com/2019/identity/claims/id",
	UniqueName = "unique_name"
}
