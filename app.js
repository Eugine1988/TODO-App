let http = require("http");
let fs = require("fs");


http.createServer(function(req, res) {

    if(req.method === "GET") {
        console.log(`GET request: ${req.url}`);
        
        if(req.url === "/") {
            // Stream form.html file to client
            res.writeHead(200, { "Content-Type": "text/html" });
            fs.createReadStream("./public/index.html", "UTF-8").pipe(res);

        } else if(req.url === "/js/script.js") {
            res.writeHead(200, { "Content-Type": "text/html" });
            fs.createReadStream("./public/js/script.js", "UTF-8").pipe(res);

        } else if(req.url === "/data") {
            loadData('./public/data', 'data.json', function(data) {
                res.writeHead(200, { "Content-Type": "text/json" });
                res.end(data);
            });

        } else {
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.end("Data not found");
        }
        
    } else if(req.method === "POST") {
        console.log(`POST request: ${req.url}`);

        // Concatinate data stream into a string
        let data = "";
        req.on("data", function(chunk) {
            data += chunk;
        });

        // Take actions after at end of stream
        req.on("end", function() {

            if(req.url === "/data") {
                // Save data to file & send success/failure msg to front-end
                res.writeHead(200, { "Content-Type": "text/plain" });
                res.end(saveData(data, './public/data', 'data.json'));

            } else if(req.url === "/msg") {
                console.log(data);
            } else {
                console.log('Unknown POST url recieved');
            }
        });
    }
}).listen(3000);


// Create readJSON & writeJSON make file readable, make sting compressed

// Get string data from a file on computer
let loadData = (path, filename, callback) => {
    try {
        let stream = fs.createReadStream(`${path}/${filename}`, "UTF-8");
        let data = "";

        stream.on("data", function(chunk) {
            data += chunk;
        });

        stream.on("end", function() {
            console.log(`Read file: ${path}/${filename}`);
            callback(data);
        });
    } catch(error) {
        console.log(`Error reading file: ${error}`);
    }
};

// Save string into a new file on computer
let saveData = (data, path, filename) => {
    try {
        let wstream = fs.createWriteStream(`${path}/${filename}`);
        wstream.write(data);
        wstream.end();
        console.log(`File Saved: ${path}/${filename}`);
        return (`File Saved`);
    } catch(error) {
        console.log(`Error writing file: ${error}`);
        return (`Error writing file: ${error}`);
    }
};

console.log("Node.js server running on port 3000");