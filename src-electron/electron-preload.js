// import path from 'node:path'
// import fs from 'node:fs'
// import { fileURLToPath } from 'node:url'
import { contextBridge } from 'electron'
import dbLocal from 'db-local'
// const dbLocal = require('db-local')

// const currentDir = fileURLToPath(new URL('.', import.meta.url))

/**
 * This file is used specifically for security reasons.
 * Here you can access Nodejs stuff and inject functionality into
 * the renderer thread (accessible there through the "window" object)
 *
 * WARNING!
 * If you import anything from node_modules, then make sure that the package is specified
 * in package.json > dependencies and NOT in devDependencies
 *
 * Example (injects window.myAPI.doAThing() into renderer thread):
 *
 *   import { contextBridge } from 'electron'
 *
 *   contextBridge.exposeInMainWorld('myAPI', {
 *     doAThing: () => {}
 *   })
 *
 * WARNING!
 * If accessing Node functionality (like importing @electron/remote) then in your
 * electron-main.js you will need to set the following when you instantiate BrowserWindow:
 *
 * mainWindow = new BrowserWindow({
 *   // ...
 *   webPreferences: {
 *     // ...
 *     sandbox: false // <-- to be able to import @electron/remote in preload script
 *   }
 * }
 */

const date = new Date()

let day = date.getDate()
let month = date.getMonth() + 1
let year = date.getFullYear()

const suffix = `-temp-${day}-${month}-${year}`

contextBridge.exposeInMainWorld('shopApi', {
  createProduct: async () => {
    const { Schema } = new dbLocal({ path: './databases' })
    console.log(suffix)
    console.log(Schema)

    const User = Schema(`User${suffix}`, {
      name: { type: String, default: 'Customer' },
      username: { type: String },
      tag: { type: String },
    })

    const user = User.create({
      // _id: 1,
      username: 'Lennart',
      tag: 'Lennart#123',
      bag: { weapons: ['bow', 'katana'] },
    }).save()

    user.save()
    console.log(user)

    console.log('wokirg')
  },
  updateProduct: () => {},
  removeProduct: () => {},
  findProduct: () => {},
  // createProduct: () => {},
  // createProduct: () => {},
  // createProduct: () => {},
  // createProduct: () => {},
})
