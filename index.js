var app = require("express")();
var server = require("http").createServer(app);
var io = require("socket.io").listen(server);

var port = process.env.PORT || 2999;
server.listen(port);
console.log("Running on PORT " + port);

// Basic routing
// ng --> middleware --> end
app.post("/api/led1", function(req, res){
  io.to("end").emit("command", {key: "led1", value: req.query.value});
  res.send({success:true});
});

app.post("/api/led2", function(req, res){
  io.to("end").emit("command", {key: "led2", value: req.query.value});
  res.send({success:true});
});

app.post("/api/image", function(req, res){
  console.log("client request an image");
  io.to("end").emit("image");
  res.send({success:true});
});

io.sockets.on("connection", function(socket){
  // For each connection attempt, ask all the socket client,
  // whether they are an `end` or a `ng`
  console.log("a client attempting to connect");
  io.emit("whoareu");
  
  // Join room as end
  socket.on("join-end", function(){
    socket.join("end");
    console.log("an `end` client connected");
  })

  socket.on("ledOn", function(){
    console.log("ledOn")
    io.to("end").emit("command", {key: "led1", value: 1});
  })
  socket.on("ledOff", function(value){
    console.log("ledOff")
    io.to("end").emit("command", {key: "led1", value: 0});
  })

  // Or as angular client
  socket.on("join-ng", function(){
    socket.join("ng");
    console.log("an `ng` client connected");
  })
  
  socket.on("image", function(data){
    console.log("pi send an image");
    console.log(data);
    io.to("ng").emit("image", data);
  })

  // Socket event
  // end --> middleware --> ng
  socket.on("switch1", function(data){
    console.log("pi send value " + data + " from switch1");
    io.to("ng").emit("message", data);
  });
 /*
  // Simulate dht11 data
  setInterval(function(){
	var msg = {
		sensor: "dht11",
		data : {
			temp : Math.random().toString().substr(0,4),
			humid : Math.random().toString().substr(0,4),
		}
	}
	io.to("ng").emit("message", msg);
  }, 5000);
  */
  

  // DHT11 sensor
  socket.on("intervalData", function(data){
    console.log("pi send value " + JSON.stringify(data));
    var msg = data;
    io.to("ng").emit("message", msg);
  });
  /* socket.on("dht11", function(data){ */
  /*   console.log("pi send value " + JSON.stringify(data) + " from dht11 sensor"); */
  /*   var msg = { */
  /*     sensor : "dht11", */
  /*     data : data */
  /*   } */
  /*   io.to("ng").emit("message", msg); */
  /* }); */
});


