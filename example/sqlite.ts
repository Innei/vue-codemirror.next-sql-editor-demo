// import initSqlJs from 'sql.js'

// const SQL = await initSqlJs({
//   // Required to load the wasm binary asynchronously. Of course, you can host it wherever you want
//   // You can omit locateFile completely when running in node
//   locateFile: (file) => `https://sql.js.org/dist/${file}`,
// })
// const db = new SQL.Database()
// // NOTE: You can also use new SQL.Database(data) where
// // data is an Uint8Array representing an SQLite database file

// // Execute a single SQL string that contains multiple statements
// let sqlstr = `
// CREATE TABLE "users" ("id" integer,"name" varchar,"age" int, PRIMARY KEY (id));

// INSERT INTO "users" ("id", "name", "age") VALUES
// ('1', 'John', '12'),
// ('2', 'Tom', '24');

// CREATE TABLE "books" ("id" integer,"name" varchar,"price" float, PRIMARY KEY (id));

// INSERT INTO "books" ("id", "name", "price") VALUES
// ('1', '码农翻身', '12.00'),
// ('2', '编码 - 隐匿于计算机背后的语言', '24.00');

// `
// db.run(sqlstr) // Run the query without returning anything

// export { db }
import { QueryExecResult } from 'sql.js'
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
    const res = await fetch('http://127.0.0.1:3001/sqlite', {
      method: 'post',
      body: JSON.stringify({ sql: cmd }),
      headers: {
        'content-type': 'application/json',
      },
    }).then((res) => res.json())
    return res as QueryExecResult[]
  } catch (e: any) {
    console.log(e)

    return new QueryError(e.message)
  }
}
