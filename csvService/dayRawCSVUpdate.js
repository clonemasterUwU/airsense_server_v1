import mysql from 'promise-mysql'
import fs from 'fs'
import moment from 'moment-timezone'
import simpleGit from 'simple-git'
import promiseWriteCSV from './promiseCSV.js'
import promiseFileExist from './promiseFileExist.js'
import promiseWrite from './promiseWrite.js'
import getPool from './dbconfig.js'
const git =simpleGit(
  `/home/sparclab/TKH/airsense_data_raw`
)
// to test if day-round work fine
// const now = Math.floor((Date.now()+7*1000*3600)/(1000*24*3600))*24*3600

const _truncate=(num,digit)=>{
  const d = Math.pow(10,digit)
  return (parseInt(num*d)/d).toFixed(digit)
}
const _HourCSVwrite = async(timeMarker,NodeId)=>{
  try{
    const monthRound = moment(timeMarker*1000).tz('Asia/Ho_Chi_Minh').startOf('month').format('MM-YYYY')
    const filePath = `../airsense_data_raw/${NodeId}-${monthRound}.csv`
    const fileExist = await promiseFileExist(filePath)
    const writeStream = fs.createWriteStream(filePath,{flags:'a'})
    const data = await (await getPool()).query(`SELECT NodeId,Time,Hum,Tem,Pm1,Pm2p5,Pm10,CO FROM Data WHERE Time BETWEEN ${timeMarker-3600} AND ${timeMarker-1} AND NodeId = '${NodeId}' `)
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

const RawCSVUpdate=async(timeStart)=>{
  try{
    timeStart=timeStart || Math.floor(Date.now()/(3600000)) *3600
    const activeNode = await (await getPool()).query(`SELECT DISTINCT NodeId FROM Data WHERE Time BETWEEN ${timeStart-3600} AND ${timeStart-1}`)
    for (let i=0;i<activeNode.length;i++){
      await _HourCSVwrite(timeStart,activeNode[i]['NodeId'])
    }
    console.log(`Success CSV update at: ${Date.now()}`)
  
    // console.log(moment(timeStart*1000).tz('Asia/Ho_Chi_Minh').format('HH:mm DD-MM-YYYY'))
  }catch(err){
    console.log(`Fail RawCSV update at: ${Date.now()} due to: ${err}`)
  }
}
const RawGitUpdate=async(timeMarker)=>{
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

const MonthCSVInit=async(monthStart)=>{
  try{
    const start = moment(monthStart).tz('Asia/Ho_Chi_Minh').valueOf()/1000
    const end =moment(monthStart).tz('Asia/Ho_Chi_Minh').endOf('month').valueOf()/1000
    const TimeQuery = await (await getPool()).query(`SELECT MAX(Time), MIN(Time) FROM Data WHERE Time BETWEEN ${start} AND ${end}`)

    let DB_Start=moment(TimeQuery[0]['MIN(Time)']*1000).endOf('hour').valueOf()/1000
    const DB_End=moment(TimeQuery[0]['MAX(Time)']*1000).startOf('hour').valueOf()/1000
    while (DB_End>=DB_Start){
      await RawCSVUpdate(DB_Start)
      DB_Start+=3600
    }
    // console.log(`First:${TimeQuery[0]['MIN(Time)']}  Last:${TimeQuery[0]['MAX(Time)']}  Start:${start}  End:${end}`)
    // let timeMarker = dayStart ? dayStart+3600*23 : moment().tz('Asia/Ho_Chi_Minh').startOf('hour').valueOf()/1000
    // dayStart = dayStart || moment().tz('Asia/Ho_Chi_Minh').startOf('day').valueOf()/1000
    
    // let start = dayStart
    // while(start<=timeMarker){
    // await update_CSV(start)
    // start+=3600
    // }
  }catch(err){
    console.log(err)
  }
}

const CSVInit=async()=>{
  try{
    const monthEnd = moment().tz('Asia/Ho_Chi_Minh').startOf('month')
    const startTimeDB = await(await getPool()).query(`SELECT MIN(Time) FROM Data`)
    let monthStart = moment(startTimeDB[0][`MIN(Time)`]*1000).tz('Asia/Ho_Chi_Minh').startOf('month')
    while(monthEnd.valueOf()>=monthStart.valueOf()){
      await MonthCSVInit(monthStart.valueOf())
      monthStart = monthStart.add(1,'month')
    }
  }catch(err){
    console.log(err)
  }
}
export {RawCSVUpdate, RawGitUpdate, CSVInit}
//(Math.floor((Date.now()-17*1000*3600)/(1000*24*3600))*24-7)*3600
// CSVInit()
// // git.init().addRemote('origin',`git@github.com:clonemasterUwU/airsense_data.git`)
// console.log(moment(now*1000).tz('Asia/Ho_Chi_Minh').format())
// console.log(moment(Date.now()).tz('Asia/Ho_Chi_Minh').format('up\date for \day DD month DD year YYYY'))



// DayCSVInit()
// update_CSV()
