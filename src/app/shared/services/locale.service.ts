import { Injectable } from "@angular/core";
import { registerLocaleData } from "@angular/common";
import localeNorwegian from "@angular/common/locales/nb";
import localeSwedish from "@angular/common/locales/sv";
import localeTraditionalChinese from "@angular/common/locales/zh-Hant";
import localeGerman from "@angular/common/locales/de";

@Injectable({ providedIn: "root" })
export class LocaleService {
	private _locale: string;

	set locale(value: string) {
		this._locale = value;
	}

	get locale(): string {
		return this._locale || "en_US";
	}

	registerCulture(culture: string) {
		if (!culture) {
			return;
		}

		this.locale = culture;

		switch (culture) {
			case "nb-NO":
				registerLocaleData(localeNorwegian);
				break;
			case "sv-SE":
				registerLocaleData(localeSwedish);
				break;
			case "zh-Hant":
				registerLocaleData(localeTraditionalChinese);
				break;
			case "de":
				registerLocaleData(localeGerman);
				break;
		}
	}
}
