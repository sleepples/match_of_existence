const http = require('http');
const fs = require('fs');
const path = require('path');

const date = new Date()

const PORT = 8000;

const mime_types = {
	".html": "text/html",
	".css": "text/css",
	".js": "text/javascript",
	".ico": "image/x-icon",
};

var content_type;
var file;

const server = http.createServer((req, res) => {
	file = req.url == '/' ? "index.html" : req.url
	fs.readFile(path.join(__dirname, req.url == "/" ? "index.html" : req.url), (err, data) => {
		let extension = String(path.extname(file)).toLowerCase();
		content_type = mime_types[extension] ? mime_types[extension] : "text/plain";

		if (err) {
			res.writeHead(500, { "content-type": "text/html" });
			res.end(`<h1>ERROR:</h1>\n${err.code}`);
			console.log(`${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}> Error when requesting file ${req.url}\n\t${err}`)
			return;
		}
		
		console.log(`${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}> requesting file ${file}`)
		
		res.writeHead(200, { "content-type": content_type});
		res.end(data);
	});
});

server.listen(PORT, 'localhost', () => {
	console.log(`started server on port ${PORT}`);
});
