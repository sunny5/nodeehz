var fs = require('fs');

//*** Continuously read SML data from EHZ and push OBIS value 15.7.0 (Wirkleistung)
//*** to xmpp server room.

objConfig = JSON.parse(fs.readFileSync('./grid-config.json', 'utf8'));
strGroupchatServer = objConfig["groupchat-server"];
intGroupchatPort = objConfig["groupchat-port"];
strGroupchatRoom = objConfig["groupchat-room"];
strGroupchatUser = objConfig["groupchat-ehz-user"];
strGroupchatPass = objConfig["groupchat-ehz-pass"];

var jid = strGroupchatUser+"@"+strGroupchatServer;
var xmpp = require("xmppjs/xmpp");
conn = new xmpp.Connection(strGroupchatServer, intGroupchatPort);
conn.JOINEDROOM = false;

conn.connect(jid, strGroupchatPass, function (status, condition) {
   if(status == xmpp.Status.CONNECTED) {
     console.log('Connected to GroupChat server.');
     conn.send("<presence from='"+conn.jid+"' id='mysunny5' to='"+strGroupchatRoom+"/ehz'><x xmlns='http://jabber.org/protocol/muc'/></presence>");
     conn.addHandler(function() {
        console.log("Entered room: "+strGroupchatRoom);
        conn.JOINEDROOM = true;
     }, null, 'presence', null, null, null);
   }
});


var serialport = require("serialport");
var SerialPort = serialport.SerialPort;
var util = require("util"), repl = require("repl");

var serial_port = new SerialPort("/dev/ttyUSB0", {baudrate: 9600, databits: 8, stopbits:1, parity:'none', buffersize:2048, parser: serialport.parsers.raw});
var regCompleteMsg = new RegExp('1b1b1b1b01010101.*1b1b1b1b.{8}');
var reg15_7_0 = new RegExp('0701000f0700.{16}(.{8})0177');
var reg1_8_0 = new RegExp('070100010800.{24}(.{8})0177');
var reg2_8_0 = new RegExp('070100020800.{24}(.{8})0177');
var arr15_7_0, arr1_8_0, arr2_8_0;
var int1_8_0=0, int1_8_0prev="0", int2_8_0=0, int15_7_0;
var chunk = "";

serial_port.on("data", function (data) {
   chunk += data.toString('hex');
   if (chunk.match(regCompleteMsg)) {
      arr15_7_0 = chunk.match(reg15_7_0);
      arr1_8_0 = chunk.match(reg1_8_0);
      arr2_8_0 = chunk.match(reg2_8_0);
      int15_7_0 = parseInt(arr15_7_0[1],16)/10;
      int1_8_0 = parseInt(arr1_8_0[1],16)/10000;
      int2_8_0 = parseInt(arr2_8_0[1],16)/10000;

      if (arr1_8_0[1] > int1_8_0prev) {
         int1_8_0prev = arr1_8_0[1];
      }
      else {
         int1_8_0prev = arr1_8_0[1];
         int15_7_0 = int15_7_0*-1;
      }

      console.log('---new data---');
      console.log("Wirkleistung momentan: " + int15_7_0  + " W");
      console.log("Gesamt Bezug: " + int1_8_0 + " kW");
      console.log("Gesamt Einspeisung: " + int2_8_0 + " kW");
      //console.log(chunk);

      if (conn.JOINEDROOM == true) {
          conn.send("<message from='"+strGroupchatRoom+"/ehz' id='mymsg' to='"+strGroupchatRoom+"' type='groupchat'><body>e:"+Math.round(parseInt(arr15_7_0[1],16)/10)+"</body></message>");
          console.log("Groupchat message sent.");
       }

      chunk = "";
   }
   if (chunk.length > 5000) {
      //avoid memory leak on unknown/unmatched ehz
      chunk = "";
   }
})
serial_port.on("error", function (msg) {
  util.puts("error: "+msg);
})

repl.start("=>")
