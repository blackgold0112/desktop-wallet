// Get IPC renderer
const { ipcRenderer } = require("electron");

// init
function init() {
  // add global variables to your web page
  window.isElectron = true; // Set is electron
  window.ipcRenderer = ipcRenderer; // Set IPC renderer
}

init(); // Init
