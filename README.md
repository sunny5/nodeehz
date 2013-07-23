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

Get nodeehz: "git clone https://github.com/sunny5/nodeehz.git", "cd nodeehz"<br>
Install needed modules: "npm install node-xml serialport"<br>
<br>
Run: "node readSML.js"<br>

Optional
--------

A second tool, pushSML2GroupChat.js, is available to push the ehz data via jabber/xmpp. Further applications can then use this realtime data by entering the configured xmpp room. For this feature to work an account and/or server on www.think5.de GroupChat services is needed. E.g. http://my.sunny5.de uses these xmpp/bosh services.<br>
<br>
To run this tool, another node module is necessary, change to directory node_modules: git clone https://github.com/mark-sch/xmppjs.git<br>
Copy mygrid-config.json to grid-config.json and set custom xmpp server, user and password settings here.

Notes
-----
For the serialport module to work, it seems that at least node.js v0.8 is necessary.
