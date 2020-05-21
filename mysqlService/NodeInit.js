
import mysql from 'promise-mysql'
let pool
const _createPool = async()=>{
  try{
    const pool = await mysql.createPool({
      host:process.env.DB_HOST,
      user:process.env.DB_USER,
      password:process.env.DB_PASS,
      database:process.env.DB_NAME,
      connectionLimit:5,
      port:process.env.DB_PORT, 
    })
    await pool.query(
      `CREATE TABLE IF NOT EXISTS 
        Node (NodeId VARCHAR(20) NOT NULL, 
        ReverseGeocode TEXT,
        Longitude DOUBLE,
        Latitude DOUBLE,
        active BOOLEAN,
        PRIMARY KEY (NodeId)
        ) DEFAULT CHARSET=utf8`
    )
    return pool
  }catch(err){
    if (err.code !='ER_DUP_ENTRY') console.log(err)
  }
}
export default async()=>{
  try{
    pool = await _createPool()
    await pool.query(
      `INSERT INTO Node(NodeId,Longitude,Latitude,active,ReverseGeocode) VALUES(?,?,?,?,?)`
    ,['50029167DB95',  105.80001, 21.015251, true, '3 Trung Yên 10A, Trung Hoà, Cầu Giấy, Hà Nội, Việt Nam'])
    await pool.query(
      `INSERT INTO Node(NodeId,Longitude,Latitude,active,ReverseGeocode) VALUES(?,?,?,?,?)`
    ,['50029167E731', 105.823396, 21.063414, true, '20 Hẻm 12/2/5 Đặng Thai Mai, Quảng An, Tây Hồ, Hà Nội, Việt Nam'])
    await pool.query(
      `INSERT INTO Node(NodeId,Longitude,Latitude,active,ReverseGeocode) VALUES(?,?,?,?,?)`
    ,['50029167E8F2', 105.863842, 20.985093, true, '409 Đường Tam Trinh, Hoàng Văn Thụ, Hoàng Mai, Hà Nội, Việt Nam'])
    await pool.query(
      `INSERT INTO Node(NodeId,Longitude,Latitude,active,ReverseGeocode) VALUES(?,?,?,?,?)`
    ,['50029167ED03',105.800735,21.048163,true,'Cạnh Bảo tàng Thiên Nhiên, Nghĩa Đô, Cầu Giấy, Hà Nội, Việt Nam'])
    await pool.query(
      `INSERT INTO Node(NodeId,Longitude,Latitude,active,ReverseGeocode) VALUES(?,?,?,?,?)`
    ,['BCDDC26BA2D4', 105.762424, 21.029962, true, 'Nhà C6 KĐT Mỹ Đình I - Trần Hữu Dực, Mỹ Đình 1, Cầu Diễn, Từ Liêm, Hà Nội, Việt Nam'])
    await pool.query(
      `INSERT INTO Node(NodeId,Longitude,Latitude,active,ReverseGeocode) VALUES(?,?,?,?,?)`
    ,['BCDDC26C4CF4', 105.783636, 21.045914, false, '479 Hoàng Quốc Việt, Cổ Nhuế, Cầu Giấy, Hà Nội, Việt Nam'])
    await pool.query(
      `INSERT INTO Node(NodeId,Longitude,Latitude,active,ReverseGeocode) VALUES(?,?,?,?,?)`
    ,['DC4F227DCCD1', 105.855489, 21.069535, true, '220 Phố Bắc Cầu, Ngọc Thụy, Long Biên, Hà Nội, Việt Nam'])
    await pool.query(
      `INSERT INTO Node(NodeId,Longitude,Latitude,active,ReverseGeocode) VALUES(?,?,?,?,?)`
    ,['DC4F227E57DA', 105.840464, 20.985344, true, '6 Định Công, Phương Liệt, Thanh Xuân, Hà Nội, Việt Nam'])
    await pool.query(
      `INSERT INTO Node(NodeId,Longitude,Latitude,active,ReverseGeocode) VALUES(?,?,?,?,?)`
    ,['DC4F227E68C4', 105.807711, 20.995313, true, '334 Nguyễn Trãi, Thanh Xuân Trung, Thanh Xuân, Hà Nội, Việt Nam'])
    await pool.query(
      `INSERT INTO Node(NodeId,Longitude,Latitude,active,ReverseGeocode) VALUES(?,?,?,?,?)`
    ,['DC4F227E6793', 105.815629, 21.078539, true, '28 D3 A4 Ngõ 689 Lạc Long Quân,, Phú Thượng, Tây Hồ, Hà Nội, Việt Nam'])
    await pool.query(
      `INSERT INTO Node(NodeId,Longitude,Latitude,active,ReverseGeocode) VALUES(?,?,?,?,?)`
    ,['DC4F227DC9FA',105.800828, 21.008704, false, 'Phòng 2301 Tòa A, Nhà N04, Hoàng Đạo Thúy, Việt Nam, Trung Hoà, Cầu Giấy, Hà Nội, Việt Nam'])
    await pool.query(
      `INSERT INTO Node(NodeId,Longitude,Latitude,active,ReverseGeocode) VALUES(?,?,?,?,?)`
    ,['DC4F227DCC45', 105.80001, 21.0152513, false, '3 Trung Yên 10A, Trung Hoà, Cầu Giấy, Hà Nội, Việt Nam'])
    await pool.query(
      `INSERT INTO Node(NodeId,Longitude,Latitude,active,ReverseGeocode) VALUES(?,?,?,?,?)`
    ,['DC4F227DCA68', 105.815327, 21.041472, false, '6 Quần Ngựa, Liễu Giai, Ba Đình, Hà Nội, Việt Nam'])
    await pool.query(
      `INSERT INTO Node(NodeId,Longitude,Latitude,active,ReverseGeocode) VALUES(?,?,?,?,?)`
    ,['DC4F227DCFF6', 105.794827, 21.046946, false, 'Số 1 D1, Ngõ 106 - Hoàng Quốc Việt, Nghĩa Đô, Cầu Giấy, Hà Nội, Việt Nam'])
    await pool.query(
      `INSERT INTO Node(NodeId,Longitude,Latitude,active,ReverseGeocode) VALUES(?,?,?,?,?)`
    ,['DC4F227E65F4', 105.833936, 20.976458, false, 'P. Trịnh Đình Cửu, Định Công, Thanh Xuân, Hà Nội, Việt Nam'])
    await pool.query(
      `INSERT INTO Node(NodeId,Longitude,Latitude,active,ReverseGeocode) VALUES(?,?,?,?,?)`
    ,['DC4F227E57D1', 105.951778, 21.016234, false, 'X8 - KDT Dang Xa, Đặng Xá, Gia Lâm, Hà Nội, Việt Nam'])
    await pool.query(
      `INSERT INTO Node(NodeId,Longitude,Latitude,active,ReverseGeocode) VALUES(?,?,?,?,?)`
    ,['50029167E78E',  105.775966, 21.014946, false, 'villa D25, Phố Trần Văn Lai, Mỹ Đình, Từ Liêm, Hà Nội, Việt Nam'])
    await pool.query(
      `INSERT INTO Node(NodeId,Longitude,Latitude,active,ReverseGeocode) VALUES(?,?,?,?,?)`
    ,['DC4F227DC944', 105.780492,  20.96889, false, '119 Đường Cổ Linh, Bồ Đề, Long Biên, Hà Nội, Việt Nam'])
    await pool.query(
      `INSERT INTO Node(NodeId,Longitude,Latitude,active,ReverseGeocode) VALUES(?,?,?,?,?)`
    ,['BCDDC26BA2C6', 105.874327, 21.039022, false, '35 Đ. Tô Hiệu, P. Nguyễn Trãi, Hà Đông, Hà Nội, Việt Nam'])
    await pool.query(
      `INSERT INTO Node(NodeId,Longitude,Latitude,active,ReverseGeocode) VALUES(?,?,?,?,?)`
    ,['DC4F2222F3A0',  105.800527 , 21.089296,true, '359 An Dương Vương, Phú Thượng, Tây Hồ, Hà Nội, Việt Nam'])
    await pool.query(`DELETE FROM data where NodeId IN (
      '4C11AE10CD26', '50029167E78E', '807D3A3D943D', '840D8E83479D', '840D8E834828',
      '84F3EB EF191', '84F3EB EF3B1', '84F3EB EF87C','84F3EB EFCD3', '84F3EB F00BC', 
      '84F3EB9FED20', '84F3EBB3593E', '84F3EBB3EA5B', '84F3EBFB71AF','84F3EBFB870A', 
      '84F3EBFBE0EB', '84F3EBFBE0EBFBE0EB','84F3EBFBE43F', 'A020A6 7BEDB', 'BCDDC26BA2C6',
      'DC4F2222BA72', 'DC4F227D3716', 'DC4F227DC8A9','DC4F227DC8F1' , 'BCDDC26C4CF4',
      'DC4F227DC944', 'DC4F227DC9D5', 'DC4F227DC9FA', 'DC4F227DCA68', 'DC4F227DCC45',
      'DC4F227DCCA1', 'DC4F227DCD00', 'DC4F227DCD2F', 'DC4F227DCE01', 'DC4F227DCFF6',
      'DC4F227DD01F', 'DC4F227DD030', 'DC4F227DD08C', 'DC4F227DD0DD', 'DC4F227E573A', 
      'DC4F227E57D1', 'DC4F227E58A1', 'DC4F227E58BF', 'DC4F227E65F4', 'DC4F227E675B',
      'DC4F227E67C4', 'DC4F227E684B', 'DC4F227E689E', 'ECFABC2C6A31', 
      'ECFABC2C6A49', 'ECFABC2C6A69', 'ECFABC2C6ACF', 'ECFABC2C6AD1', 'ECFABC2C6B16', 
      'ECFABC2C6B4F', 'ECFABC2C6B5D', 'ECFABC2C6BA1', 'ECFABC2C6BA2', 'ECFABC2C6CE8',
      'ECFABC2C6CFA', 'ECFABC2C6D24', 'ECFABC2C6DBB', 'ECFABC399441', 'ECFABC6350FC', 
      'ECFABC635128', 'ECFABC6352B3', 'ECFABC635332', 'ECFABC63533B', 'ECFABC6353DA', 
      'ECFABC635490', 'ECFABC635496', 'ECFABC63551D', '2CF43278189D', 
      '18FE34EE8D49', '4C11AE109277', '4C11AE10BE14',
      '4C11AE10C0A6', '4C11AE10CA5F', '5002914ED2D3'
      );
      `)
  }catch(err){
    if (err.code !='ER_DUP_ENTRY') throw err
  }
}
// const test = async ()=>{
//   try {
//     pool = await _createPool()
//     console.log(pool)
//     const query = pool.query(`SELECT ReverseGeocode from node;`)
//     const test = await (query)
//     console.log(JSON.stringify(test))
//   }catch(err){

//   }
// }
// test()