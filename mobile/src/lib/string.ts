export function capitaliseFirst(str: string): string {
	str = str.toLowerCase();
	return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * @description this replaces part of a string with a mask (*)
 */
export function mask(text: string, maskLength: number = 2, isEmail: boolean = false): string {
	if (isEmail) {
		const [username, domain] = text.split("@");
		maskLength = Math.max(maskLength, parseInt((username.length / 2)?.toFixed(0)));
		const maskedUsername = username.replace(username.substring(1, maskLength + 1), "*".repeat(maskLength));
		return `${maskedUsername}@${domain}`;
	}
	return text.replace(text.substring(1, maskLength + 1), "*".repeat(maskLength));
}
