const http = require('http');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const PORT = 8000;

const console_input = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	prompt: '> ',
});

const mime_types = {
	".html": "text/html",
	".css": "text/css",
	".js": "text/javascript",
	".ico": "image/x-icon",
};

var content_type;
var file;

function get_time() {
	const date = new Date()
	let current_time = {
		hour: date.getHours().toString().padStart(2, '0'),
		minute: date.getMinutes().toString().padStart(2, '0'),
		second: date.getSeconds().toString().padStart(2, '0'),
	};
	return `${current_time.hour}:${current_time.minute}:${current_time.second}`;
}

const server = http.createServer((req, res) => {
	file = req.url == '/' ? "index.html" : req.url
	fs.readFile(path.join(__dirname, req.url == "/" ? "index.html" : req.url), (err, data) => {
		let extension = String(path.extname(file)).toLowerCase();
		content_type = mime_types[extension] ? mime_types[extension] : "text/plain";

		if (err && err.code == "ENOENT") {
			res.writeHead(404, { "content-type": "text/html" });
			res.end(`<h1>404 FILE NOT FOUND</h1>\nthe file you requested was not found`);
			console.log(`${get_time()}> WARNING: requested file ${req.url} was not found`);
			return;
		}
		if (err) {
			res.writeHead(500, { "content-type": "text/html" });
			res.end(`<h1>ERROR:</h1>\n${err.code}`);
			console.log(`${get_time()}> Error when requesting file ${req.url}\n\t${err}`)
			return;
		}
		
		console.log(`${get_time()}> requesting file ${file}`)
		
		res.writeHead(200, { "content-type": content_type});
		res.end(data);
	});
});

server.listen(PORT, 'localhost', () => {
	console.log(`started server on port ${PORT}`);
	console_input.on('line', (input) => {
		input = input.trim().split(' ');
		if (input[0] == "shutdown") {
			console.log("shutting down server...");
			server.close(() => {
				console.log("Server closed");
				process.exit(0);
			});

			setTimeout(() => {
				console.error("Shutdown taking too long");
				process.exit(1);
			}, 10000);

		}
	});
});
