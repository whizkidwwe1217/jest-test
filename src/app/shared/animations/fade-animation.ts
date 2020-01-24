import {
	trigger,
	transition,
	style,
	animate,
	group,
	query
} from "@angular/animations";

export const fadeAnimation = trigger("fadeAnimation", [
	transition("* <=> *", [
		style({ opacity: 0, visibility: "hidden" }),
		group([
			animate(
				"1ms ease-in-out",
				style({
					visibility: "visible"
				})
			),
			animate(
				"400ms ease-in-out",
				style({
					opacity: "1"
				})
			)
		])
	])
]);
