// @ts-check
const express = require('express')
const cors = require('cors')
const { default: initSqlJs } = require('sql.js')
const app = express()

app.use(cors())
app.use(express.json())

async function bootstrap() {
  const SQL = await initSqlJs({})
  const db = new SQL.Database()
  // NOTE: You can also use new SQL.Database(data) where
  // data is an Uint8Array representing an SQLite database file

  // Execute a single SQL string that contains multiple statements
  const sqlstr = `
  CREATE TABLE "users" ("id" integer,"name" varchar,"age" int, PRIMARY KEY (id));
  
  INSERT INTO "users" ("id", "name", "age") VALUES
  ('1', 'John', '12'),
  ('2', 'Tom', '24'),
  ('3', 'Adriana Barco', '24'),
  ('4', 'John Richardson', '24'),
  ('5', 'Martha Dawson', '24'),
  ('6', 'Niels Wilmsen', '24'),
  ('7', '杨红', '24'),
  ('8', 'Mercedes Pereira Roselló', '24')
  
  
  ;
  
  
  CREATE TABLE "books" ("id" integer,"name" varchar,"price" float, PRIMARY KEY (id));
  
  INSERT INTO "books" ("id", "name", "price") VALUES
  ('1', '码农翻身', '12.00'),
  ('2', '编码 - 隐匿于计算机背后的语言', '24.00');
  
  `
  db.run(sqlstr) // Run the query without returning anything

  app.post('/sqlite', async (req, res) => {
    try {
      const q = db.exec(req.body.sql)
      res.send(q)
    } catch (e) {
      res.status(500).json({
        message: e.message,
      })
    }
  })
}

bootstrap()

app.listen('3001', () => {
  console.log('Server is running on port 3001')
})
