import fs from 'fs'
import Promise from 'bluebird'
const promiseFileExist = Promise.method((path,mode)=>{
  return new Promise((resolve,reject)=>{
    fs.access(path,mode,(err)=>{
      if(err){
        resolve(false)
      }
      else {
        resolve(true)
      }
    }
      )
  })
})
export default promiseFileExist