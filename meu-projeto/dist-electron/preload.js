import { contextBridge as s, ipcRenderer as i } from "electron";
s.exposeInMainWorld("electron", {
  // Exemplo: enviar mensagem ao main process
  send: (e, n) => {
    ["toMain"].includes(e) && i.send(e, n);
  },
  // Exemplo: receber mensagem do main process
  receive: (e, n) => {
    ["fromMain"].includes(e) && i.on(e, (l, ...o) => n(...o));
  }
});
