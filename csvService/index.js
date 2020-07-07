import schedule from 'node-schedule'
import { update_CSV, gitUpdate } from './dayCSVUpdate.js'
import { RawCSVUpdate, RawGitUpdate } from './dayRawCSVUpdate.js'
import env from 'dotenv'
env.config({ path:"./debug.env" })

schedule.scheduleJob('csvDaily',{
  tz:'Asia/Ho_Chi_Minh',
  rule:'0 1 * * * *'
},async()=>{
  await update_CSV()
  await gitUpdate()
})
schedule.scheduleJob('RawCSVDaily',{
  tz:'Asia/Ho_Chi_Minh',
  rule:'0 1 * * * *'
},async()=>{
  await RawCSVUpdate()
  await RawGitUpdate()
})
