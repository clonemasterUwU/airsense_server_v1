import csv from 'fast-csv'
import Promise from 'bluebird'
const promiseWriteCSV = Promise.method((data,options,pipe)=>{
  return new Promise((resolve,reject)=>{
    csv.write(data,options).on('end',()=>resolve()).on('error',(err)=>reject(err)).pipe(pipe)
  })
})
export default promiseWriteCSV