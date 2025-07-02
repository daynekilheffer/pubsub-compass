import { Message, PubSub, Subscription } from '@google-cloud/pubsub'
import { BrowserWindow, Menu, app } from 'electron'
import { createIpcMain } from 'electron-typescript-ipc'
import path from 'node:path'
//@ts-expect-error squirrel doesn't have types
import started from 'electron-squirrel-startup'
import { Api, TopicHierarchy } from './ipc-api'

import { applicationMenu } from './app-menu'
import storage from './promising-storage'

const ipcMain = createIpcMain<Api>()

if (started) {
  app.quit()
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1240,
    height: 800,
    title: 'Pub/Sub Compass',
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  })
  Menu.setApplicationMenu(applicationMenu())

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL)
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`))
  }

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
  return mainWindow
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

app.whenReady().then(() => {
  const mainWindow = createWindow()

  process.env.PUBSUB_EMULATOR_HOST = 'localhost:8283'

  const pubsub = new PubSub({ projectId: 'local-psemu' })
  const subs: Record<string, { inst: Subscription; handler: (msg: Message) => void }> = {}

  ipcMain.handle('listTopics', async () => {
    const data = await pubsub.getTopics()
    const topics = data[0]
    return Promise.all<Promise<TopicHierarchy>>(
      topics.map<Promise<TopicHierarchy>>(async (t) => ({
        name: t.name.replace(/projects\/local-psemu\/topics\//, ''),
        subscriptions: await t.getSubscriptions().then((subscriptions) => {
          const sub = subscriptions[0]
          return sub.map((s) => ({
            id: s.name,
            name: s.name.replace(/projects\/local-psemu\/subscriptions\//, ''),
          }))
        }),
      })),
    )
  })
  ipcMain.handle('sendOnTopic', async (evt, name, payload, attrs = {}) => {
    const msgId = await pubsub.topic(name).publishMessage({
      json: payload,
      attributes: attrs,
    })
    console.debug('published', msgId)
  })

  ipcMain.handle('resetSubscriptions', () => {
    console.log('resetting subscriptions')
    Object.keys(subs).forEach((subName) => {
      subs[subName].inst.close()
      delete subs[subName]
    })
  })
  ipcMain.handle('startWatch', async (evt, subName) => {
    console.log('received watch event', subName)
    if (subs[subName]) {
      console.log('already watching')
      return
    }
    subs[subName] = {
      inst: pubsub.subscription(subName),
      handler: (msg) => {
        console.log('received', msg.id)
        msg.ack()
        mainWindow.webContents.send('subscribedMessage', {
          sub: subName,
          id: msg.id,
          data: msg.data.toString(),
          attrs: msg.attributes,
          published: msg.publishTime,
        })
      },
    }

    subs[subName].inst.on('message', subs[subName].handler)
  })
  ipcMain.handle('stopWatch', (evt, subName) => {
    console.log('received stop event', subName)
    if (!subs[subName]) {
      console.log('no subscriber to unsubscribe')
      return
    }
    subs[subName].inst.close()
    delete subs[subName]
  })

  ipcMain.handle('setActivity', (evt, activity) => {
    console.log('setting activity', activity)
    app.setBadgeCount(activity ? undefined : 0)
  })

  ipcMain.handle('storageGet', async (evt, key) => {
    const isInStorage = await storage.has(key)
    if (!isInStorage) {
      return []
    }
    return storage.get(key)
  })
  ipcMain.handle('storageSet', (evt, key, data) => {
    return storage.set(key, data)
  })
})
