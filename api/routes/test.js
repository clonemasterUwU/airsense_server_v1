import pool from '../db.js'
const test = async ()=>{
  try{
  console.log(pool)
  const x = await pool
  const y = await (await pool).query("select 1")
  console.log(x)
  console.log(y)
  return x
}catch(err){
  console.log(err)
}
}
const test1 = async ()=>{
  try{
  console.log(pool)
  const x = await pool
  console.log(x)
  return x
}catch(err){
  console.log(err)
}
}
test()
 