import { Person } from "./person";

export class Employee extends Person {
	code: string;
	dateEmployed: Date;
	dateRegularized: Date;
	dateSeparated: Date;
	dateTerminated: Date;
	dateResigned: Date;
	salaryFrequency?: number;
	supervisorId?: number;
	positionId?: number;
	departmentId?: number;
	teamId?: number;
	team?: any;
	department?: any;
	position?: any;
	supervisor?: Employee;
	subordinates?: Employee[] = [];
}
