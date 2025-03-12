import { app, BrowserWindow } from 'electron'
import path from 'node:path'
import os from 'node:os'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'

// needed in case process  is undefined under Linux
const platform = process.platform || os.platform()

const currentDir = fileURLToPath(new URL('.', import.meta.url))

let mainWindow

async function createWindow() {
  let date = new Date()
  date = date.toISOString().split('T')[0]

  const suffix = `-temp-${date}`
  /**
   * Check and delete previous files.
   */

  // const dbFolder = path.resolve(currentDir, 'databases')
  const deleteFiles = (folderPath) => {
    // Read all files in the directory
    fs.readdir(folderPath, (err, files) => {
      if (err) {
        console.error('Error reading the directory:', err)
        return
      }

      // Iterate over each file in the directory
      files.forEach((file) => {
        const filePath = path.join(folderPath, file)
        // console.log(filePath)
        console.log('wokring ', file)
        // Check if the file matches the condition to be deleted
        if (filePath.includes('-temp-') && !filePath.includes(suffix)) {
          // Delete the file if it matches the condition
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error('Error deleting file:', filePath, err)
            } else {
              console.log(`Deleted: ${filePath}`)
            }
          })
        }
      })
    })
  }

  deleteFiles('./databases')

  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    icon: path.resolve(currentDir, 'icons/icon.png'), // tray icon
    width: 1200,
    height: 800,
    useContentSize: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: true,
      // More info: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/electron-preload-script
      preload: path.resolve(
        currentDir,
        path.join(
          process.env.QUASAR_ELECTRON_PRELOAD_FOLDER,
          'electron-preload' + process.env.QUASAR_ELECTRON_PRELOAD_EXTENSION,
        ),
      ),
    },
  })
  mainWindow.maximize()
  if (process.env.DEV) {
    mainWindow.loadURL(process.env.APP_URL)
  } else {
    mainWindow.loadFile('index.html')
  }

  if (process.env.DEBUGGING) {
    // if on DEV or Production with debug enabled
    mainWindow.webContents.openDevTools({ mode: 'detach' })
  } else {
    // we're on production; no access to devtools pls
    mainWindow.webContents.on('devtools-opened', () => {
      mainWindow.webContents.closeDevTools()
    })
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
