import { JwtToken } from "./jwt-token";

export class JwtProvider {
	decodeUrlBase64(str: string): string {
		let output = str.replace(/-/g, "+").replace(/_/g, "/");
		switch (output.length % 4) {
			case 0: {
				break;
			}
			case 2: {
				output += "==";
				break;
			}
			case 3: {
				output += "=";
				break;
			}
			default: {
				throw new Error("Illegal base64url string!");
			}
		}

		return this.decodeBase64Unicode(output);
	}

	decodeBase64Unicode(str: any) {
		return decodeURIComponent(
			Array.prototype.map
				.call(this.decodeBase64(str), (c: any) => {
					return `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`;
				})
				.join("")
		);
	}

	private decodeBase64(str: string): string {
		const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
		let output: string = "";

		str = String(str).replace(/=+$/, "");

		if (str.length % 4 === 1) {
			throw new Error("'atob' failed: The string to be decoded is not correctly encoded.");
		}

		for (
			// initialize result and counters
			let bc: number = 0, bs: any, buffer: any, idx: number = 0;
			// get next character
			(buffer = str.charAt(idx++));
			// character found in table? initialize bit storage and add its ascii value;
			~buffer &&
			((bs = bc % 4 ? bs * 64 + buffer : buffer),
			// and if not first of each 4 characters,
			// convert the first 8 bits to one ascii character
			bc++ % 4)
				? (output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6))))
				: 0
		) {
			// try to find character in table (0-63, not found => -1)
			buffer = chars.indexOf(buffer);
		}
		return output;
	}

	decodeToken(token: string): JwtToken {
		if (token == null || token === "") {
			return null;
		}

		const parts = token.split(".");

		if (parts.length !== 3) {
			throw new Error(
				"The inspected token doesn't appear to be a JWT. Check to make sure it has three parts and see https://jwt.io for more."
			);
		}

		const decodedHeader = this.decodeUrlBase64(parts[0]);
		const decodedPayload = this.decodeUrlBase64(parts[1]);
		if (!decodedHeader || !decodedPayload) {
			throw new Error("Cannot decode the token.");
		}

		return {
			header: JSON.parse(decodedHeader),
			payload: JSON.parse(decodedPayload),
			signature: parts[2]
		};
	}

	verifySignature(signature: string) {
		//const base64 = btoa(JSON.stringify(this.decodeUrlBase64(signature)));
		const base64 = btoa(unescape(encodeURIComponent(signature)));
	}

	encodeUrlBase64(str: string): string {
		str = JSON.stringify(str);
		let output = str.replace(/-/g, "+").replace(/_/g, "/");
		switch (output.length % 4) {
			case 0: {
				break;
			}
			case 2: {
				output += "==";
				break;
			}
			case 3: {
				output += "=";
				break;
			}
			default: {
				throw new Error("Illegal base64url string!");
			}
		}

		// return btoa(JSON.stringify(this.decodeUrlBase64(output)));
		return btoa(unescape(encodeURIComponent(output)));
	}

	public getTokenExpirationDate(token: string): Date | null {
		let decoded: JwtToken;
		decoded = this.decodeToken(token);

		if (!decoded || !decoded.payload.hasOwnProperty("exp")) {
			return null;
		}

		const date = new Date(0);
		date.setUTCSeconds(decoded.payload.exp);

		return date;
	}

	public isTokenExpired(token: string, offsetSeconds?: number): boolean {
		if (token == null || token === "") {
			return true;
		}
		const date = this.getTokenExpirationDate(token);
		offsetSeconds = offsetSeconds || 0;

		if (date === null) {
			return false;
		}

		return !(date.valueOf() > new Date().valueOf() + offsetSeconds * 1000);
	}
}
