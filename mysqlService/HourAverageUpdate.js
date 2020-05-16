// 'use-strict'
import mysql from 'promise-mysql'
import env from 'dotenv'
env.config({ path:"../debug.env" })
let pool
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
    await pool.query(
      `CREATE TABLE IF NOT EXISTS 
        AverageHour (NodeId VARCHAR(20) NOT NULL, 
        Time BIGINT NOT NULL,
        CO DOUBLE,
        Pm1 DOUBLE,
        PM2p5 DOUBLE,
        Pm10 DOUBLE,
        Hum DOUBLE,
        Tem DOUBLE,
        PRIMARY KEY (NodeId, Time)
        )`
    )
    return pool
  }catch(err){
    throw err
  }
}


const _Get_Data_Hour = async (pool,timeEnd,nodeId,criteria) =>{
  try{
    const Data_Query  = pool.query(`SELECT AVG(`+criteria+`) from data WHERE NodeId = ? AND Time BETWEEN ? AND ? `,[nodeId,timeEnd-3600,timeEnd])
    const Data_Result = await (Data_Query)
    return Data_Result[0][`AVG(${criteria})`]
    
  } catch(err){
    console.log(err)
  }
}
const _HourAverage_Update = async (pool, timeMarker, nodeId) =>{
  try{
    let CO_Data = await _Get_Data_Hour(pool,timeMarker,nodeId,'CO')
    let Hum_Data = await _Get_Data_Hour(pool,timeMarker,nodeId,'Hum')
    let Pm1_Data = await _Get_Data_Hour(pool,timeMarker,nodeId,'Pm1')
    let Tem_Data = await _Get_Data_Hour(pool,timeMarker,nodeId,'Tem')
    let Pm2p5_Data = await _Get_Data_Hour(pool,timeMarker,nodeId,'Pm2p5')
    let Pm10_Data = await _Get_Data_Hour(pool,timeMarker,nodeId,'Pm10')
    await pool.query(`INSERT INTO averagehour  
      (NodeId, Time, CO, Hum, Pm1,Pm10,Pm2p5,Tem) 
      VALUES (?,?,?,?,?,?,?,?)`,
      [nodeId,timeMarker,CO_Data,Hum_Data,Pm1_Data,Pm10_Data,Pm2p5_Data,Tem_Data])
  }catch(err){
    if (err.code !='ER_DUP_ENTRY') throw new Error(err) 
  }
}

const _HourAverage_Init = async (pool, timeMarker, nodeId) =>{
  try{
    pool=await _createPool()
    for (let i=0; i<24 ; i++ ){
      let CO_Data = await _Get_Data_Hour(pool,timeMarker-i*3600,nodeId,'CO')
      let Hum_Data = await _Get_Data_Hour(pool,timeMarker-i*3600,nodeId,'Hum')
      let Pm1_Data = await _Get_Data_Hour(pool,timeMarker-i*3600,nodeId,'Pm1')
      let Tem_Data = await _Get_Data_Hour(pool,timeMarker-i*3600,nodeId,'Tem')
      let Pm2p5_Data = await _Get_Data_Hour(pool,timeMarker-i*3600,nodeId,'Pm2p5')
      let Pm10_Data = await _Get_Data_Hour(pool,timeMarker-i*3600,nodeId,'Pm10')
      await pool.query(`INSERT INTO averagehour  
        (NodeId, Time, CO, Hum, Pm1,Pm10,Pm2p5,Tem) 
        VALUES (?,?,?,?,?,?,?,?)`,
        [nodeId,timeMarker-i*3600,CO_Data,Hum_Data,Pm1_Data,Pm10_Data,Pm2p5_Data,Tem_Data])
      console.log("Init:  "+ nodeId + (timeMarker-i*3600))
    }
  }catch(err){
    if (err.code !='ER_DUP_ENTRY') throw err
  }
} 
const update_db_HourAverage = async()=>{
  let timeMarker = Math.floor(Date.now()/(3600000)) *3600
  try{
    pool = await _createPool()
    const NodeIdQuery = pool.query("SELECT NodeId from Node where active = true;")
    const NodeIdArray = await(NodeIdQuery)
    for ( let i =0; i <NodeIdArray.length; i++){
      _HourAverage_Update(pool,timeMarker,NodeIdArray[i].NodeId)
      // run when init
      // _HourAverage_Init(pool,timeMarker,NodeIdArray[i].NodeId)
    }
    return 1
  }catch(err){
    console.log(err)
    return 0
  }
}

export default update_db_HourAverage

// setTimeout(()=>console.log("Hourly updated at: " ,new Date(timeMarker*1000)),3000)