import { app, BrowserWindow } from "electron";
import * as path from "path";
// app.commandLine.appendSwitch('remote-debugging-port', '9222')
const createWindow = () => {
    const win = new BrowserWindow({
        width: 1400,
        height: 700,
    });
    win.loadFile(path.join(__dirname, "..", "index.html"));
};
app.whenReady().then(() => {
    createWindow();
});
//# sourceMappingURL=main.js.map