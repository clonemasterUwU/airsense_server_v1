
import mysql from 'promise-mysql'
import moment from 'moment-timezone'
import getPool from './dbconfig.js'

const _nowcast = (array)=>{
  if ((array[0]==null&&array[1]==null) || (array[2]==null&&array[1]==null) || (array[0]==null&&array[2]==null)) return 0
  let weight,result=0
  let max =Math.max(...array)
  let min =Math.min(...array.filter(x=>x!=null))
  min/max>1/2 ? weight =min/max:weight=1/2
  if (weight==1/2){
    for (let i=0; i<array.length; i++) result+=Math.pow(1/2,i+1)*array[i]
    return result
  }
  let num = 0,denum = 0
  for (let i=0; i<array.length; i++){
    if (array[i]==null) continue
    num+=Math.pow(weight,i)*array[i]
    denum+=Math.pow(weight,i)
  }
  if (denum==0) return 0
  return num/denum
}
const _rescale = (value,criteria_measure,aqi_measure)=>{
  if (value>=criteria_measure[criteria_measure.length-1]) return aqi_measure[aqi_measure.length-1]
  for (let i = criteria_measure.length-2;i>=0;i--){
    if(value>=criteria_measure[i]) return aqi_measure[i]+(value-criteria_measure[i])/(criteria_measure[i+1]-criteria_measure[i])*(aqi_measure[i+1]-aqi_measure[i])
  }
}
// let a =[null,10,11,12,13,14,15,16,17,18,19,10]
// console.log(_nowcast(a))
const _evaluate_AQI = (CO,Pm2p5_array,Pm10_array)=>{
  let CO_measure = [0,10000,30000,45000,60000,90000,120000,150000]
  let Pm2p5_measure = [0,25,50,80,150,250,350,500]
  let Pm10_measure = [0,50,150,250,350,420,500,600]
  let aqi_measure = [0,50,100,150,200,300,400,500]
  let Pm2p5 = _rescale(_nowcast(Pm2p5_array),Pm2p5_measure,aqi_measure)
  let Pm10 = _rescale(_nowcast(Pm10_array),Pm10_measure,aqi_measure)
  let CO_ = _rescale(CO,CO_measure,aqi_measure)
  let aqi_array = [Pm10,Pm2p5,CO_]
  let i = aqi_array.indexOf(Math.max(...aqi_array))
  switch(i){
    case 0:
      return {criteria:"Pm10",value:Pm10}
    case 1:
      return {criteria:"Pm2p5",value:Pm2p5}
    case 2:
      return {criteria:"CO",value:CO_}
  }
}
const truncated= (num) =>{
  return (Math.floor(num*100)/100).toFixed(2)
}
const _query_and_insert_AQI = async (pool, nodeId, timeMarker) => {
  try{
    let Pm10_array = []
    let Pm2p5_array = []
    const result = await pool.query('SELECT CO, Pm2p5, Pm10 from AverageHour where NodeId = ? and Time <= ? ORDER BY Time DESC LIMIT 12',[nodeId,timeMarker])
    for (let i=0; i<result.length;i++){
      Pm10_array.push(result[i].Pm10)
      Pm2p5_array.push(result[i].Pm2p5)
    }
    if (result[0]) {
      let CO = result[0].CO
      const {criteria,value} = _evaluate_AQI(CO,Pm2p5_array,Pm10_array)

      await pool.query('INSERT INTO AQI(NodeId,Time,AQI,Criteria) VALUES (?,?,?,?)',[`${nodeId}`,timeMarker,truncated(value),criteria])
      }
    } catch(err){
    if (err.code !='ER_DUP_ENTRY') throw err
  }
}

const update_db_AQI = async () => {
  let timeMarker = Math.floor(Date.now()/(3600000)) *3600
  try{
    const pool = await getPool()
    const NodeIdArray = await pool.query("SELECT NodeId from Node where active = true;")
    for ( let i =0; i <NodeIdArray.length; i++){
      // for( let j=0; j<12; j++){
        await _query_and_insert_AQI(pool,NodeIdArray[i].NodeId,timeMarker) //-3600*j)
      // }
    }
    console.log(`Success update AQI database at: ${moment(timeMarker*1000).tz('Asia/Ho_Chi_Minh').format('HH DD MM YYYY')}`)
  }catch(err){
    console.log(`Fail update AQI database at: ${moment(timeMarker*1000).tz('Asia/Ho_Chi_Minh').format('HH DD MM YYYY')} due to:\n${err}`)
  }
}

export { update_db_AQI as default, _nowcast }