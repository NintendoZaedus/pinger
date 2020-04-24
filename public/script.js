const customTitlebar = require('custom-electron-titlebar');
const ping = require('ping');
const { remote, ipcRenderer } = require('electron');
const { Chart } = require('chart.js');

let interval;
const templateStop = 
[
    {
        label: "File",
        submenu: [
            {
                label: "Stop",
                accelerator: 'CmdOrCtrl+S',
                click: () => remote.BrowserWindow.getAllWindows()[0].webContents.send("stop")
            }
        ]
    },
    {
        label: "Window",
        submenu: [
            { role: "close" },
            { role: "reload"}
        ]
    }
]
const templateStart = [
    {
        label: "File",
        submenu: [
            {
                label: "Start",
                accelerator: 'CmdOrCtrl+S',
                click: () => remote.BrowserWindow.getAllWindows()[0].webContents.send("start")
            }
        ]
    },
    {
        label: "Window",
        submenu: [
            { role: "close" },
            { role: "reload"}
        ]
    }
]

var bar = new customTitlebar.Titlebar({
    backgroundColor: customTitlebar.Color.fromHex('#404040'),
    unfocusEffect: true,
    maximizable: false
});

const ctx = document.getElementsByTagName('canvas')[0].getContext("2d");

var myLineChart = new Chart(ctx, {
    type: 'line',
    data: {
        //labels: ['Ping'],
        datasets: [{
            label: 'Ping',
            data: [],
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        },
        elements: {
            point:{
                radius: 0
            }
        },
        legend: {
            display: false
        }
    },
});
setInterval(() => {
    if(document.getElementsByClassName("container-after-titlebar").length > 0) {
        if(document.getElementsByClassName("container-after-titlebar")[0].style.overflow != "hidden") {
            document.getElementsByClassName("container-after-titlebar")[0].style.overflow = "hidden";
        }
    }
}, 1)

function genLabels(n) {
    var arr = [];
    for(a = 0; a < n; a++) {
        arr.push("");
    }
    return arr;
}
function start() {
    bar.updateMenu(remote.Menu.buildFromTemplate(templateStop))
    interval = setInterval(async () => {
        var resp = await ping.promise.probe("krunker.io");
        console.log(resp.time)
        if(myLineChart.data.datasets[0].data.length > 40) myLineChart.data.datasets[0].data.pop();
        myLineChart.data.labels = genLabels(myLineChart.data.datasets[0].data.length - 1);
        myLineChart.data.datasets[0].data.unshift(
            {
                t: "Ping",
                y: parseFloat(resp.time),
                x: myLineChart.data.datasets[0].data.length,
                f: false
            }
        );
        myLineChart.update()
    }, 500);
}
ipcRenderer.on("start", start)

ipcRenderer.on("stop", () => {
    clearInterval(interval);
    myLineChart.data.labels = []
    myLineChart.data.datasets[0].data = []
    bar.updateMenu(remote.Menu.buildFromTemplate(templateStart))
})

window.onload = start;