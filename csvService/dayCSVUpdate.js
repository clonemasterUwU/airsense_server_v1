import mysql from 'promise-mysql'
import fs from 'fs'
import moment from 'moment-timezone'
import simpleGit from 'simple-git'
import promiseWriteCSV from './promiseCSV.js'
import promiseFileExist from './promiseFileExist.js'
import promiseWrite from './promiseWrite.js'
import getPool from './dbconfig.js'
const git =simpleGit(
  `/home/sparclab/TKH/airsense_data`
)
// to test if day-round work fine
// const now = Math.floor((Date.now()+7*1000*3600)/(1000*24*3600))*24*3600

const _truncate=(num,digit)=>{
  const d = Math.pow(10,digit)
  return (parseInt(num*d)/d).toFixed(digit)
}
const _HourCSVwrite = async(timeMarker,NodeId)=>{
  try{
    const dayRound = moment(timeMarker*1000).tz('Asia/Ho_Chi_Minh').startOf('day').format('YYYYMMDD')
    const filePath = `../airsense_data/${NodeId}-${dayRound}.csv`
    const fileExist = await promiseFileExist(filePath)
    const writeStream = fs.createWriteStream(filePath,{flags:'a'})
    const data = await (await getPool()).query(`SELECT NodeId,Time,Hum,Tem,Pm1,Pm2p5,Pm10,CO FROM AverageHour WHERE Time =${timeMarker} AND NodeId = '${NodeId}' `)
    for (let row=0;row<data.length;row++){
      data[row]['Pm2p5']=_truncate(data[row]['Pm2p5'],3)
      data[row]['Pm10']=_truncate(data[row]['Pm10'],3)
      data[row]['Pm1']=_truncate(data[row]['Pm1'],3)
      data[row]['Hum']=_truncate(data[row]['Hum'],3)
      data[row]['Tem']=_truncate(data[row]['Tem'],3)
      data[row]['CO']=_truncate(data[row]['CO'],3)
    }
    const jsondata = await JSON.parse(JSON.stringify(data))
    if(fileExist){
      await promiseWrite(writeStream,'\r\n')
    }
    await promiseWriteCSV(jsondata,{headers:!fileExist},writeStream)
    
    } catch(err){
      throw err
    }finally{
    
    }
}

const update_CSV=async(timeMarker)=>{
  try{
    timeMarker = timeMarker ||  Math.floor(Date.now()/(3600000)) *3600
    const activeNode = await (await getPool()).query(`SELECT DISTINCT NodeId FROM AverageHour WHERE Time =${timeMarker}`)
    for (let i=0;i<activeNode.length;i++){
      await _HourCSVwrite(timeMarker,activeNode[i]['NodeId'])
    }
    console.log(`Success CSV update at: ${Date.now()}`)
  }catch(err){
    console.log(`Fail CSV update at: ${Date.now()} due to: ${err}`)
  }
}
const gitUpdate=async(timeMarker)=>{
  try{
    timeMarker = timeMarker || Math.floor(Date.now()/(3600000)) *3600
    await git.fetch()
    await git.add('.')
    await git.commit(`Last update at  ${moment(timeMarker*1000).tz('Asia/Ho_Chi_Minh').format('HH:mm DD-MM-YYYY')}`)
    await git.push('origin','master')
    console.log(`Success git push at: ${moment().tz('Asia/Ho_Chi_Minh').format('HH:mm DD-MM-YYYY')}`)
  }catch(err){
    console.log(`Fail CSV push at: ${moment().tz('Asia/Ho_Chi_Minh').format('HH:mm DD-MM-YYYY')} due to: ${err}`)
  }
}

const DayCSVInit=async(dayStart)=>{
  try{
    let timeMarker = dayStart ? dayStart+3600*23 : moment().tz('Asia/Ho_Chi_Minh').startOf('hour').valueOf()/1000
    dayStart = dayStart || moment().tz('Asia/Ho_Chi_Minh').startOf('day').valueOf()/1000
    
    let start = dayStart
    while(start<=timeMarker){
    await update_CSV(start)
    start+=3600
    }
  }catch(err){
    console.log(err)
  }
}

const CSVInit=async()=>{
  try{
    let timeMarker = moment().tz('Asia/Ho_Chi_Minh').startOf('day').valueOf()/1000
    const startTimeDB = await (await getPool()).query(`SELECT MIN(Time) FROM AverageHour`)
    while(timeMarker>startTimeDB[0][`MIN(Time)`]){
      console.log(timeMarker)
      await DayCSVInit(timeMarker)
      await gitUpdate(timeMarker)
      timeMarker-=3600*24
    }
    await gitUpdate()
  }catch(err){
    console.log(err)
  }
}
export {update_CSV, gitUpdate, CSVInit}
//(Math.floor((Date.now()-17*1000*3600)/(1000*24*3600))*24-7)*3600
// CSVInit()
// // git.init().addRemote('origin',`git@github.com:clonemasterUwU/airsense_data.git`)
// console.log(moment(now*1000).tz('Asia/Ho_Chi_Minh').format())
// console.log(moment(Date.now()).tz('Asia/Ho_Chi_Minh').format('up\date for \day DD month DD year YYYY'))



// DayCSVInit()
// update_CSV()