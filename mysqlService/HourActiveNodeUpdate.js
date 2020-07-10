import getPool from './dbconfig.js'
const HourNodeUpdate = async()=>{
  try{
    const timeMarker =  Math.floor(Date.now()/(3600000)) *3600
    const pool = await getPool()
    const activeNode = await pool.query(`SELECT DISTINCT NodeId FROM Data WHERE Time BETWEEN ${timeMarker-3600} AND ${timeMarker-1}`)
    await pool.query(`UPDATE Node SET active=false`)
    let param = `(`
    for (let i = 0; i <activeNode.length;i++){
      param+=`'${activeNode[i]['NodeId']}'`
      i!=activeNode.length-1?param+=`,`:null
    }
    param+=`)`
    await pool.query(`UPDATE Node SET active=true WHERE NodeId IN ${param}`)  
  }catch(err){
    console.log(err)
  }
}
export default HourNodeUpdate