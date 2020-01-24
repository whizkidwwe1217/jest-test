import { Component, ChangeDetectionStrategy } from "@angular/core";
import * as dateFns from "date-fns";
import * as _ from "lodash";

interface CalendarDay {
	dayNo: number;
	text: string;
	date: Date;
	isCurrentDate: boolean;
	isInCurrentMonth: boolean;
}

interface CalendarWeek {
	weekNo: number;
	days?: CalendarDay[];
}

interface CalendarEvent {
	date: Date;
	endDate?: Date;
	text: string;
	icon?: string;
	color?: string;
	textColor?: string;
	allDay?: boolean;
	repeat?: boolean;
	important?: boolean;
	repeatOptions?: {
		endDate: Date;
	};
}

@Component({
	selector: "hf-calendar",
	templateUrl: "./calendar.component.html",
	styleUrls: ["./calendar.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarComponent {
	current: Date = new Date(2019, 2, 1);
	eventsDisplayLimit: number = 3;
	fixedHeight: boolean = false;

	events: CalendarEvent[] = [
		{
			date: dateFns.addHours(this.current, 1),
			text: "Date with my girlfriend",
			color: "red",
			important: true,
			icon: "heart"
		},
		{
			date: dateFns.addHours(this.current, 3),
			text: "Birthday Party!",
			color: "red",
			textColor: "orange"
		},
		{
			date: new Date(2019, 2, 4, 2, 4, 0, 0),
			text: "Sick leave",
			color: "red"
		},
		{
			date: new Date(2019, 2, 4, 2, 4, 0, 0),
			text:
				"TODO: Create a Week View for the Calendar ComponentTODO: Create a Week View for the Calendar ComponentTODO: Create a Week View for the Calendar ComponentTODO: Create a Week View for the Calendar ComponentTODO: Create a Week View for the Calendar Component",
			color: "red",
			icon: "flag",
			important: true
		},
		{
			date: new Date(2019, 2, 6, 2, 4, 0, 0),
			text: "Scrum with Payroll team",
			important: true,
			color: "#a3af56",
			icon: "user"
		},
		{
			date: dateFns.addHours(this.current, 2.6),
			text: "Vacation Leave",
			color: "red"
		},
		{
			date: new Date(2019, 3, 4, 2, 4, 0, 0),
			text: "Dentist's appointment at Fairview",
			color: "blue"
		},
		{
			date: new Date(2019, 3, 6, 2, 4, 0, 0),
			text: "Meeting at Fairmont"
		}
	];

	newEvent: Date;

	addEvent() {
		this.events.push({
			date: this.newEvent,
			text: "Meeting at Fairmont"
		});
	}

	getEvent(day: CalendarDay): any[] {
		let event = _.filter(this.events, a => dateFns.isSameDay(a.date, day.date));
		event = _.sortBy(event, a => a.date);
		return this.eventsDisplayLimit <= 0 ? event : _.take(event, this.eventsDisplayLimit);
	}

	getMonthYear(): string {
		return dateFns.format(this.current, "MMMM yyyy");
	}

	getDisplayWeeks(): CalendarWeek[] {
		let weeks: CalendarWeek[] = [];

		for (let i = 0; i < 6; i++) {
			let week: CalendarWeek = { weekNo: i + 1 };
			week.days = this.getDisplayDaysInWeek(week);
			weeks.push(week);
		}

		return weeks;
	}

	getDisplayDaysInWeek(week: CalendarWeek): CalendarDay[] {
		let startOfWeek = dateFns.startOfWeek(this.current);
		startOfWeek = dateFns.addWeeks(startOfWeek, week.weekNo - 1);
		let days: CalendarDay[] = [];
		for (let i = 0; i < 7; i++) {
			let date = dateFns.addDays(startOfWeek, i);

			let day: CalendarDay = {
				date: date,
				dayNo: dateFns.getDay(date),
				text:
					(dateFns.isFirstDayOfMonth(date) || dateFns.isLastDayOfMonth(date)) &&
					!dateFns.isSameMonth(this.current, date)
						? dateFns.format(date, "MMM d")
						: dateFns.format(date, "d"),
				isCurrentDate: dateFns.isSameDay(new Date(), date),
				isInCurrentMonth: dateFns.isSameMonth(this.current, date)
			};
			days.push(day);
		}
		return days;
	}

	getDayNames(): string[] {
		let dayNames: string[] = [];
		const now = new Date();
		const arr = dateFns.eachDayOfInterval({
			start: dateFns.startOfWeek(now),
			end: dateFns.endOfWeek(now)
		});
		for (let i = 0; i < arr.length; i++) {
			dayNames.push(dateFns.format(arr[i], "ddd"));
		}

		return dayNames;
	}

	previousMonth() {
		this.current = dateFns.addMonths(this.current, -1);
	}

	nextMonth() {
		this.current = dateFns.addMonths(this.current, 1);
	}
}
