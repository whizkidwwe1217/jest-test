import { Injectable } from "@angular/core";
import { PageRegistry } from "../../../data/page-registry";
import { Page } from "../../../data/page";
import { Observable, from } from "rxjs";

@Injectable({ providedIn: "root" })
export class PageService {
	getPages(): Observable<Page> {
		return from(PageRegistry.Instance.getPages());
	}

	/**
	 * This is a test data to mock a slow connection.
	 */
	getPagesSlowly(): Promise<Array<Page>> {
		return new Promise(p => setTimeout(p, 2000)).then(() =>
			PageRegistry.Instance.getPages()
		);
	}
}
