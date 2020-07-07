import fs from 'fs'
import Promise from 'bluebird'
const promiseWrite = Promise.method((writeStream,data)=>{
  return new Promise((resolve,reject)=>{
    writeStream.write(data,(err)=>{
      if(err){
        reject()
      }
      else {
        resolve()
      }
    }
      )
  })
})
export default promiseWrite