nodeehz
=======

Small node.js EHZ tool to read power values from your smart meter (e.g. Hager EHZ) with SML protocol and OBIS values.


Sample
------

Wirkleistung momentan: -2394.4 W
Gesamt Bezug: 3517.6868 kW
Gesamt Einspeisung: 8723.6061 kW


Install
-------

Get nodeehz: "git clone https://github.com/sunny5/nodeehz.git"
Install needed modules: "npm install node-xml serialport" 

Run: "node readSML.js"


Notes
-----
For the serialport module to work, it seems that at least node.js v0.8 is necessary.
