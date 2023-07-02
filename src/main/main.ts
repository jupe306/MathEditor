const { app, BrowserWindow } = require("electron");
const path = require("path");

const createWindow = (): void => {
    const win = new BrowserWindow({
        width: 1400,
        height: 700,
    });
    win.removeMenu();
    win.loadFile(path.join(__dirname, "..", "index.html"));
}

app.whenReady().then((): void => {
    createWindow()
});
