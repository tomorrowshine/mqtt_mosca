var client  = mqtt.connect('mqtt://127.0.0.1',{port:3000})
			 
client.on('connect', function () {
   console.log('>>> connected')
   setInterval(
        ()=>{
        	client.publish('/temperature', '-30');
        },
        3000
    );

})

client.on('message', function (topic, message) {
  // message is Buffer
  console.log(message.toString())
})