import dbLocal from 'db-local'

export const dbPath = './databases'
export const reportsPath = './reports'

const { Schema } = new dbLocal({ path: dbPath })

export { Schema }

let date = new Date()
date = date.toISOString().split('T')[0]

const suffix = `-temp-${date}`

export { suffix, date }
