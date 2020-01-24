import { Entity } from "hordeflow-common";

export class Company extends Entity<string> {
    tenantId: string;
    name: string;
    code: string;
}
