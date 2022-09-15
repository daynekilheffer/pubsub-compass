// eslint-disable-next-line import/no-extraneous-dependencies
const { app, BrowserWindow, ipcMain } = require('electron')
const { PubSub } = require('@google-cloud/pubsub')

const storage = require('electron-json-storage')

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// eslint-disable-next-line global-require
if (require('electron-squirrel-startup')) {
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
      enableRemoteModule: true,
      // eslint-disable-next-line no-undef
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  })

  // and load the index.html of the app.
  // eslint-disable-next-line no-undef
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
  return mainWindow
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  const mainWindow = createWindow()

  process.env.PUBSUB_EMULATOR_HOST = 'localhost:8283'

  const pubsub = new PubSub({ projectId: 'local-psemu' })
  const subs = {}

  ipcMain.handle('list-topics', async () =>
    pubsub.getTopics().then((data) => {
      const topics = data[0]
      return Promise.all(
        topics.map(async (t) => ({
          name: t.name.replace(/projects\/local-psemu\/topics\//, ''),
          subscriptions: await t.getSubscriptions().then((subscriptions) => {
            const sub = subscriptions[0]
            return sub.map((s) => ({
              name: s.name.replace(
                /projects\/local-psemu\/subscriptions\//,
                '',
              ),
            }))
          }),
        })),
      )
    }),
  )
  ipcMain.handle('send-to-topic', async (evt, name, payload, attrs = {}) =>
    pubsub.topic(name).publishMessage({
      json: payload,
      attributes: attrs,
    }),
  )
  ipcMain.handle('reset-subscriptions', () => {
    console.log('resetting subscriptions')
    Object.keys(subs).forEach((subName) => {
      subs[subName].inst.close()
      delete subs[subName]
    })
  })
  ipcMain.on('stop-watch', (evt, subName) => {
    console.log('received stop event', subName)
    if (!subs[subName]) {
      console.log('no subscriber to unsubscribe')
      return
    }
    subs[subName].inst.close()
    delete subs[subName]
  })
  ipcMain.handle('watch', async (evt, subName) => {
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
        mainWindow.webContents.send('subscribed-message', {
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

  ipcMain.handle(
    'storage-get',
    (evt, key) =>
      new Promise((resolve, reject) => {
        storage.get(key, (error, data) => {
          if (error) {
            return reject(error)
          }
          resolve(data)
        })
      }),
  )
  ipcMain.handle('storage-set', (evt, key, data) => storage.set(key, data))
})

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
