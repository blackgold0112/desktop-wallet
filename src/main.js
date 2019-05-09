// Modules to control application life and create native browser window
const {
  app,
  Tray,
  Menu,
  BrowserWindow,
  Notification,
  ipcMain,
  session
} = require("electron");

// Import path
const path = require("path");

// Import windows badge
const Badge = require("electron-windows-badge");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// Init badge num.
let badgeNum = 0;

// Init tray.
let tray = null;

function createWindow() {
  app.setAppUserModelId(process.execPath); // Enable win notifications

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"), // Set preload
      onload: path.join(__dirname, "onload.js") // Set onload
    },
    titleBarStyle: "hiddenInset",
    frame: false,
    menu: false,
    resizable: false
  });

  // and load the index.html of the app.
  mainWindow.loadURL("https://summer.cash");

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  mainWindow.webContents.send(
    "cookies_available",
    session.defaultSession.cookies
  ); //Set cookies

  // Emitted when the window is closed.
  mainWindow.on("closed", function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  // Subscribe to the window focus event. When that happens, hide the badge
  mainWindow.on("focus", function() {
    badgeNum = 0; // Set badge

    if (app.dock) {
      // Check has dock
      app.dock.setBadge(""); // Reset badge
    } else {
      mainWindow.webContents.send("new_badge_count", null); // Reset badge
    }
  });

  ipcMain.on("sign_in_req", (event, msg) =>
    session.defaultSession.cookies.get(
      {
        url: "https://summer.cash",
        name: "user"
      },
      cookieData => (event.returnValue = JSON.parse(cookieData))
    )
  );

  ipcMain.on("sign_in", (event, msg) => {
    const user = JSON.parse(msg); // Parse user

    session.defaultSession.cookies.set(
      {
        url: "https://summer.cash",
        name: "user",
        value: JSON.stringify({
          username: user.username,
          token: user.token,
          address: user.address
        }),
        expirationDate: Math.floor(new Date().getTime() / 1000) + 1209600
      },
      error => {
        if (error) {
          // Check for errors
          console.error(error); // Log error
        }
      }
    ); // Set cookie
  });

  ipcMain.on("new_tx", (event, msg) => {
    const tx = JSON.parse(msg); // Parse MSG

    let notification; // Init notification buffer

    if (tx.payload !== "" && tx.payload !== undefined && tx.payload) {
      // Check has message
      notification = new Notification({
        title: Buffer.from(tx.payload, "base64").toString(), // Set title
        body: `Received ${tx.amount} SummerCash from ${tx.sender}.`, // Set body
        silent: false // Play noise
      });
    } else {
      notification = new Notification({
        title: `New Transaction`,
        body: `Received ${tx.amount} SummerCash from ${tx.sender}.`,
        silent: false // Play noise
      });
    }

    if (app.dock && !mainWindow.isFocused()) {
      // Check can config badge
      // Check should add badge
      badgeNum++; // Increment badge number

      app.dock.setBadge(badgeNum.toString()); // Set badge
    } else if (!app.dock && !mainWindow.isFocused()) {
      // Check no focus
      badgeNum++; // Increment badge number

      mainWindow.webContents.send("new_badge_count", badgeNum.toString()); // Set badge
    }

    notification.show(); // Show notification
  });

  if (process.platform === "win32") {
    // Check is windows
    tray = new Tray(path.join(__dirname, "images/icon.ico")); // Initialize tray
  } else {
    tray = new Tray(path.join(__dirname, "images/icon.png")); // Initialize tray
  }

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "SummerCash Wallet",
      type: "normal",
      click: function() {
        mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
      }
    }
  ]); // Create context menu

  tray.setToolTip("SummerCash Wallet"); // Set tooltip
  tray.setContextMenu(contextMenu); // Set context menu

  tray.on("click", function() {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
  }); // Set tray onclick

  if (!app.dock) {
    // Check no dock support
    new Badge(mainWindow, {}); // Create badge
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", function() {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", function() {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
