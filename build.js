var electronInstaller = require('electron-winstaller');
const path = require('path');

resultPromise = electronInstaller.createWindowsInstaller({
    appDirectory: './dist/pinger-win32-x64',
    outputDirectory: './dist/pinger-installers',
    authors: 'Zaedus',
    exe: './Pinger.exe',
    iconUrl: path.join(__dirname, "./build/icon.ico"),
    name: "Pinger",
    setupIcon: path.join(__dirname, "./build/icon.ico"),
    loadingGif: path.join(__dirname, "./build/loading.gif")
});
console.log("Building the app!");

resultPromise.then(() => {
    console.log("Successfully built!");
}, (e) => {
    console.log(`Well, sometimes you are not so lucky: ${e.message}`);
});