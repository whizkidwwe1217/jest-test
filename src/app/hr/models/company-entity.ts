import { TenantEntity } from "./tenant-entity";

export class CompanyEntity<Key> extends TenantEntity<Key> {
    companyId: string;
}
