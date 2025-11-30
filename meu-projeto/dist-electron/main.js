import { nativeTheme as a, app as n, BrowserWindow as t } from "electron";
import { fileURLToPath as c } from "node:url";
import o from "node:path";
const s = o.dirname(c(import.meta.url));
process.env.APP_ROOT = o.join(s, "..");
const i = process.env.VITE_DEV_SERVER_URL, R = o.join(process.env.APP_ROOT, "dist-electron"), r = o.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = i ? o.join(process.env.APP_ROOT, "public") : r;
a.themeSource = "light";
let e;
function l() {
  e = new t({
    width: 1200,
    height: 800,
    show: !1,
    icon: o.join(process.env.VITE_PUBLIC, "vite.svg"),
    webPreferences: {
      preload: o.join(s, "preload.js"),
      nodeIntegration: !1,
      contextIsolation: !0
    }
  }), e.maximize(), e.show(), i ? (e.loadURL(i), e.webContents.openDevTools()) : e.loadFile(o.join(r, "index.html")), e.on("closed", () => {
    e = null;
  });
}
n.whenReady().then(l);
n.on("window-all-closed", () => {
  process.platform !== "darwin" && (n.quit(), e = null);
});
n.on("activate", () => {
  t.getAllWindows().length === 0 && l();
});
export {
  R as MAIN_DIST,
  r as RENDERER_DIST,
  i as VITE_DEV_SERVER_URL
};
