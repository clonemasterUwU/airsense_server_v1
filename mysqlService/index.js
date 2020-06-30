
import schedule from 'node-schedule'
import update_db_HourAverage from "./HourAverageUpdate.js"
import update_db_AQI from './HourAQIUpdate.js'
import _initiate_Node from './NodeInit.js'

import env from 'dotenv'
env.config({ path:"./debug.env" })

// _initiate_Node()
schedule.scheduleJob('MySQL process','0 0 * * * *',
  async()=>{    
    await update_db_HourAverage()
    await update_db_AQI()
  })
