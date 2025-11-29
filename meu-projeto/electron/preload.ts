import { contextBridge, ipcRenderer } from 'electron'

// Expõe APIs protegidas para o renderer process
contextBridge.exposeInMainWorld('electron', {
  // Exemplo: enviar mensagem ao main process
  send: (channel: string, data: any) => {
    const validChannels = ['toMain']
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data)
    }
  },
  // Exemplo: receber mensagem do main process
  receive: (channel: string, func: (...args: any[]) => void) => {
    const validChannels = ['fromMain']
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => func(...args))
    }
  }
})
