const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const url = require('url');
const path = require('path');

function handleSquirrelEvent(application) {
    if (process.argv.length === 1) {
        return false;
    }

    const ChildProcess = require('child_process');
    const path = require('path');

    const appFolder = path.resolve(process.execPath, '..');
    const rootAtomFolder = path.resolve(appFolder, '..');
    const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
    const exeName = path.basename(process.execPath);

    const spawn = function(command, args) {
        let spawnedProcess, error;

        try {
            spawnedProcess = ChildProcess.spawn(command, args, {
                detached: true
            });
        } catch (error) {}

        return spawnedProcess;
    };

    const spawnUpdate = function(args) {
        return spawn(updateDotExe, args);
    };

    const squirrelEvent = process.argv[1];
    switch (squirrelEvent) {
        case '--squirrel-install':
        case '--squirrel-updated':
            // Optionally do things such as:
            // - Add your .exe to the PATH
            // - Write to the registry for things like file associations and
            //   explorer context menus

            // Install desktop and start menu shortcuts
            spawnUpdate(['--createShortcut', exeName]);

            setTimeout(application.quit, 1000);
            return true;

        case '--squirrel-uninstall':
            // Undo anything you did in the --squirrel-install and
            // --squirrel-updated handlers

            // Remove desktop and start menu shortcuts
            spawnUpdate(['--removeShortcut', exeName]);

            setTimeout(application.quit, 1000);
            return true;

        case '--squirrel-obsolete':
            // This is called on the outgoing version of your app before
            // we update to the new version - it's the opposite of
            // --squirrel-updated

            application.quit();
            return true;
    }
};

if(handleSquirrelEvent(app)) {
    return;
}

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