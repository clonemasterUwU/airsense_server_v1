import schedule from 'node-schedule'
import { dayCSVUpdate, gitUpdate } from './dayCSVUpdate.js'
import env from 'dotenv'
env.config({ path:"./debug.env" })

schedule.scheduleJob('csvDaily',{
  tz:'Asia/Ho_Chi_Minh',
  rule:'0 5 0 * * *'
},async()=>{
  await dayCSVUpdate()
  await gitUpdate()
})
