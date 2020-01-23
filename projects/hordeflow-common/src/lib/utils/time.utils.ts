export class TimeUtils {
	public static getGreetingTime(m) {
		let g = null; //return g

		if (!m || !m.isValid()) {
			return;
		} //if we can't find a valid or filled moment, we return.

		let split_afternoon = 12; //24hr time to split the afternoon
		let split_evening = 17; //24hr time to split the evening
		let currentHour = parseFloat(m.format("HH"));

		if (currentHour >= split_afternoon && currentHour <= split_evening) {
			g = "afternoon";
		} else if (currentHour >= split_evening) {
			g = "evening";
		} else {
			g = "morning";
		}

		return g;
	}
}
