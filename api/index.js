import express from 'express'


import mobileRoute from './routes/mobile.js'
const app = express()


app.use((req, res, next) => {
  res.set('Content-Type', 'text/html')
  next()
})

// app.use(express.json())


app.use('/api/mobile',mobileRoute)
app.listen(3000,()=>console.log("Server is listening"))