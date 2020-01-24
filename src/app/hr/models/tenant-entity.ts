import { Entity } from "hordeflow-common";

export class TenantEntity<Key> extends Entity<Key> {
    tenantId: string;
}
