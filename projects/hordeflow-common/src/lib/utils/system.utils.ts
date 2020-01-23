export class SystemUtils {
	/**
	 * Constants
	 */
	public static KEY_BACKSPACE: number = 8;
	public static KEY_HORIZONTAL_TAB: number = 9;
	public static KEY_LINE_FEED: number = 10;
	public static KEY_VERTICAL_TAB: number = 11;
	public static KEY_CARRIAGE_RETURN: number = 13;
	public static KEY_SHIFT: number = 16;
	public static KEY_CTRL: number = 17;
	public static KEY_ALT: number = 18;
	public static KEY_CAPS_LOCK: number = 20;
	public static KEY_ESC: number = 27;
	public static KEY_SPACE: number = 32;
	public static KEY_LEFT: number = 37;
	public static KEY_UP: number = 38;
	public static KEY_RIGHT: number = 39;
	public static KEY_DOWN: number = 40;

	public static KEY_A: number = 65;

	public static KEY_META_OR_WINDOWS_KEY: number = 91;
	public static KEY_CONTEXT_MENU: number = 93;

	public static guid(): string {
		let s4 = () => {
			return Math.floor((1 + Math.random()) * 0x10000)
				.toString(16)
				.substring(1);
		};
		return s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
	}
}
