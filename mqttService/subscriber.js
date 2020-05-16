import mqtt from 'mqtt'
import mysql from 'mysql'
import env from 'dotenv'
env.config({ path:"./debug.env" })

const pool = mysql.createPool({
  host:process.env.DB_HOST,
  user:process.env.DB_USER,
  password:process.env.DB_PASS,
  database:process.env.DB_NAME,
  connectionLimit:5,
  port:process.env.DB_PORT,
})
const insertData =(data)=>{
  const {NodeId, DATA:{ CO,Hum,Pm1,Pm10,Pm2p5,Time,Tem }} = data;
  pool.query(
    `INSERT INTO Data(NodeId, Time, CO, Hum, Pm1,Pm10,Pm2p5,Tem) VALUES (?,?,?,?,?,?,?,?)`,
    [NodeId,Date.now()/1000,CO,Hum,Pm1,Pm10,Pm2p5,Tem],
    (err)=>{
      if (err &&err.code !='ER_DUP_ENTRY') console.log(err)
    }
  )
}
const Client = mqtt.connect(process.env.MQTT_HOST,{
  port:process.env.MQTT_PORT,
  username:process.env.MQTT_USER,
  password:process.env.MQTT_PASS,
})
Client.on("connect", ()=>{
  Client.subscribe(process.env.MQTT_TOPIC,(err, granted)=>{
    if (err) console.log(err)
    else console.log("Access Granted")
  })
})
Client.on("message",(topic,message)=>{
  const payload = message.toString()
  const result = JSON.parse(payload)
  if(result.NodeId && result.DATA.Time){
    insertData(result)
  }
})

