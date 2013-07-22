//*** Continuously read SML data from EHZ and output OBIS values 15.7.0 (Wirkleistung), 1.8.0 and 2.8.0

var serialport = require("serialport");
var SerialPort = serialport.SerialPort;
var util = require("util"), repl = require("repl");

var serial_port = new SerialPort("/dev/ttyUSB0", {baudrate: 9600, databits: 8, stopbits:1, parity:'none', buffersize:2048, parser: serialport.parsers.raw});
var regCompleteMsg = new RegExp('1b1b1b1b01010101.*1b1b1b1b.{8}');
var reg15_7_0 = new RegExp('0701000f0700.{16}(.{8})0177');
var reg1_8_0 = new RegExp('070100010800.{24}(.{8})0177');
var reg2_8_0 = new RegExp('070100020800.{24}(.{8})0177');
var arr15_7_0, arr1_8_0, arr2_8_0;
var int1_8_0=0, int1_8_0prev=0, int2_8_0=0, int15_7_0;
var chunk = "";

serial_port.on("data", function (data) {
   chunk += data.toString('hex');
   if (chunk.match(regCompleteMsg)) {
      arr15_7_0 = chunk.match(reg15_7_0);
      arr1_8_0 = chunk.match(reg1_8_0);
      arr2_8_0 = chunk.match(reg2_8_0);
      
      if (arr15_7_0 == null || arr1_8_0 == null || arr2_8_0 == null) {
         return;
      }

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
      chunk = "";
   }
})
serial_port.on("error", function (msg) {
  util.puts("error: "+msg);
})
repl.start("=>")


