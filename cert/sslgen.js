/**
 * This is use to generate a self-signed SSL certificate.
 */

const fs = require("fs");
const selfsigned = require("selfsigned");
const attrs = [{ name: "commonName", value: "microsoft.hordeflow.com" }];
const pems = selfsigned.generate(attrs, {
	algorithm: "sha256",
	keySize: 2048,
	extensions: [
		{
			name: "subjectAltName",
			altNames: [
				{
					type: 2, // DNS
					value: "localhost"
				},
				{
					type: 6, // DNS
					value: "microsoft.hordeflow.com"
				},
				{
					type: 7, // IP
					ip: "127.0.0.1"
				}
			]
		}
	]
});

fs.writeFileSync("./server.crt", pems.cert, { encoding: "utf-8" });
fs.writeFileSync("./server.key", pems.private, { encoding: "utf-8" });
