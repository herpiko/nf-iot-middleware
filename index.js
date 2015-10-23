var app = require("express")();
var server = require("http").createServer(app);
var io = require("socket.io").listen(server);

var port = process.env.PORT || 3000;
server.listen(port);
console.log("Running on PORT 3000");

// Basic routing
// ng --> middleware --> end
app.get("/led1", function(req, res){
  io.to("end").emit("command", {key: "led1", value: req.query.value});
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

  // Or as angular client
  socket.on("join-ng", function(){
    socket.join("ng");
    console.log("an `ng` client connected");
  })

  // Socket event
  // end --> middleware --> ng
  socket.on("switch1", function(data){
    console.log("pi send value " + data + " from switch1");
    io.to("ng").emit("message", data);
  });
});


