import { deflateRawSync, gunzipSync } from "zlib";
import crypto from "crypto"
const SCRIPT_REGEX =
	/<script src="(\/static\/[0-9a-f]+-frontend\.js)" defer><\/script>/;
const RUNURL_REGEX = /^var runURL = "\/cgi-bin\/static\/([^"]+)";$/m;

/** Languages we can decide to support: C(clang compiler), C++(clang compiler), Java(Oracle JDK), JavaScript(javascript-node), Python3*/
const LANGUAGES = ["c-clang", "cpp-clang", "java-jdk", "javascript-node", "python3" ];
async function getURL() {
	const num = await fetch("https://tio.run/").then((response) =>
		response.text()
	);
	const text = num.toString();
	const frontendJSURL = text.match(SCRIPT_REGEX)?.[1];

	const frontendJS = await fetch(`https://tio.run${frontendJSURL}`).then(
		(response) => response.text()
	);
	const string = frontendJS.toString();
	const runURL = string.match(RUNURL_REGEX)?.[1];

	return runURL;
}

function hex(size) {
	const randomHex = crypto.randomBytes(size).toString("hex");
	return randomHex;
}

var TIO = {
	/** Returns a string array of the output, real time, user time, system time, cpu share and exit code*/
	run: async function run(code, input, language) {
		console.log(language);
		if (!LANGUAGES.includes(language)) {
			throw new Error(
				"Unsupported/Invalid language provided. TIO.languages for list of languages supported."
			);
		}
		const URL = await getURL();
		const hexadecimal = hex(16);
		const response = await fetch(
			`https://tio.run/cgi-bin/static/${URL}/${hexadecimal}`,
			{
				method: "POST",
				body: deflateRawSync(
					`Vlang\u00001\u0000${language}\u0000F.code.tio\u0000${code.length}\u0000${code}F.input.tio\u0000${input.length}\u0000${input}Vargs\u0000\u0000R`,
					{
						level: 9,
					}
				),
			}
		);

		const data = await response.arrayBuffer();
		const output = gunzipSync(new Buffer.from(data)).toString();
		const string = output.replaceAll(output.slice(-16), "").split("\n");
		return string;
	},
	languages: LANGUAGES,
};
export { TIO, LANGUAGES };