// Get session
const { session } = require("electron");

// Get win electron title-bar
const ElectronTitlebarWindows = require("electron-titlebar-windows");

// init
function init() {
  const titlebar = new ElectronTitlebarWindows(); // Initialize title bar

  titlebar.appendTo(window.document.getElementsByClassName("drag")); // Append to drag DOM element

  window.cookies = session.defaultSession.cookies; // Set cookies
}

init(); // Init
