/*================================================================================================
  Item class for Internal Address List
================================================================================================*/
class IALItem {
    constructor(address) {
      this.idle = Math.floor(Date.now() / 1000);
      this.address = address;
      this.channels = {}; // chan = prefix, Example {'#mIRC': '@%+'}
      this.account = "*";
      this.away = "";
      this.gecos = "";
    }
    addChan(chan,prefix) { if (!this.channels.hasOwnProperty(chan.toLowerCase())) { this.channels[chan.toLowerCase()] = prefix || ''; } }
    delChan(chan) { if (this.channels.hasOwnProperty(chan.toLowerCase())) { delete this.channels[chan.toLowerCase()]; } }
    addPrefix(chan,prefix,sort) { if (this.channels[chan.toLowerCase()].indexOf(prefix) < 0) { this.channels[chan.toLowerCase()] += prefix; this.channels[chan.toLowerCase()] = this.channels[chan.toLowerCase()].split('').sort((a,b)=>sort.indexOf(a) - sort.indexOf(b)).join(''); } }
    delPrefix(chan,prefix) { if (this.channels[chan.toLowerCase()].indexOf(prefix) > -1) { this.channels[chan.toLowerCase()] = this.channels[chan.toLowerCase()].replace(prefix,""); } }
    getPrefix(chan) { if (this.channels.hasOwnProperty(chan.toLowerCase())) { return this.channels[chan.toLowerCase()]; } }
  }
  
  /*================================================================================================
    Item class for Internal Channels List
  ================================================================================================*/
  class ICLItem {
    constructor(chan) {
      this.channel = chan;
      this.idle = Math.floor(Date.now() / 1000);
      this.Mode = {};
      this.mode = '';
      this.key = '';
      this.limit = '';
      this.topic = '';
      this.topicby = '';
      this.topicset = 0;
      this.created = 0;
      this.Nicks = [];
      this.IBL = {}; //Internal Bans List
      this.IEL = {}; //Internal Excepts List
      this.IIL = {}; //Internal Invites List
      this.IQL = {}; //Internal Quiets List
    }
    addBan(mask,setby,settime) { if (!this.IBL.hasOwnProperty(mask)) { this.IBL[mask] = {by: setby, date: settime}; } }
    delBan(mask) { if (this.IBL.hasOwnProperty(mask)) { delete this.IBL[mask]; } }
    addExcept(mask,setby,settime) { if (!this.IEL.hasOwnProperty(banmask)) { this.IEL[mask] = {by: setby, date: settime}; } }
    delExcept(mask) { if (this.IEL.hasOwnProperty(mask)) { delete this.IEL[mask]; } }
    addInvite(mask,setby,settime) { if (!this.IIL.hasOwnProperty(mask)) { this.IIL[mask] = {by: setby, date: settime}; } }
    delInvite(mask) { if (this.IIL.hasOwnProperty(mask)) { delete this.IIL[mask]; } }
    addQuiet(mask,setby,settime) { if (!this.IQL.hasOwnProperty(mask)) { this.IQL[mask] = {by: setby, date: settime}; } }
    delQuiet(mask) { if (this.IQL.hasOwnProperty(mask)) { delete this.IQL[mask]; } }
    addMode(mode,arg) {
      if (!this.Mode.hasOwnProperty(mode)) { this.Mode[mode] = arg; }
      if (mode == "k") { this.key = arg; }
      if (mode == "l") { this.limit = arg; }
      this.ModesToString();
    }
    delMode(mode) { 
      if (this.Mode.hasOwnProperty(mode)) { delete this.Mode[mode]; }
      if (mode == "k") { this.key = ''; }
      if (mode == "l") { this.limit = ''; }
      this.ModesToString();
    }
    addNick(nick) { if (!this.Nicks.includes(nick)) { this.Nicks.push(nick); } }
    delNick(nick) { if (this.Nicks.includes(nick)) { this.Nicks.splice(this.Nicks.indexOf(nick),1); } }
    ModesToString() {
      var modes = [], args = [];
      Object.keys(this.Mode).forEach((key) => {
        modes.push(key);
        if (this.Mode[key] != "") { args.push(this.Mode[key]); }
      });
      this.mode = modes.join("");
      if (args.length > 0) { this.mode += " " + args.join(" "); }
    }
  }    
  
  /*================================================================================================
    IRC Client class
  ================================================================================================*/
  class IRCClient {
    constructor(cid,nick,server,args) {
      this.Listeners = {action: [],batch: [],connect: [],chghost: [],ctcp: [],ctcpreply: [],disconnect: [],error: [],invite: [],join: [],kick: [],logon: [],mode: [],nick: [],notice: [],part: [],ping: [],pong: [],quit: [],raw: [],snotice: [],smode: [],privmsg: [],tagmsg: [],topic: [],umode: []}; //Collection of callbacks for IRC related events
      this.CID = cid;
      this.Server = server;
      this.Port = '';
      this.Me = nick || 'Guest-' + (Math.random() + 1).toString(36).substring(7);
      this.InitDefaultValues();
    }
    InitDefaultValues() {
      this.IAL = {}; //Internal Address List Object
      this.ICL = {}; //Internal Channels List Object
      this.ServerARGS = {}; //Raw 005 supported "features" and "limits" etc...
      this.IrcV3Cap = []; //Collection of capabilities ACK'd
      this.IrcV3ReqCap = []; //Collection of capabilities requested, pruned from CAP ACK/NAK to determine once empty to CAP END.
      this.IrcV3Batch = {}; //Blank storage for batches
      this.IrcV3ClientTagDeny = '';
      this.UMode = '';
      this.ChanModes = 'bIe,k,l';
      this.ChanTypes = '#&';
      this.ModeSpl = 3;
      this.Network = '';
      this.NickMode = 'ohv';
      this.Prefix = '@%+';
      this.Latency = '';
      this.OTime = '';
    }
    WSConnect(nick,server,type,blockLogon) {
      this.WSClose();
      if (nick) { this.Me = nick; }
      this.Server = server;
      this.WSServerURI = server;
      this.WSServerPROTO = type;
      if (this.hasOwnProperty('Socket')) { delete this.Socket; }
      this.Socket = new WebSocket(server,type);
      this.Emit('connect',[this.CID,this.Socket.readyState]);
      this.Socket.addEventListener('open', () => { 
        if (!blockLogon) { this.Emit('logon',[this.CID]); }
        this.OTime = Date.now() / 1000;
        this.WSSend('CAP LS 302');
        this.WSSend('NICK ' + this.Me);
        this.WSSend('USER ' + this.Me + ' 0 * :' + this.Me); 
      });
      this.Socket.addEventListener('message', async e => { this.ParseLine((e.data instanceof Blob ? await e.data.text() : e.data)); });
      //this.Socket.addEventListener('error', (e) => { console.log(e); });
      this.Socket.addEventListener('close',(e) => { this.WSClosed(e) });
    }
    WSSend(data) {
      if (this.hasOwnProperty('Socket')) {
        if (this.Debug) { console.log("-> " + data); }
        this.Socket.send(data);
        if (this.PingSocket) { clearInterval(this.PingSocket); }
        this.PingSocket = setInterval(() => { this.WSSend("PING " + new Date().getTime()); },"60000");
      }
    }
    WSClose() { 
      if (this.hasOwnProperty('Socket') && this.Socket.readyState <= 1) { 
        this.Socket.close(1000); 
        delete this.Socket;
        this.Emit('disconnect',[this.CID,"Code: 1000"]);
      } 
      this.InitDefaultValues(); 
    }
    WSClosed(e) { if (this.hasOwnProperty('Socket') && this.Socket.readyState == 3) { this.Emit('disconnect',[this.CID,"Code: " + e.code + (e.reason != "" ? " Reason: " + e.reason : "")]); } }
    SortNicks(chan,array) {
      array.sort((a,b) => {
        var c = this.Prefix.split("").indexOf(this.GetIAL(a).getPrefix(chan).substr(0,1)), d = this.Prefix.split("").indexOf(this.GetIAL(b).getPrefix(chan).substr(0,1));
        var e = String.fromCharCode((c < 0 ? this.Prefix.length : c) + 33) + a , f = String.fromCharCode((d < 0 ? this.Prefix.length : d) + 33) + b;
        if (e.toLowerCase() < f.toLowerCase()) { return -1; }
        if (e.toLowerCase() > f.toLowerCase()) { return 1; }
        return 0;
      });
    }
    addListener(event,reciever,slot) { if (this.Listeners.hasOwnProperty(event)) { this.Listeners[event].push({Bind: reciever, Call: slot}); } }
    Emit(event,args) { if (this.Listeners.hasOwnProperty(event)) { this.Listeners[event].forEach(function(cb,index,_array) { cb.Call.apply(cb.Bind,args); },this); } }
    IALAdd(nick,addy) { if (!this.IAL.hasOwnProperty(nick)) { this.IAL[nick] = new IALItem(addy); } }
    IALUpdate(nick,props) { if (this.IAL.hasOwnProperty(nick)) { Object.assign(this.IAL[nick],props); } }
    IALDel(nick) { 
      if (this.IAL.hasOwnProperty(nick)) {
        Object.keys(this.IAL[nick].channels).forEach(function(property,index,_array) { if (this.ICL.hasOwnProperty(property)) { this.ICL[property].delNick(nick); } },this);
        delete this.IAL[nick];
      }
    }
    IALRen(nick,newnick) { 
      if (this.IAL.hasOwnProperty(nick)) { 
        this.IAL[newnick] = this.IAL[nick];
        this.IAL[newnick].idle = Math.floor(Date.now() / 1000);
        Object.keys(this.IAL[nick].channels).forEach(function(property,index,_array) { 
          this.ICL[property].delNick(nick); 
          this.ICL[property].addNick(newnick);
          this.SortNicks(property,this.ICL[property].Nicks);
        },this);
        delete this.IAL[nick];
      } 
    }
    GetIAL(nick) { if (this.IAL.hasOwnProperty(nick)) { return this.IAL[nick]; } }
    ICLAdd(chan) { if (!this.ICL.hasOwnProperty(chan.toLowerCase())) { this.ICL[chan.toLowerCase()] = new ICLItem(chan); } }
    ICLUpdate(chan,props) { if (this.ICL.hasOwnProperty(chan.toLowerCase())) { Object.assign(this.ICL[chan.toLowerCase()],props); } }
    ICLDel(chan) { 
      if (this.ICL.hasOwnProperty(chan.toLowerCase())) {
        this.ICL[chan.toLowerCase()].Nicks.forEach(function(nick,index,_array) { 
          if (this.IAL.hasOwnProperty(nick)) {
            this.IAL[nick].delChan(chan.toLowerCase());
            if (Object.keys(this.IAL[nick].channels).length == 0) { delete this.IAL[nick]; }
          }
        },this);
        delete this.ICL[chan.toLowerCase()];
      } 
    }
    GetICL(chan) { if (this.ICL.hasOwnProperty(chan.toLowerCase())) { return this.ICL[chan.toLowerCase()]; } }
    addUMode(mode) { if (this.UMode.indexOf(mode) < 0) { this.UMode += mode; } }
    delUMode(mode) { if (this.UMode.indexOf(mode) > -1) { this.UMode = this.UMode.replace(mode,""); } }
    ParseLine(data) {
      if (this.Debug) { console.log("<- " + data); }
      if (data.match(/^(?:@([^ ]+) )?(?:\x3a(\S+) )?(\d{3}|[a-zA-Z]+)(?: ((?:[^\x00\x0a\x0d\x20\x3a][^\x00\x0a\x0d\x20]*)(?: [^\x00\x0a\x0d\x20\x3a][^\x00\x0a\x0d\x20]*)*))?(?: \x3a([^\x00\x0a\x0d]*))?\x20*$/)) {
        var Tags = RegExp.$1 , FullAddress = RegExp.$2, Event = RegExp.$3, Args = RegExp.$4 || '', Extra = RegExp.$5, tmp = FullAddress.split(/!(.*)?$/,2), Nick = tmp[0], Address = tmp[1], IRCv3 = { clientonly: { } };
        if (Tags) { 
          Tags.split(";").forEach((tag) => {
            if (/^(?:(\x2b))?([^=]+)=(.*)$/.test(tag)) {
              var bool = RegExp.$1 , key = RegExp.$2 , value = RegExp.$3;
              value = value.replace(/\x5c(\x3a|\x5c|s|r|n)/g,(m) => {
                if (m == "\x3a") { return ";"; }
                if (m == "s") { return " "; }
                if (m == "\x5c") { return "\x5c"; }
                if (m == "r") { return "\r"; }
                if (m == "n") { return "\n"; }
              });
              if (bool) { IRCv3.clientonly[key] = value; }
              else { IRCv3[key] = value; }
            }
          });      
        }
        if (IRCv3.hasOwnProperty('batch')) {
          if (this.IrcV3Batch.hasOwnProperty(IRCv3['batch'])) {
            this.IrcV3Batch[IRCv3['batch']].lines.push(data);
            return;
          }
          //else { console.log("Error batch don't exist!"); }
        }
        Args = Args.split(' ');
        if (!FullAddress && /^PING$/i.test(Event)) { 
          this.Emit('ping',[this.CID,Extra,IRCv3]); 
          if (this.Socket) { this.WSSend('PONG ' + Extra); }
        }
        else if (/^PONG$/i.test(Event)) { 
          this.Emit('pong',[this.CID,Extra,IRCv3]); 
          if (/^\d+/.test(Extra)) { this.Latency = (new Date().getTime() - parseInt(Extra)); }
        }
        else if (Event == "CAP") {
          this.Emit('raw',[this.CID,Event,Args.join(" ") + " " + Extra,IRCv3]);
          if (Args[1] == "LS") {
            var multiline = (Args[2] == "*" ? true : false);
            //mIRC 7.72 === away-notify invite-notify extended-join userhost-in-names multi-prefix cap-notify setname chghost account-notify message-tags batch server-time account-tag labeled-response

            Extra.split(' ').forEach((capability) => {
              if (/^account-notify$/i.test(capability)) { this.IrcV3ReqCap.push(capability); }
              else if (/^away-notify$/i.test(capability)) { this.IrcV3ReqCap.push(capability); }
              else if (/^batch$/i.test(capability)) { this.IrcV3ReqCap.push(capability); }
              else if (/^cap-notify$/i.test(capability)) { this.IrcV3ReqCap.push(capability); }
              else if (/^chghost$/i.test(capability)) { this.IrcV3ReqCap.push(capability); }
              else if (/^extended-join$/i.test(capability)) { this.IrcV3ReqCap.push(capability); }
              else if (/^message-tags$/i.test(capability)) { this.IrcV3ReqCap.push(capability); }
              else if (/^multi-prefix$/i.test(capability)) { this.IrcV3ReqCap.push(capability); }
              else if (/^setname$/i.test(capability)) { this.IrcV3ReqCap.push(capability); }
              else if (/^server-time$/i.test(capability)) { this.IrcV3ReqCap.push(capability); }
              else if (/^userhost-in-names$/i.test(capability)) { this.IrcV3ReqCap.push(capability); }
              else if (/^sasl/i.test(capability)) {
                if (/PLAIN/.test(capability)) {
                  this.SaslMethods = capability.substr(5).split(",");
                  this.IrcV3ReqCap.push('sasl'); 
                }
              }
            });
            if (!multiline) {
              if (this.IrcV3ReqCap.length > 0) { 
                if (this.Socket) { this.WSSend('CAP REQ :' + this.IrcV3ReqCap.join(" ")); }             
              }
            }
          }
          else if (Args[1] == "ACK") {
            Extra.split(' ').forEach((capability) => {
              if (/^-/.test(capability) && this.IrcV3Cap.includes(capability.substr(1))) { this.IrcV3Cap.splice(this.IrcV3Cap.indexOf(capability.substr(1)),1); }
              else if (capability != "") {
                this.IrcV3Cap.push(capability); 
                if (this.IrcV3ReqCap.includes(capability)) { 
                  this.IrcV3ReqCap.splice(this.IrcV3ReqCap.indexOf(capability),1); 
                }
              }
            });
            if (this.IrcV3ReqCap.length == 0) {
              if (this.IrcV3Cap.includes('sasl') && this.SaslMethods.includes("PLAIN") && (this.SaslNick && this.SaslPass)) {
                if (this.Socket) { this.WSSend('AUTHENTICATE PLAIN'); }
              }
              else { if (this.Socket) { this.WSSend('CAP END'); } }
            }
          }
          else if (Args[1] == "NAK") {
            Extra.split(' ').forEach((capability) => {
              if (capability != "" && this.IrcV3Cap.includes(capability)) { this.IrcV3Cap.splice(this.IrcV3Cap.indexOf(capability),1); }
              else if (capability != "" && this.IrcV3ReqCap.includes(capability)) { 
                this.IrcV3ReqCap.splice(this.IrcV3ReqCap.indexOf(capability),1); 
              }
            });
            if (this.IrcV3ReqCap.length == 0) {
              if (this.IrcV3Cap.indexOf('sasl') > -1 && this.SaslMethods.indexOf("PLAIN") > -1 && (!this.SaslNick && !this.SaslPass)) {
                if (this.Socket) { this.WSSend('AUTHENTICATE PLAIN'); }
              }
              else { if (this.Socket) { this.WSSend('CAP END'); } }
            }
          }
        }
        else if (Event == "AUTHENTICATE") {
          if (Args[0] == "+") {
            if (this.Socket) { this.WSSend('AUTHENTICATE ' + btoa(this.SaslNick + "\0" + this.SaslNick + "\0" + this.SaslPass)); }
          }
        }
        else if (Event == "903" || Event == "904") { this.WSSend('CAP END'); }
        else if (Event == "001") {
          this.Me = Args[0];
          this.Server = Nick;
          this.WSSend("PING " + new Date().getTime());
          this.Emit('raw',[this.CID,Event,Args.join(" ") + " " + Extra,IRCv3]);
        }
        else if (Event == "005") {
          Args.slice(1).forEach(function(arg,index,_array) {
            //store server args
            if (arg.match(/^([^ =]+)=?(.*)$/)) { this.ServerARGS[RegExp.$1] = RegExp.$2; }

            if (arg.match(/^CHANMODES=([^ ]+)$/i)) { this.ChanModes = RegExp.$1; }
            else if (arg.match(/^CHANTYPES=([^ ]+)$/i)) { this.ChanTypes = RegExp.$1; }
            else if (arg.match(/^CLIENTTAGDENY=([^ ]+)$/i)) { this.IrcV3ClientTagDeny = RegExp.$1; }
            else if (arg.match(/^MODES=(\d+)$/i)) { this.ModeSpl = parseInt(RegExp.$1); }
            else if (arg.match(/^NETWORK=([^ ]+)$/i)) { this.Network = RegExp.$1; }
            else if (arg.match(/^PREFIX=\((\w+)\)([^ ]+)$/i)) {
              this.NickMode = RegExp.$1;
              this.Prefix = RegExp.$2;
            }
            else if (arg.match(/^(?:NAMESX|UHNAMES)$/i)) { this.WSSend('PROTOCTL ' + arg); }
          },this);
          this.Emit('raw',[this.CID,Event,Args.join(" ") + " " + Extra,IRCv3]);
        }
        else if (Event == "221") { var umodes = (Extra ? Extra : Args[1]); this.UMode = umodes.replace("+",""); this.Emit('umode',[this.CID,umodes,IRCv3]); }
        else if (Event == "302") { if (Extra.match(/^([^=*]+)(?:\*)?=(?:[+-])(.*)$/)) { this.IALUpdate(RegExp.$1,{address: RegExp.$2}); } this.Emit('raw',[this.CID,Event,Args.join(" ") + " " + Extra,IRCv3]); }
        else if (Event == "324") { 
          if (this.ICL.hasOwnProperty(Args[1].toLowerCase())) {
            var arg = Args.slice(2).join(" ") + (Extra ? " " + Extra : "");
            if (arg.match(/^([^ ]+) ?(.*)?$/)) { this.ParseModes(FullAddress,"",Args[1],RegExp.$1,RegExp.$2); }
          }
          this.Emit('raw',[this.CID,Event,Args.join(" ") + " " + Extra,IRCv3]);
        }
        else if (Event == "329") { this.ICLUpdate(Args[1],{created: parseInt(Args[2])}); this.Emit('raw',[this.CID,Event,Args.join(" ") + " " + Extra,IRCv3]); }
        else if (Event == "332") { this.ICLUpdate(Args[1],{topic: Extra}); this.Emit('raw',[this.CID,Event,Args.join(" ") + " " + Extra,IRCv3]); }
        else if (Event == "346") { if (this.ICL.hasOwnProperty(Args[1].toLowerCase())) { this.ICL[Args[1].toLowerCase()].addInvite(Args[2],Args[3],parseInt((Extra ? Extra : Args[4]))); } this.Emit('raw',[this.CID,Event,Args.join(" ") + " " + Extra,IRCv3]); }
        else if (Event == "348") { if (this.ICL.hasOwnProperty(Args[1].toLowerCase())) { this.ICL[Args[1].toLowerCase()].addExcept(Args[2],Args[3],parseInt((Extra ? Extra : Args[4]))); } this.Emit('raw',[this.CID,Event,Args.join(" ") + " " + Extra,IRCv3]); }
        else if (Event == "333") { this.ICLUpdate(Args[1],{topicby: Args[2],topicset: parseInt((Args.length > 3 ? Args[3] : Extra))}); this.Emit('raw',[this.CID,Event,Args.join(" ") + " " + Extra,IRCv3]); }
        else if (Event == "352") { this.IALUpdate(Args[5],{address: Args[2] + '@' + Args[3],away: Args[6],gecos: Extra.substr(Extra.indexOf(' ') +1)}); this.Emit('raw',[this.CID,Event,Args.join(" ") + " " + Extra,IRCv3]); }
        else if (Event == "353") {
          var chan = (!this.isChan(Args[1]) ? Args[2] : Args[1]);
          var expr = new RegExp("(?:^| )([" + this.Prefix + "]+)?([^! ]+)!?([^ ]+)?","g"), result;
          while (result = expr.exec(Extra)) {
            this.IALAdd(result[2],result[3]);
            this.IAL[result[2]].addChan(chan,result[1]);
            if (this.ICL.hasOwnProperty(chan.toLowerCase())) { this.ICL[chan.toLowerCase()].addNick(result[2]); }
          }
          this.Emit('raw',[this.CID,Event,Args.join(" ") + " " + Extra,IRCv3]);
        }
        else if (Event == "366") { 
          if (this.ICL.hasOwnProperty(Args[1].toLowerCase())) { this.SortNicks(Args[1].toLowerCase(),this.ICL[Args[1].toLowerCase()].Nicks); } 
          this.Emit('raw',[this.CID,Event,Args.join(" ") + " " + Extra,IRCv3]);
        }
        else if (Event == "367") { if (this.ICL.hasOwnProperty(Args[1].toLowerCase())) { this.ICL[Args[1].toLowerCase()].addBan(Args[2],Args[3],parseInt((Extra ? Extra : Args[4]))); } this.Emit('raw',[this.CID,Event,Args.join(" ") + " " + Extra,IRCv3]); }
        else if (Event == "376" || Event == "422") { this.Emit('connect',[this.CID,this.Socket.readyState]); this.Emit('raw',[this.CID,Event,Args.join(" ") + " " + Extra,IRCv3]); }
        else if (Event == "728") { if (this.ICL.hasOwnProperty(Args[1].toLowerCase())) { this.ICL[Args[1].toLowerCase()].addQuiet(Args[2],Args[3],parseInt(Args[4])); } this.Emit('raw',[this.CID,Event,Args.join(" ") + " " + Extra,IRCv3]); }
  
        //IRCv3 special events
        else if (/^ACCOUNT$/i.test(Event)) { this.IALUpdate(Nick,{account: Args[0]}); }
        else if (/^AWAY$/i.test(Event)) { this.IALUpdate(Nick,{away: (Extra != '' ? 'G' : 'H')}); }
        else if (/^BATCH$/i.test(Event)) { //IRCv3 like privmsg but for client-only tags reporting stuff with no content (Extra)
          if (/^\+(.*)$/.test(Args[0])) { this.IrcV3Batch[RegExp.$1] = {type: Args[1], lines: []}; }
          else if (/^\-(.*)$/.test(Args[0])) { 
            this.Emit(Event.toLowerCase(),[this.CID,"BATCH",this.IrcV3Batch[RegExp.$1]]);
            var lines = this.IrcV3Batch[RegExp.$1].lines.splice(0);
            delete this.IrcV3Batch[RegExp.$1]; 
            lines.forEach((line) => { this.ParseLine(line); });
          }
          //this.IALUpdate(Nick,{'address': Address,'idle': Math.floor(Date.now() / 1000)});
          //this.Emit(Event.toLowerCase(),[this.CID,Nick,Address,Args[0],IRCv3]);
        }

        else if (/^SETNAME$/i.test(Event)) { this.IALUpdate(Nick,{gecos: Extra}); }
        else if (/^CHGHOST$/i.test(Event)) { this.IALUpdate(Nick,{address: Args[0] + "@" + Args[1]}); }
        //End of IRCv3 special events

        else if (/^ERROR$/i.test(Event)) { this.Emit(Event.toLowerCase(),[this.CID,Extra,IRCv3]); }
        else if (/^INVITE$/i.test(Event)) { 
          this.IALUpdate(Nick,{'address': Address,'idle': Math.floor(Date.now() / 1000)});
          this.Emit(Event.toLowerCase(),[this.CID,Nick,Address,Extra,IRCv3]); 
        }
        else if (/^JOIN$/i.test(Event)) {
          this.IALAdd(Nick,Address);
          if (this.isChan(Args[0])) { 
            //must be using IRCv3 extended-join...
            this.IALUpdate(Nick,{account: Args[1], gecos: Extra});
          }
          var chan = (this.isChan(Args[0]) ? Args[0] : Extra);
          if (Nick == this.Me) { 
            this.ICLAdd(chan);
            if (this.Socket) { 
              this.WSSend('MODE ' + chan); 
              if (this.IrcV3Cap.includes('away-notify')) { this.WSSend('WHO ' + chan); }
            }
          }
          else {
            this.ICL[chan.toLowerCase()].addNick(Nick);
            this.IAL[Nick].addChan(chan,'');
          }
          this.SortNicks(chan.toLowerCase(),this.ICL[chan.toLowerCase()].Nicks);
          this.Emit(Event.toLowerCase(),[this.CID,Nick,Address,chan,IRCv3]);
        }
        else if (/^KICK$/i.test(Event)) {
          this.IALUpdate(Nick,{'address': Address,'idle': Math.floor(Date.now() / 1000)});
          if (Args[1] == this.Me) { this.ICLDel(Args[0]); }
          else { 
            this.IAL[Args[1]].delChan(Args[0]); this.ICL[Args[0].toLowerCase()].delNick(Args[1]); 
            if (Object.keys(this.IAL[Args[1]].channels).length == 0) { this.IALDel(Args[1]); }
          }
          this.Emit(Event.toLowerCase(),[this.CID,Nick,Address,Args[0],Args[1],Extra,IRCv3]);
        }
        else if (/^MODE$/i.test(Event)) {
          if (this.isChan(Args[0])) {
            var Middle = Args.slice(2).join(" ") , Parms = ((Middle != '' ? Middle : '') + (Extra != '' ? (Middle != '' ? " " : "") + Extra : "")) || '';
            this.ParseModes(Nick,Address,Args[0],Args[1],Parms);
            this.Emit(Event.toLowerCase(),[this.CID,Nick,Address,Args[0],Args[1] + (Parms != '' ? " " + Parms : ''),IRCv3]);
          }
          else { 
            this.ParseModes(Nick,Address,Args[0],Args[1] || Extra,Args.slice(2).join(" ") || "");
            this.Emit('umode',[this.CID,Extra,IRCv3]); 
          }
        }
        else if (/^NICK$/i.test(Event)) {
          var newnick = Args[0] || Extra;
          if (Nick == this.Me) { this.Me = newnick; }
          this.IALRen(Nick,newnick);
          this.Emit(Event.toLowerCase(),[this.CID,Nick,Address,newnick,IRCv3]);
        }
        else if (/^NOTICE$/i.test(Event)) { 
          this.IALUpdate(Nick,{'address': Address,'idle': Math.floor(Date.now() / 1000)});
          if (Extra.match(/^((?!DCC).+(?: .*)?)$/i)) { this.Emit('ctcpreply',[this.CID,Nick,Address,Args[0],RegExp.$1,IRCv3]); }
          else { this.Emit(Event.toLowerCase(),[this.CID,Nick,Address,Args[0],Extra,IRCv3]); }
        }
        else if (/^PART$/i.test(Event)) {
          this.IALUpdate(Nick,{'address': Address,'idle': Math.floor(Date.now() / 1000)});
          var chan = (this.isChan(Extra) ? Extra : Args[0]);
          if (Nick == this.Me) { this.ICLDel(chan); }
          else { 
            this.IAL[Nick].delChan(chan); 
            this.ICL[chan.toLowerCase()].delNick(Nick); 
            if (Object.keys(this.IAL[Nick].channels).length == 0) { this.IALDel(Nick); }
          }
          if (!this.isChan(Extra)) { this.Emit(Event.toLowerCase(),[this.CID,Nick,Address,chan,Extra,IRCv3]); }
          else { this.Emit(Event.toLowerCase(),[this.CID,Nick,Address,chan,IRCv3]); }
        }
        else if (/^PRIVMSG$/i.test(Event)) {
          this.IALUpdate(Nick,{'address': Address,'idle': Math.floor(Date.now() / 1000)});
          if (this.isChan(Args[0])) { this.ICL[Args[0].toLowerCase()].idle = Math.floor(Date.now() / 1000); }
          if (Extra.match(/^ACTION (.*)$/i)) { this.Emit('action',[this.CID,Nick,Address,Args[0],RegExp.$1,IRCv3]); }
          else if (Extra.match(/^((?!DCC).+(?: .*)?)$/i)) { this.Emit('ctcp',[this.CID,Nick,Address,Args[0],RegExp.$1,IRCv3]); }
          else { this.Emit(Event.toLowerCase(),[this.CID,Nick,Address,Args[0],Extra,IRCv3]); }
        }
        else if (/^TAGMSG$/i.test(Event)) { //IRCv3 like privmsg but for client-only tags reporting stuff with no content (Extra)
          this.IALUpdate(Nick,{'address': Address,'idle': Math.floor(Date.now() / 1000)});
          this.Emit(Event.toLowerCase(),[this.CID,Nick,Address,Args[0],IRCv3]);
        }
        else if (/^TOPIC$/i.test(Event)) {
          this.IALUpdate(Nick,{'address': Address,'idle': Math.floor(Date.now() / 1000)});
          this.ICLUpdate(Args[0],{topic: Extra,topicby: Nick,topicset: Math.floor(Date.now() / 1000)})
          this.Emit(Event.toLowerCase(),[this.CID,Nick,Address,Args[0],Extra,IRCv3]);
        }
        else if (/^QUIT$/i.test(Event)) { 
          this.Emit(Event.toLowerCase(),[this.CID,Nick,Address,Extra,IRCv3]);
          this.IALDel(Nick); 
        }
        else { this.Emit('raw',[this.CID,Event,Args.join(" ") + " " + Extra,IRCv3]); }
      }
    }
  
    ParseModes(nick,address,target,modes,parms) {
      var bothmodes = this.NickMode + this.ChanModes, InMode = modes.split(""), InParm = parms.split(/ /), RequireParm = bothmodes.split(/,/), porm = "", parmcnt = 0;
      if (this.isChan(target)) {
        InMode.forEach(function(mode,index,_array) {
        var rxMode = new RegExp("[" + mode + "]"), handled = 0;
        if (/[+-]/.test(mode)) { porm = mode; }
        else {
          RequireParm.forEach(function(rparm,index,_array) {
            if (rxMode.test(rparm)) {
              if ((index == 0 || index == 1) || (index == 2 && porm == "+")) {
                var rxNmode = new RegExp("[" + mode + "]");
                if (rxNmode.test(this.NickMode)) {
                  //modify nick prefix in channel
                  var pos = this.NickMode.indexOf(mode);
                  if (pos > -1) { 
                    if (this.IAL.hasOwnProperty(InParm[parmcnt])) { 
                      if (porm == '+') { this.IAL[InParm[parmcnt]].addPrefix(target,this.Prefix.substr(pos,1),this.Prefix); }
                      else { this.IAL[InParm[parmcnt]].delPrefix(target,this.Prefix.substr(pos,1)); }
                      this.SortNicks(target.toLowerCase(),this.ICL[target.toLowerCase()].Nicks);
                    } 
                  }
                  handled = 1;
                }
                else {
                  //modify channel modes (requires parms)
                  if (porm == "+") {
                    if (bothmodes.includes(mode)) {
                      if (mode == "b") { this.ICL[target.toLowerCase()].addBan(InParm[parmcnt],nick,Math.floor(Date.now() / 1000)); handled = 1; }
                      else if (mode == "e") { this.ICL[target.toLowerCase()].addExcept(InParm[parmcnt],nick,Math.floor(Date.now() / 1000)); handled = 1; }
                      else if (mode == "I") { this.ICL[target.toLowerCase()].addInvite(InParm[parmcnt],nick,Math.floor(Date.now() / 1000)); handled = 1; }
                      else if (mode == "q") { this.ICL[target.toLowerCase()].addQuiet(InParm[parmcnt],nick,Math.floor(Date.now() / 1000)); handled = 1; }
                    }
                    else { this.ICL[target.toLowerCase()].addMode(mode,InParm[parmcnt]); }
                  }
                  else { 
                    if (bothmodes.includes(mode)) {
                      if (mode == "b") { this.ICL[target.toLowerCase()].delBan(InParm[parmcnt]); }
                      else if (mode == "e") { this.ICL[target.toLowerCase()].delExcept(InParm[parmcnt]); }
                      else if (mode == "I") { this.ICL[target.toLowerCase()].delInvite(InParm[parmcnt]); }
                      else if (mode == "q") { this.ICL[target.toLowerCase()].delQuiet(InParm[parmcnt]); }
                    }
                    else { this.ICL[target.toLowerCase()].delMode(mode); }
                  }
                }
                parmcnt++;
              }
            }
          },this);
          if (!handled) {
            //modify channel modes (no parms)
            if (porm == "+") { this.ICL[target.toLowerCase()].addMode(mode,""); }
            else { this.ICL[target.toLowerCase()].delMode(mode); }
          }
        }
      },this);
    }
    else {
      InMode.forEach(function(mode,index,_array) {
        if (/[+-]/.test(mode)) { porm = mode; }
        else {
          if (porm == "+") { this.addUMode(mode); }
          else { this.delUMode(mode); }
        }
      },this);
    }		
  }
  //useful Identifiers
  //TODO: isban, isinvite and isexcept chan() comchan() ial() ialchan() ibl() iel() iil()
  address(nick,level) { 
    if (this.IAL.hasOwnProperty(nick)) { return this.mask(nick + "!" + this.IAL[nick].address,level); }
    else { return this.mask(nick + "!user@host",level); }
  }
  isChan(chan) { var tmp = new RegExp('^(?:[' + this.Prefix + '])?[' + this.ChanTypes + ']'); return tmp.test(chan); }
  isOn(nick,chan) { if (this.ICL.hasOwnProperty(chan.toLowerCase())) { return (this.ICL[chan.toLowerCase()].Nicks.indexOf(nick) == -1 ? false : true); } return false; }
  isOp(nick,chan) { if (this.IAL.hasOwnProperty(nick) && this.IAL[nick].channels.hasOwnProperty(chan.toLowerCase())) { return (this.IAL[nick].channels[chan.toLowerCase()].indexOf("@") == -1 ? false : true); } return false; }
  isHop(nick,chan) { if (this.IAL.hasOwnProperty(nick) && this.IAL[nick].channels.hasOwnProperty(chan.toLowerCase())) { return (this.IAL[nick].channels[chan.toLowerCase()].indexOf("%") == -1 ? false : true); } return false; }
  isVoice(nick,chan) { if (this.IAL.hasOwnProperty(nick) && this.IAL[nick].channels.hasOwnProperty(chan.toLowerCase())) { return (this.IAL[nick].channels[chan.toLowerCase()].indexOf("+") == -1 ? false : true); } return false; }
  isReg(nick,chan) { if (this.IAL.hasOwnProperty(nick) && this.IAL[nick].channels.hasOwnProperty(chan.toLowerCase())) { return (this.IAL[nick].channels[chan.toLowerCase()] == "" ? true : false); } return false; }
  isNickMode(nick,mode,chan) { if (this.IAL.hasOwnProperty(nick) && this.IAL[nick].channels.hasOwnProperty(chan.toLowerCase())) { return (this.IAL[nick].channels[chan.toLowerCase()].indexOf(this.Prefix.substr(this.NickMode.indexOf(mode),1)) == -1 ? false : true); } return false; }
      
  isWm(wc,mc) { var expr = new RegExp("^" + wc.replace(/(\W)/g,function(str,backref) { return (backref == "*" ? ".*" : (backref == "?" ? "." : "\\" + backref)); }) + "$","i");  return expr.test(mc); }
  isWmCS(wc,mc) { var expr = new RegExp("^" + wc.replace(/(\W)/g,function(str,backref) { return (backref == "*" ? ".*" : (backref == "?" ? "." : "\\" + backref)); }) + "$");  return expr.test(mc); }
  mask(wc,l) {
    var wl = l % 10;
    if (wl == 0) { wc = wc.replace(/^[^!]+/,"*"); }
    else if (wl == 1 || wl == 3) { wc = wc.replace(/^[^!]+![~^*-+=]?/,"*!*"); }
    else if (wl == 2 || wl == 4) { wc = wc.replace(/[^!]+![^@]+/,"*!*"); }
    else if (wl == 6 || wl == 8) { wc = wc.replace(/![~^*-+=]?/,"!*"); }
    else if (wl == 7 || wl == 9) { wc = wc.replace(/![^@]+/,"!*"); }		
    if (/\@\d+\.\d+\.\d+\.[^.]+$/.test(wc)) { if (wl == 3 || wl == 4 || wl == 8 || wl == 9) { wc = wc.replace(/\.[^.]+$/,".*"); } } //Masking for IPv4's
    else { 
      if (wl == 3 || wl == 4 || wl == 8 || wl == 9) { 
        if (l < 10) { wc = wc.replace(/@[^.]+\./,"@*."); }
        else if (wc.match(/(@[^.]+\.(?:[^.]+\.)?)/)) { wc = wc.replace(RegExp.$1,RegExp.$1.replace(/\d/g,"?")); }
      }
    } //Masking for Domains
    wl = null;
    return wc;
    }
  }