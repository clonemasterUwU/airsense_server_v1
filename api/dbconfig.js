import mysql from 'promise-mysql'

export default mysql.createPool({
      host:process.env.DB_HOST,
      user:process.env.DB_USER,
      password:process.env.DB_PASS,
      database:process.env.DB_NAME,
      connectionLimit:100,
      port:process.env.DB_PORT,
    })
