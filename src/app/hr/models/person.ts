import { CompanyEntity } from "./company-entity";

export class Person extends CompanyEntity<number> {
    private _birthDate: Date;

    firstName: string;
    lastName: string;
    middleName?: string;
    nickname?: string;

    get birthDate(): Date {
        return this._birthDate;
    }

    set birthDate(date: Date) {
        this._birthDate = new Date();
    }

    gender: string;
    maritalStatus: string;
    emailAddress?: string;
    religion?: string;
    citizenship?: string;
    birthPlace?: string;
    title?: string;
    suffix?: string;
    ethnicity?: string;
    race?: string;
    countryId?: number;
    tin?: string;
    phic?: string;
    sss?: string;
    gsis?: string;
    country?: any;
}
