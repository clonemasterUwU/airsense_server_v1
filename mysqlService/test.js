import _update_db_AQI from './HourAQIUpdate.js'
import mysql from 'promise-mysql'
import fastcsv from 'fast-csv'
import fs from 'fs'
const ws = fs.createWriteStream('../../airsense_data/test.csv')
import env from 'dotenv'
env.config({ path:"../debug.env" })


const _createPool = async()=>{
  try{
    const pool = await mysql.createPool({
      host:process.env.DB_HOST,
      user:process.env.DB_USER,
      password:process.env.DB_PASS,
      database:process.env.DB_NAME,
      connectionLimit:5,
      port:process.env.DB_PORT,
    })
    return pool
  } catch (err){
    console.log(err)
  }
}
const truncate=(num,digit)=>{
  const d = Math.pow(10,digit)
  return (parseInt(num*d)/d).toFixed(digit)
}
const main = async()=>{
  const now = Math.floor(Date.now()/(3600000)) *3600
  const pool = await _createPool()
  const data = await pool.query(`SELECT NodeId,Time,Hum,Tem,Pm1,Pm2p5,Pm10,CO FROM AverageHour WHERE Time > ${now-3600*12} `)
  for (let row=0;row<data.length;row++){
    data[row]['Pm2p5']=truncate(data[row]['Pm2p5'],3)
    data[row]['Pm10']=truncate(data[row]['Pm10'],3)
    data[row]['Pm1']=truncate(data[row]['Pm1'],3)
    data[row]['Hum']=truncate(data[row]['Hum'],3)
    data[row]['Tem']=truncate(data[row]['Tem'],3)
    data[row]['CO']=truncate(data[row]['CO'],3)
  }
  console.log(data)
  const jsondata = await JSON.parse(JSON.stringify(data))
  fastcsv.write(jsondata,{headers:true}).on('finish',()=>console.log('done')).pipe(ws)
}
main()