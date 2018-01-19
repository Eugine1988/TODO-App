let exec = require("child_process").exec;
let spawn = require("child_process").spawn;


// Start server as a child process
let server = startServer();
// Open wab page in chrome
exec('start chrome.exe http://localhost:3000');


// Handle cmd requests from user
process.stdin.on('data', function(arg) {
    let data = arg.toString().trim().toLowerCase();

    if(data === '' || data === 'e' || data === 'exit') {
        server.kill();        
        process.exit();

    } else if(data === 's' || data === 'stop') {
        server.kill();

    } else if(data === 'r' || data === 'restart') {
        server.kill();
        server = startServer();

    } else if(data === 'i' || 'info') {
        console.log(`Restart Server: 'r', 'restart'`);
        console.log(`Stop Server: 's', 'stop'`);
        console.log(`Exit Program: 'e', 'exit'`);
        console.log(`Information: 'i', 'info'`);

    } else {
        console.log(data);
    }
});


// Start server
function startServer() {
    // Create server child process object
    let cp = startChildProcess('app', 'Server', function(data) {
        // When user reloads or closes window
        if(data === "exit") {
            cp.kill();
            process.exit();
        }
    });

    return cp;
}

// Start a new process on another thread
function startChildProcess (process, name, callback) {
    // Start a child process
    let cp = spawn("node", [process]);

    // Listen for incoming data from child's process stdout object
    cp.stdout.on("data", function(arg) {
        let data = arg.toString().trim();
        console.log(`${name}: ${data}`);
        callback(data, cp);
    });

    // Listen for close event on child process
    cp.on("close", function() {
        console.log(`${name} closed`);
    });

    return cp;
}