const express = require('express');
const { spawn } = require('child_process');
const fs = require('fs');

const app = express();
const port = 3000;
const processesFilePath = './pythonProcesses.json';

// Object to store information about Python server processes
let pythonProcesses = {};

// Start a Python server on a specified port
function startPythonServer(port) {
    if (!isPythonServerRunning(port)) {
        const pythonProcess = spawn('python3', [`../python-server/server.py`, `--port=${port}`]);

        pythonProcess.stdout.on('data', (data) => {
            console.log(`Python Server Output: ${data}`);
        });

        pythonProcess.stderr.on('data', (data) => {
            console.error(`Python Server Error: ${data}`);
        });

        pythonProcess.on('close', (code) => {
            console.log(`Python Server exited with code ${code}`);
            delete pythonProcesses[port];
            savePythonProcessesToFile();
        });

        // Store information about the Python server process
        pythonProcesses[port] = {
            process: pythonProcess,
            pid: pythonProcess.pid,
        };

        savePythonProcessesToFile();
    }
}

// Save Python processes information to the JSON file
function savePythonProcessesToFile() {
    fs.writeFile(processesFilePath, JSON.stringify(pythonProcesses, null, 2), (err) => {
        if (err) {
            console.error('Error saving Python processes information:', err);
        } else {
            console.log('Python processes information saved to', processesFilePath);
        }
    });
}

// Check if a Python server process is still running
function isPythonServerRunning(port) {
    const pythonProcess = pythonProcesses[port];
    return pythonProcess && pythonProcess.process && !pythonProcess.process.killed;
}

// Periodically check the health of Python server processes
setInterval(() => {
    console.log('checker',Object.keys(pythonProcesses).length)
    if(Object.keys(pythonProcesses).length == 0) {
        startPythonServer(5000);
    } else {
        for (const port in pythonProcesses) {
            if (!isPythonServerRunning(port)) {
                console.log(`Python Server on port ${port} is not running. Restarting...`);
                startPythonServer(port);
            } else {
                console.log("python sever is running")
            }
        }
    }

}, 5000); // Adjust the interval as needed (e.g., check every 5 seconds)

// Start the Node.js server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    // Start the Python server on a specific port when the Node.js server starts
    startPythonServer(6000); // Change the port as needed
});
