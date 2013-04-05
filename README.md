nodeehz
=======

Small node.js EHZ tool to read power values from your smart meter (e.g. Hager EHZ) with SML protocol and OBIS values.<br>


Sample
------

Wirkleistung momentan: -2394.4 W<br>
Gesamt Bezug: 3517.6868 kW<br>
Gesamt Einspeisung: 8723.6061 kW<br>


Install
-------

Get nodeehz: "git clone https://github.com/sunny5/nodeehz.git"<br>
Install needed modules: "npm install node-xml serialport"<br>
<br>
Run: "node readSML.js"<br>


Notes
-----
For the serialport module to work, it seems that at least node.js v0.8 is necessary.
