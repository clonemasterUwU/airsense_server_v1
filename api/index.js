import express from 'express'
import env from 'dotenv'
env.config({ path:"./debug.env" })

import mobileRoute from './routes/mobile.js'
import path from 'path'
const app = express()
const __dirname=path.resolve()


app.use((req, res, next) => {
  res.set('Content-Type', 'text/html')
  next()
})

// app.use(express.json())
app.get('/policy',(req,res)=>{
  res.sendFile(path.join(__dirname,'./api/assets/policy.html'))
})

app.use('/api/mobile',mobileRoute)
app.listen(3000,()=>console.log("Server is listening"))