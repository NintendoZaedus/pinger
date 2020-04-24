const { app, BrowserWindow } = require('electron');
const url = require('url');
const path = require('path');

var window;

app.on("ready", () => {
    window = new BrowserWindow({
        show: false
    })
    window.loadURL(url.format({
        slashes: true,
        protocol: "file:",
        pathname: path.join(__dirname, "public", "index.html")
    }));
    window.on("ready-to-show", () => {
        window.show();
    })
})