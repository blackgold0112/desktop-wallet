// Get win electron title-bar
const ElectronTitlebarWindows = require("electron-titlebar-windows");

// init
function init() {
  const titlebar = new ElectronTitlebarWindows(); // Initialize title bar

  titlebar.appendTo(window.document.getElementsByClassName("drag")); // Append to drag DOM element
}

init(); // Init
