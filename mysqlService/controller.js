
import schedule from 'node-schedule'
import _update_db_HourAverage from "./HourAverageUpdate.js"
import _update_db_AQI from './HourAQIUpdate.js'
import _initiate_Node from './NodeInit.js'

import env from 'dotenv'
env.config({ path:"./debug.env" })

_initiate_Node()
const schedule_update= schedule.scheduleJob('01 00 * * * *',
  async()=>{    
    const houraverage_update_status = await _update_db_HourAverage()
    const aqi_update_status = await _update_db_AQI()
    if (aqi_update_status) console.log("Updated AQI Db at: " + Date.now())
    if(houraverage_update_status) console.log("Updated HourAverage at: " +Date.now())
  })
