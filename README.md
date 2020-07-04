# airsense_server_v1

###########

mqttService (subcribe to MQTT Broker and write data to Data table in MySQL)
  
>  -Client.on('connect') to check connection to broker
  
>  -Client.on('message') to parse data through tcp connection
  
>  -insertData() to write data to MySQL
  
 *log can be found at `pm2 log mqtt`
 
###########



############

mysqlService (hourly calculate average data from Data and write to AverageHour and AQI table in MySQL)
  
>  +dbconfig
>>    -createPool() = return singleton pool to MySQL 

>  +HourAverageUpdate
>>    -update_db_HourAverage() 
>>>     _HourAverage_Update() = update each NodeId
>>>>      _HourAverage_Update() = update each criteria
>>>>>       _Get_Data_Hour() = query 
>>    -init_db_HourAverage() = reset option...in development
> +HourAQIUpdate
>>    -update_db_AQI()
>>>     _query_and_insert_AQI() = query + update each NodeId
>>>>      _evaluate_AQI() = calculate AQI
>>>>>       _rescale(), _nowcast(), truncated() = helper function
> +index
>> -schedule.scheduleJob(...) = hourly update


> +NodeInit (in develop)

############

##########

csvService  (daily write data from AverageHour to airsense_data and push csv file to GitHub)

##########

###
api
  +Vanilla Express to serve data through http
  +currently available endpoint:
  >airsense.vn:3000/api/mobile
>>/device --> activeNode + inactiveNode (array of Node)
>>>     Node = NodeId + ReverseGeocode + Longitude + Latitude + active
>>/aqi   --> array of NodeId + Time + AQI + Criteria

>>/data
>>>     param = time (unix timestamp of last round hour)(for sync) + interval (number of hour between time and END) + gap (number of hour between START and END)
>>>     --> AVG(CO) + AVG(Pm1) + AVG(Pm2p5) + AVG(Pm10) + AVG(Hum) + AVG(Tem) (array value from END to START (newest to oldest) )

###
