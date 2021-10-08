import { sqlInit } from 'sql-cmd'
import initSqlJs from 'sql.js'

const SQL = await initSqlJs({
  // Required to load the wasm binary asynchronously. Of course, you can host it wherever you want
  // You can omit locateFile completely when running in node
  locateFile: (file) => {
    console.log(file)

    return `/${file}`
  },
})
const db = new SQL.Database()

export { db }

db.run(sqlInit)
export const tableNames = ['users', 'books']

export const tableSchema = {
  users: [
    {
      label: 'id',
    },
    { label: 'name' },
    { label: 'age' },
  ],
  books: [{ label: 'id' }, { label: 'name' }, { label: 'price' }],
}

export class QueryError extends Error {
  [Symbol.toStringTag] = 'QueryError'
}

export async function execSql(cmd: string) {
  try {
    // const res = await fetch('http://127.0.0.1:3001/sqlite', {
    //   method: 'post',
    //   body: JSON.stringify({ sql: cmd }),
    //   headers: {
    //     'content-type': 'application/json',
    //   },
    // }).then((res) => res.json())
    // return res as QueryExecResult[]
    return db.exec(cmd)
  } catch (e: any) {
    console.log(e)

    return new QueryError(e.message)
  }
}
