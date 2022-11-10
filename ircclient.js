/*================================================================================================
  Item class for Internal Address List
================================================================================================*/
class IALItem {
    constructor(address) {
      this.idle = Math.floor(Date.now() / 1000);
      this.address = address;
      this.channels = {}; // chan = prefix, Example {'#mIRC': '@%+'}
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
      this.mode = '';
      this.key = '';
      this.limit = 0;
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
      addMode(mode) { if (this.mode.indexOf(mode) < 0) { this.mode += mode; } }
      delMode(mode) { if (this.mode.indexOf(mode) > -1) { this.mode = this.mode.replace(mode,""); } }
      addNick(nick) { if (!this.Nicks.includes(nick)) { this.Nicks.push(nick); } }
      delNick(nick) { if (this.Nicks.includes(nick)) { this.Nicks.splice(this.Nicks.indexOf(nick),1); } }
  }    
  
  /*================================================================================================
    IRC Client class
  ================================================================================================*/
  class IRCClient {
    constructor(cid,nick,server,args) {
      this.Listeners = {action: [],connect: [],chghost: [],ctcp: [],ctcpreply: [],disconnect: [],invite: [],join: [],kick: [],logon: [],mode: [],nick: [],notice: [],part: [],ping: [],pong: [],quit: [],raw: [],snotice: [],smode: [],privmsg: [],topic: [],umode: []}; //Collection of callbacks for IRC related events
      this.IAL = {}; //Internal Address List Object
      this.ICL = {}; //Internal Channels List Object
      this.CID = cid;
      this.Server = '';
      this.Port = '';
      this.Me = nick || '';
      this.UMode = '';
      this.ChanModes = 'bIe,k,l';
      this.ChanTypes = '#&';
      this.ModeSpl = 3;
      this.Network = '';
      this.NickMode = 'ohv';
      this.Prefix = '@%+';
    }
    WSConnect(nick,server,type,blockLogon) {
      this.WSClose();
      if (nick) { this.Me = nick; }
      this.Server = server;
      this.WSServerURI = server;
      this.Socket = new WebSocket(server,type);
      this.Socket.addEventListener('open', () => { 
        if (!blockLogon) { this.Emit('logon',[this.CID]); }
        this.WSSend('NICK ' + this.Me);
        this.WSSend('USER ' + this.Me + ' 0 * :' + this.Me); 
      });
      this.Socket.addEventListener('message', async e => { this.ParseLine((e.data instanceof Blob ? await e.data.text() : e.data)); });
      //this.Socket.addEventListener('error', (e) => { console.log(e); });
      this.Socket.addEventListener('close', (e) => { this.WSClosed(); });
    }
    WSSend(data) {
      if (this.hasOwnProperty('Socket')) {
        this.Socket.send(data);
        if (this.PingSocket) { clearInterval(this.PingSocket); }
        this.PingSocket = setInterval(() => { this.WSSend("PING " + this.Me); },"60000");
      }
    }
    WSClose() { if (this.hasOwnProperty('Socket') && this.Socket.readyState <= 1) { this.Socket.close(); } }
    WSClosed() {
      this.Emit('disconnect',[this.CID]);
      this.IAL = {}; //Internal Address List Object
      this.ICL = {}; //Internal Channels List Object
      this.UMode = '';
      this.ChanModes = 'bIe,k,l';
      this.ChanTypes = '#&';
      this.ModeSpl = 3;
      this.Network = '';
      this.NickMode = 'ohv';
      this.Prefix = '@%+';
    }
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
      if (data.match(/^(?:\x3a(\S+) )?(\d{3}|[a-zA-Z]+)(?: ((?:[^\x00\x0a\x0d\x20\x3a][^\x00\x0a\x0d\x20]*)(?: [^\x00\x0a\x0d\x20\x3a][^\x00\x0a\x0d\x20]*)*))?(?: \x3a([^\x00\x0a\x0d]*))?\x20*$/)) {
        var FullAddress = RegExp.$1, Event = RegExp.$2, Args = RegExp.$3 || '', Extra = RegExp.$4, tmp = FullAddress.split(/!(.*)?$/,2), Nick = tmp[0], Address = tmp[1];
        Args = Args.split(' ');
        if (!FullAddress && /^PING$/i.test(Event)) { 
          this.Emit('ping',[this.CID,Extra]); 
          if (this.Socket) { this.WSSend('PONG ' + Extra); }
        }
        else if (Event == "001") {
          this.Me = Args[0];
          this.Server = Nick;
        }
        else if (Event == "005") {
          Args.forEach(function(arg,index,_array) {
            if (arg.match(/^CHANMODES=([^ ]+)$/i)) { this.ChanModes = RegExp.$1; }
            else if (arg.match(/^CHANTYPES=([^ ]+)$/i)) { this.ChanTypes = RegExp.$1; }
            else if (arg.match(/^MODES=(\d+)$/i)) { this.ModeSpl = parseInt(RegExp.$1); }
            else if (arg.match(/^NETWORK=([^ ]+)$/i)) { this.Network = RegExp.$1; }
            else if (arg.match(/^PREFIX=\((\w+)\)([^ ]+)$/i)) {
              this.NickMode = RegExp.$1;
              this.Prefix = RegExp.$2;
            }
            else if (arg.match(/^(?:NAMESX|UHNAMES)$/i)) { this.WSSend('PROTOCTL ' + arg); }
          },this);
        }
        else if (Event == "221") { this.UMode = Extra.replace("+",""); }
        else if (Event == "302") { if (Extra.match(/^([^=*]+)(?:\*)?=(?:[+-])(.*)$/)) { this.IALUpdate(RegExp.$1,{address: RegExp.$2}); } }
        else if (Event == "324") { 
          if (this.ICL.hasOwnProperty(Args[1].toLowerCase())) {
            var arg = Args.slice(2).join(" ");
            if (arg.match(/^([^ ]+) ?(.*)?$/)) { this.ParseModes(FullAddress,"",Args[1],RegExp.$1,RegExp.$2); }
          } 
        }
        else if (Event == "329") { this.ICLUpdate(Args[1],{created: parseInt(Args[2])}); }
        else if (Event == "332") { this.ICLUpdate(Args[1],{topic: Extra}); }
        else if (Event == "346") { if (this.ICL.hasOwnProperty(Args[1].toLowerCase())) { this.ICL[Args[1].toLowerCase()].addInvite(Args[2],Args[3],parseInt(Args[4])); } }
        else if (Event == "348") { if (this.ICL.hasOwnProperty(Args[1].toLowerCase())) { this.ICL[Args[1].toLowerCase()].addExcept(Args[2],Args[3],parseInt(Args[4])); } }
        else if (Event == "333") { this.ICLUpdate(Args[1],{topicby: Args[2],topicset: parseInt(Args[3])}); }
        else if (Event == "352") { this.IALUpdate(Args[5],{address: Args[2] + '@' + Args[3]}); }
        else if (Event == "353") {
          var chan = (!this.isChan(Args[1]) ? Args[2] : Args[1]);
          var expr = new RegExp("(?:^| )([" + this.Prefix + "]+)?([^! ]+)!?([^ ]+)?","g"), result;
          while (result = expr.exec(Extra)) {
            this.IALAdd(result[2],result[3]);
            this.IAL[result[2]].addChan(chan,result[1]);
            if (this.ICL.hasOwnProperty(chan.toLowerCase())) { this.ICL[chan.toLowerCase()].addNick(result[2]); }
          }          
        }
        else if (Event == "366") { if (this.ICL.hasOwnProperty(Args[1].toLowerCase())) { this.SortNicks(Args[1].toLowerCase(),this.ICL[Args[1].toLowerCase()].Nicks); } }
        else if (Event == "367") { if (this.ICL.hasOwnProperty(Args[1].toLowerCase())) { this.ICL[Args[1].toLowerCase()].addBan(Args[2],Args[3],parseInt(Args[4])); } }
        else if (Event == "376" || Event == "422") { this.Emit('connect',[this.CID]); }
  
        else if (/^INVITE$/i.test(Event)) { 
          this.IALUpdate(Nick,{'address': Address,'idle': Math.floor(Date.now() / 1000)});
          this.Emit(Event.toLowerCase(),[this.CID,Nick,Address,Extra]); 
        }
        else if (/^JOIN$/i.test(Event)) {
          this.IALAdd(Nick,Address);
          var chan = (this.isChan(Extra) ? Extra : Args[0]);
          if (Nick == this.Me) { 
            this.ICLAdd(chan);
            if (this.Socket) { this.WSSend('MODE ' + chan); }
          }
          else {
            this.ICL[chan.toLowerCase()].addNick(Nick);
            this.IAL[Nick].addChan(chan,'');
          }
          this.SortNicks(chan.toLowerCase(),this.ICL[chan.toLowerCase()].Nicks);
          this.Emit(Event.toLowerCase(),[this.CID,Nick,Address,chan]);
        }
        else if (/^KICK$/i.test(Event)) {
          this.IALUpdate(Nick,{'address': Address,'idle': Math.floor(Date.now() / 1000)});
          if (Args[1] == this.Me) { this.ICLDel(Args[0]); }
          else { 
            this.IAL[Args[1]].delChan(Args[0]); this.ICL[Args[0].toLowerCase()].delNick(Args[1]); 
            if (Object.keys(this.IAL[Args[1]].channels).length == 0) { this.IALDel(Args[1]); }
          }
          this.Emit(Event.toLowerCase(),[this.CID,Nick,Address,Args[0],Args[1],Extra]);
        }
        else if (/^MODE$/i.test(Event)) {
          if (this.isChan(Args[0])) {
            var Middle = Args.slice(2).join(" ") , Parms = ((Middle != '' ? Middle : '') + (Extra != '' ? " " + Extra : "")) || '';
            this.ParseModes(Nick,Address,Args[0],Args[1],Parms);
            this.Emit(Event.toLowerCase(),[this.CID,Nick,Address,Args[0],Args[1] + (Parms != '' ? " " + Parms : '')]);
          }
          else { 
            this.ParseModes(Nick,Address,Args[0],Args[1] || Extra,Args.slice(2).join(" ") || "");
            this.Emit('umode',[this.CID,Extra]); 
          }
        }
        else if (/^NICK$/i.test(Event)) {
          if (Nick == this.Me) { this.Me = Extra; }
          this.IALRen(Nick,Extra);
          this.Emit(Event.toLowerCase(),[this.CID,Nick,Address,Extra]);
        }
        else if (/^NOTICE$/i.test(Event)) { 
          this.IALUpdate(Nick,{'address': Address,'idle': Math.floor(Date.now() / 1000)});
          if (Extra.match(/^((?!DCC).+(?: .*)?)$/i)) { this.Emit('ctcpreply',[this.CID,Nick,Address,Args[0],RegExp.$1]); }
          else { this.Emit(Event.toLowerCase(),[this.CID,Nick,Address,Args[0],Extra]); }
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
          if (!this.isChan(Extra)) { this.Emit(Event.toLowerCase(),[this.CID,Nick,Address,chan,Extra]); }
          else { this.Emit(Event.toLowerCase(),[this.CID,Nick,Address,chan]); }
        }
        else if (/^PRIVMSG$/i.test(Event)) {
          this.IALUpdate(Nick,{'address': Address,'idle': Math.floor(Date.now() / 1000)});
          if (this.isChan(Args[0])) { this.ICL[Args[0].toLowerCase()].idle = Math.floor(Date.now() / 1000); }
          if (Extra.match(/^ACTION (.*)$/i)) { this.Emit('action',[this.CID,Nick,Address,Args[0],RegExp.$1]); }
          else if (Extra.match(/^((?!DCC).+(?: .*)?)$/i)) { this.Emit('ctcp',[this.CID,Nick,Address,Args[0],RegExp.$1]); }
          else { this.Emit(Event.toLowerCase(),[this.CID,Nick,Address,Args[0],Extra]); }
        }
        else if (/^TOPIC$/i.test(Event)) {
          this.IALUpdate(Nick,{'address': Address,'idle': Math.floor(Date.now() / 1000)});
          this.ICLUpdate(Args[0],{topic: Extra,topicby: Nick,topicset: Math.floor(Date.now() / 1000)})
          this.Emit(Event.toLowerCase(),[this.CID,Nick,Address,Args[0],Extra]);
        }
        else if (/^QUIT$/i.test(Event)) { 
          this.Emit(Event.toLowerCase(),[this.CID,Nick,Address,Extra]);
          this.IALDel(Nick); 
        }
        if (/^\d+$/i.test(Event)) { this.Emit('raw',[this.CID,Event,Args.join(" ") + " " + Extra]); }
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
                    if (mode == "b") { this.ICL[target.toLowerCase()].addBan(InParm[parmcnt],nick,Math.floor(Date.now() / 1000)); handled = 1; }
                    else if (mode == "I") { this.ICL[target.toLowerCase()].addInvite(InParm[parmcnt],nick,Math.floor(Date.now() / 1000)); handled = 1; }
                    else if (mode == "e") { this.ICL[target.toLowerCase()].addExcept(InParm[parmcnt],nick,Math.floor(Date.now() / 1000)); handled = 1; }
                    else if (mode == "k") { this.ICL[target.toLowerCase()].key = InParm[parmcnt]; handled = 1; }
                    else if (mode == "l") { this.ICL[target.toLowerCase()].limit = parseInt(InParm[parmcnt]); handled = 1; }
                  }
                  else { 
                    if (mode == "b") { this.ICL[target.toLowerCase()].delBan(InParm[parmcnt]); }
                    else if (mode == "I") { this.ICL[target.toLowerCase()].delInvite(InParm[parmcnt]); }
                    else if (mode == "e") { this.ICL[target.toLowerCase()].delExcept(InParm[parmcnt]); }
                    else if (mode == "k") { this.ICL[target.toLowerCase()].key = ''; } 
                  }
                }
                parmcnt++;
              }
            }
          },this);
          if (!handled) {
            //modify channel modes (no parms)
            if (porm == "+") { this.ICL[target.toLowerCase()].addMode(mode); }
            else if (porm == "-" && mode == "l") { this.ICL[target.toLowerCase()].limit = 0; }
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
  isChan(chan) { var tmp = new RegExp('^[' + this.ChanTypes + ']'); return tmp.test(chan); }
  isQuery(nick) { return this.IQL.hasOwnProperty(nick) }
  isOn(nick,chan) { if (this.ICL.hasOwnProperty(chan.toLowerCase())) { return (this.ICL[chan.toLowerCase()].Nicks.indexOf(nick) == -1 ? false : true); } return false; }
  isOp(nick,chan) { if (this.IAL.hasOwnProperty(nick) && this.IAL[nick].channels.hasOwnProperty(chan.toLowerCase())) { return (this.IAL[nick].channels[chan.toLowerCase()].indexOf("@") == -1 ? false : true); } return false; }
  isHop(nick,chan) { if (this.IAL.hasOwnProperty(nick) && this.IAL[nick].channels.hasOwnProperty(chan.toLowerCase())) { return (this.IAL[nick].channels[chan.toLowerCase()].indexOf("%") == -1 ? false : true); } return false; }
  isVoice(nick,chan) { if (this.IAL.hasOwnProperty(nick) && this.IAL[nick].channels.hasOwnProperty(chan.toLowerCase())) { return (this.IAL[nick].channels[chan.toLowerCase()].indexOf("+") == -1 ? false : true); } return false; }
  isReg(nick,chan) { if (this.IAL.hasOwnProperty(nick) && this.IAL[nick].channels.hasOwnProperty(chan.toLowerCase())) { return (this.IAL[nick].channels[chan.toLowerCase()] == "" ? true : false); } return false; }
      
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