import express from 'express'
import pool from '../dbconfig.js'
const router = express.Router()
router.get('/',(req,res)=>{
    res.send("Hello world")
})
router.get('/device',async (req,res)=>{
  try{
    const activeNode = await (await pool).query("select * from node where active=true")
    const inactiveNode = await (await pool).query("select * from node where active=false")
    res.send({activeNode:activeNode, inactiveNode:inactiveNode})
  }catch(err){
    res.status(500).send("Internal Server Error")
  }
})
router.get('/aqi', async(req,res)=>{
  try{
    const timeMarker = Math.floor(Date.now()/1000/3600)*3600
    const aqi = await (await pool).query("select * from aqi where time =?",[timeMarker])
    res.send(aqi)
  }catch(err){
    res.status(500).send("Internal Server Error")
  }
})


router.get('/data', async(req,res)=>{
  try{
    const timeMarker = Math.floor(Date.now()/1000/3600)*3600
    let result = {"AVG(CO)":[],"AVG(Pm1)":[],"AVG(Pm2p5)":[],"AVG(Pm10)":[],"AVG(Hum)":[],"AVG(Tem)":[]}
    for ( let i =0;i<12;i++){
    const data = await (await pool).query("select AVG(CO),AVG(Pm1),AVG(Pm2p5),AVG(Pm10),AVG(Hum),AVG(Tem) from AverageHour where Time = ?",[timeMarker-3600*i])
      for (let j in data[0]){
        result[j].push(data[0][j])
      }
    }
    res.send(result)
  }catch(err){
    console.log(err)
    res.status(500).send("Internal Server Error")
  }
})
export default router