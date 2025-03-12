import dbLocal from 'db-local'

const { Schema } = new dbLocal({ path: './databases' })

export { Schema }

let date = new Date()
date = date.toISOString().split('T')[0]

const suffix = `-temp-${date}`
export { suffix, date }
