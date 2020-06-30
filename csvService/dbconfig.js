import mysql from 'promise-mysql'
import env from 'dotenv'
env.config({ path:"./debug.env" })
let pool
const getPool = async() =>{
  if (pool) return pool
  pool = await mysql.createPool({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASS,
    database:process.env.DB_NAME,
    connectionLimit:5,
    port:process.env.DB_PORT,
  })
  return pool
}
export default getPool