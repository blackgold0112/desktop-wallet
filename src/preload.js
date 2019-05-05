// Get IPC renderer
const { ipcRenderer } = require("electron");

// init
function init() {
  // add global variables to web page
  window.isElectron = true; // Set is electron
  window.ipcRenderer = ipcRenderer; // Set IPC renderer

  if (process.platform === "win32") {
    // Check is windows
    window.isWindows = true; // Set is windows
  }
}

init(); // Init
