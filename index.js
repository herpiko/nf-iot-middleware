var app = require("express")();
var server = require("http").createServer(app);
var io = require("socket.io").listen(server);

server.listen(1234);

// Basic routing
// ng --> middleware --> end
app.get("/led1", function(req, res){
  io.to("end").emit("command", req.query.value);
  res.send({success:true});
});

io.sockets.on("connection", function(socket){
  console.log("a client connected");
  
  // Join room as end
  socket.on("join-end", function(){
    socket.join("end");
  })

  // Or as angular client
  socket.on("join-ng", function(){
    socket.join("ng");
  })

  // Socket event
  // end --> middleware --> ng
  socket.on("switch1", function(data){
    console.log("pi send value " + data + " from switch1");
    io.to("ng").emit("message", data);
  });
});


