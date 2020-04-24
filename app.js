const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const url = require('url');
const path = require('path');

var window;

const template = [
    {
        label: "File",
        submenu: [
            {
                label: "Start",
                accelerator: 'CmdOrCtrl+S',
                click: () => window.webContents.send("start")
            }
        ]
    },
    {
        label: "Window",
        submenu: [
            { role: "close" },
            { role: "reload"},
            { role: 'toggledevtools' }
        ]
    }
]

app.allowRendererProcessReuse = true;

app.on("ready", () => {
    Menu.setApplicationMenu(Menu.buildFromTemplate(template))
    window = new BrowserWindow({
        show: false,
        webPreferences: {
            nodeIntegration: true
        },
        autoHideMenuBar: true,
        frame: false,
        resizable: false,
        width: 500,
        height: 300
    })
    window.loadURL(url.format({
        slashes: true,
        protocol: "file:",
        pathname: path.join(__dirname, "public", "index.html")
    }));
    window.on("ready-to-show", () => {
        window.show();
        window.webContents.send("start");
    })
})