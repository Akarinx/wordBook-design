import { app, BrowserWindow, ipcMain, Menu, shell, Tray } from "electron";
import path from "path";
import { format as formatUrl } from "url";

const isDevelopment = process.env.NODE_ENV !== "production";

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let loginWindow: BrowserWindow | null;
let mainWindow: BrowserWindow | null;
let trayClose = false
let iconPath: string
let appTray: Tray | null
let contextMenu: Menu | null
const singleLog = app.requestSingleInstanceLock()

// 创建登陆窗口
function createLoginWindow() {
  if (loginWindow) return
  const window = new BrowserWindow({
    show: false,
    height: 360,
    width: 300,
    maxHeight: 360,
    maxWidth: 300,
    useContentSize: true,
    frame: false, // 无边框
    transparent: true, // 透明
    // fullscreen: true, // 全屏,
    resizable: false,
    maximizable: false,
    minimizable: false,
    webPreferences: {
      nodeIntegration: true
    },
  });

  if (isDevelopment) {
    window.webContents.openDevTools();
  }

  if (isDevelopment) {
    window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}/#login`);
  } else {
    window.loadURL(formatUrl({
      pathname: path.join(__dirname, "index.html#login"),
      protocol: "file",
      slashes: true
    }));
  }

  window.once('ready-to-show', () => {
    window.show()
  })

  window.on("closed", () => {
    loginWindow = null;
  });

  window.webContents.on("devtools-opened", () => {
    window.focus();
    setImmediate(() => {
      window.focus();
    });
  });

  loginWindow = window;
}

// 创建主窗口
function createMainWindow() {
  if (mainWindow) return
  const window = new BrowserWindow({
    show: true,
    height: 1000,
    width: 1600,
    minWidth: 900,
    minHeight: 600,
    useContentSize: true,
    frame: false, // 无边框
    transparent: true, // 透明
    // fullscreen: true, // 全屏
    webPreferences: {
      nodeIntegration: true
    },
  })
  if (isDevelopment) {
    window.webContents.openDevTools();
  }

  if (isDevelopment) {
    window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);
  } else {
    window.loadURL(formatUrl({
      pathname: path.join(__dirname, "index.html"),
      protocol: "file",
      slashes: true
    }));
  }
  window.on('close', (event) => {
    if (!trayClose) {
      // 最小化
      window.hide()
      window.setSkipTaskbar(true)
      event.preventDefault()
    }
  })
  window.on('closed', () => {
    mainWindow = null
  })
}

//设置托盘菜单
function createTray() {
  trayClose = false
  iconPath = path.join(__dirname, '/static').replace(/\\/g, '\\\\')
  let trayMenuTemplate = [
    {
      label: '托盘闪',
      click: function () {

      }
    },
    {
      label: '关于项目',
      click: function () {
        // 打开外部链接
        shell.openExternal('https://github.com/Akarinx/wordBook-design')
      }
    },
    {
      label: '退出',
      click: function () {
        // 退出
        trayClose = true
        app.quit()
      }
    }
  ]
  appTray = new Tray(`${iconPath}/bb.png`)

  // 图标的上上下文
  contextMenu = Menu.buildFromTemplate(trayMenuTemplate)

  // 设置此托盘图标的悬停提示内容
  appTray.setToolTip('背单词吧')

  // 设置此图标的上下文菜单
  appTray.setContextMenu(contextMenu)
}

// 设置单例化
if (!singleLog) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // 当运行第二个实例时,将会聚焦到mainWindow这个窗口
    // if (mainWindow) {
    //     if (mainWindow.isMinimized()) mainWindow.restore()
    //     mainWindow.focus()
    // }
    if (loginWindow) {
      loginWindow.focus()
    }
  })

  app.on("ready", () => {
    createLoginWindow();
    createTray();
  });

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

  app.on("activate", () => {
    if (loginWindow === null) {
      createLoginWindow();
    }
  });

  ipcMain.on('openMainWindow', () => {
    if (!mainWindow) {
      createMainWindow()
    }

    if (loginWindow) {
      loginWindow.destroy()
    }

  })
}

