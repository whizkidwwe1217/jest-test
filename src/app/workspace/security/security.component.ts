import { Component } from "@angular/core";
import { fadeAnimation } from "src/app/shared/animations/fade-animation";

@Component({
	templateUrl: "./security.component.html",
	styleUrls: ["./security.component.scss"],
	animations: [fadeAnimation]
})
export class SecurityComponent {
	public getState(outlet) {
		return outlet.activatedRouteData["depth"];
	}
}
