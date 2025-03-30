/*---------------------------------------------------------------------------------------------------------
  General Config
---------------------------------------------------------------------------------------------------------*/

class ConfigGeneral extends QDialog {
  constructor(mainapp) {
    super();
    this.setWindowFlag(Qt.WindowType.WindowMinMaxButtonsHint,false);
    /*-------------------------------------------------------------------------------------------------
	  Private Properties
    -------------------------------------------------------------------------------------------------*/
	this._MetaObject.push("ConfigGeneral");
    this.classList.add("ConfigGeneral");
    this._Root = mainapp;

    /*-------------------------------------------------------------------------------------------------
    Build UI Components

        //Connect
        'MNick': "",
        'ANick': "",
        //Options
        'QuitMessage': "Web-IRC v1.0 Beta https://chat.swiftirc.net/",
        'ConnectOnStartup': false,
        'ReconnectOnDisconnect': true,
        'ShowQuickConnectOnStartup': true,
        'UseInvisibleMode': true,
        //IRC
        'PrefixMessages': true,
        'StartQueriesMinimized': false,
        'WhoisOnQueryOpen': false,
        'KeepChannelsOpen': true,
        'AutoJoinOnInvite': false,
        'RejoinWhenKicked': true,
        'RejoinOnConnect': true,
        'ShortChannelEvents': true,
        'ShowUserAddress': true,
        'SendIRCv3Typing': true,
        'TimestampEvents': true,
        'TimestampFormat': "[HH:nn]",
        'StripControlCodes': false,
        'SplitLongMessages': true,
        //Sounds
        'EnableSounds': false,
        'BeepOnChannelMsg': false,
        'BeepOnQueryMsg': false,
        //Mouse
        'StatusDoubleClick': "/lusers",
        'QueryDoubleClick': "/whois",
        'ChannelDoubleClick': "/channel",
        'NicklistDoubleClick': "/query",
        //Display
        'ShowNetworkInTitle': true,
        'ShowNicknameInTitle': false,
        'ShowNicknameInTree': true,
        'WindowBuffer': 500,
        //Other
        'ConfirmCloseStatusStillConnected': false,
        'ConfirmLargePastes': false,


    -------------------------------------------------------------------------------------------------*/
	  this._Container = QuickElement('div',{style: "overflow: auto;"},'Connect Options:');
    QuickElement('br',{},'',this._Container);
    QuickElement('span',{},'Main Nick:',this._Container);
    this._MNick = QuickElement('input',{type: "text"},'',this._Container);
    QuickElement('br',{},'',this._Container);
    QuickElement('span',{},'Alt. Nick:',this._Container);
    this._ANick = QuickElement('input',{type: "text"},'',this._Container);
    QuickElement('br',{},'',this._Container);
    QuickElement('span',{},'Quit Message:',this._Container);
    this._QMsg = QuickElement('input',{type: "text"},'',this._Container);
    QuickElement('br',{},'',this._Container);
    this._CStartup = QuickElement('input',{type: "checkbox"},'',this._Container);
    QuickElement('span',{},'Connect on Startup',this._Container);
    QuickElement('br',{},'',this._Container);
    this._CReconnect = QuickElement('input',{type: "checkbox"},'',this._Container);
    QuickElement('span',{},'Reconnect on Disconnect',this._Container);
    QuickElement('br',{},'',this._Container);
    this._CQStartup = QuickElement('input',{type: "checkbox"},'',this._Container);
    QuickElement('span',{},'Show QuickConnect on Startup',this._Container);
    QuickElement('br',{},'',this._Container);
    this._CInvisible = QuickElement('input',{type: "checkbox"},'',this._Container);
    QuickElement('span',{},'Use Invisible Mode',this._Container);

    QuickElement('p',{},'',this._Container);
    QuickElement('span',{},'IRC Options:',this._Container);
    QuickElement('br',{},'',this._Container);

    this._CPrefix = QuickElement('input',{type: "checkbox"},'',this._Container);
    QuickElement('span',{},'Prefix Messages',this._Container);
    QuickElement('br',{},'',this._Container);
    this._CQuery = QuickElement('input',{type: "checkbox"},'',this._Container);
    QuickElement('span',{},'Start Queries Minimized',this._Container);
    QuickElement('br',{},'',this._Container);
    this._CWQuery = QuickElement('input',{type: "checkbox"},'',this._Container);
    QuickElement('span',{},'Whois On Query',this._Container);
    QuickElement('br',{},'',this._Container);
    this._CKeepChans = QuickElement('input',{type: "checkbox"},'',this._Container);
    QuickElement('span',{},'Keep Channels Open (Kick/Quit/Disconnect)',this._Container);
    QuickElement('br',{},'',this._Container);
    this._CInvite = QuickElement('input',{type: "checkbox"},'',this._Container);
    QuickElement('span',{},'Auto-Join on Invite',this._Container);
    QuickElement('br',{},'',this._Container);
    this._CRejoin = QuickElement('input',{type: "checkbox"},'',this._Container);
    QuickElement('span',{},'Rejoin when Kicked',this._Container);
    QuickElement('br',{},'',this._Container);
    this._CRejoinConnect = QuickElement('input',{type: "checkbox"},'',this._Container);
    QuickElement('span',{},'Rejoin Channels on Connect',this._Container);
    QuickElement('br',{},'',this._Container);
    this._CEvents = QuickElement('input',{type: "checkbox"},'',this._Container);
    QuickElement('span',{},'Short Channel Events',this._Container);
    QuickElement('br',{},'',this._Container);
    this._CAddress = QuickElement('input',{type: "checkbox"},'',this._Container);
    QuickElement('span',{},'Show User Address',this._Container);
    QuickElement('br',{},'',this._Container);
    this._CTyping = QuickElement('input',{type: "checkbox"},'',this._Container);
    QuickElement('span',{},'Send Typing Notifications',this._Container);
    QuickElement('br',{},'',this._Container);
    this._CStrip = QuickElement('input',{type: "checkbox"},'',this._Container);
    QuickElement('span',{},'Strip Control Codes',this._Container);
    QuickElement('br',{},'',this._Container);
    this._CSplit = QuickElement('input',{type: "checkbox"},'',this._Container);
    QuickElement('span',{},'Split long Messages',this._Container);
    QuickElement('br',{},'',this._Container);

    this._CTime = QuickElement('input',{type: "checkbox"},'',this._Container);
    QuickElement('span',{},'Timestamp Events',this._Container);
    QuickElement('br',{},'',this._Container);
    QuickElement('span',{},'Timestamp Format:',this._Container);
    this._CTimeFmt = QuickElement('input',{type: "text"},'',this._Container);

    QuickElement('p',{},'',this._Container);
    QuickElement('span',{},'Sound Options:',this._Container);
    QuickElement('br',{},'',this._Container);

    this._CEnableSounds = QuickElement('input',{type: "checkbox"},'',this._Container);
    QuickElement('span',{},'Enable Sounds',this._Container);
    QuickElement('br',{},'',this._Container);
    this._CBeepChan = QuickElement('input',{type: "checkbox"},'',this._Container);
    QuickElement('span',{},'Beep on Channel Messages',this._Container);
    QuickElement('br',{},'',this._Container);
    this._CBeepQuery = QuickElement('input',{type: "checkbox"},'',this._Container);
    QuickElement('span',{},'Beep on Query Messages',this._Container);

    QuickElement('p',{},'',this._Container);
    QuickElement('span',{},'Pointer Options:',this._Container);
    QuickElement('br',{},'',this._Container);

    QuickElement('span',{},'Status Double Click:',this._Container);
    this._CPStatus = QuickElement('input',{type: "text"},'',this._Container);
    QuickElement('br',{},'',this._Container);
    QuickElement('span',{},'Query Double Click:',this._Container);
    this._CPQuery = QuickElement('input',{type: "text"},'',this._Container);
    QuickElement('br',{},'',this._Container);
    QuickElement('span',{},'Channel Double Click:',this._Container);
    this._CPChan = QuickElement('input',{type: "text"},'',this._Container);
    QuickElement('br',{},'',this._Container);
    QuickElement('span',{},'Nicklist Double Click:',this._Container);
    this._CPNick = QuickElement('input',{type: "text"},'',this._Container);
    
    QuickElement('p',{},'',this._Container);
    QuickElement('span',{},'Display Options:',this._Container);
    QuickElement('br',{},'',this._Container);

    this._CDNetworkTitle = QuickElement('input',{type: "checkbox"},'',this._Container);
    QuickElement('span',{},'Show Network in Title',this._Container);
    QuickElement('br',{},'',this._Container);
    this._CDNickTitle = QuickElement('input',{type: "checkbox"},'',this._Container);
    QuickElement('span',{},'Show Nickname in Title',this._Container);
    QuickElement('br',{},'',this._Container);
    this._CDTree = QuickElement('input',{type: "checkbox"},'',this._Container);
    QuickElement('span',{},'Show Nickname In Tree',this._Container);
    QuickElement('br',{},'',this._Container);
    this._CDEmbed = QuickElement('input',{type: "checkbox"},'',this._Container);
    QuickElement('span',{},'Embed Media Urls (Image/video/audio)',this._Container);
    QuickElement('br',{},'',this._Container);
    QuickElement('span',{},'Window Buffer:',this._Container);
    this._CDBuffer = QuickElement('input',{type: "text"},'',this._Container);

    QuickElement('p',{},'',this._Container);
    QuickElement('span',{},'Desktop Notification Options:',this._Container);
    QuickElement('br',{},'',this._Container);

    this._CEnableNotifications = QuickElement('input',{type: "checkbox"},'',this._Container);
    QuickElement('span',{},'Enable Notifications',this._Container);
    QuickElement('br',{},'',this._Container);
    this._CNChanMessage = QuickElement('input',{type: "checkbox"},'',this._Container);
    QuickElement('span',{},'Channel Message',this._Container);
    QuickElement('br',{},'',this._Container);
    this._CNChanNotice = QuickElement('input',{type: "checkbox"},'',this._Container);
    QuickElement('span',{},'Channel Notice',this._Container);
    QuickElement('br',{},'',this._Container);
    this._CNChanCTCP = QuickElement('input',{type: "checkbox"},'',this._Container);
    QuickElement('span',{},'Channel CTCP',this._Container);
    QuickElement('br',{},'',this._Container);
    this._CNChanJoinPart = QuickElement('input',{type: "checkbox"},'',this._Container);
    QuickElement('span',{},'Channel Join/Part',this._Container);
    QuickElement('br',{},'',this._Container);
    this._CNChanKick = QuickElement('input',{type: "checkbox"},'',this._Container);
    QuickElement('span',{},'Channel Kick',this._Container);
    QuickElement('br',{},'',this._Container);
    this._CNChanMode = QuickElement('input',{type: "checkbox"},'',this._Container);
    QuickElement('span',{},'Channel Mode',this._Container);
    QuickElement('br',{},'',this._Container);
    this._CNChanTopic = QuickElement('input',{type: "checkbox"},'',this._Container);
    QuickElement('span',{},'Channel Topic',this._Container);
    QuickElement('br',{},'',this._Container);
    this._CNChanNickname = QuickElement('input',{type: "checkbox"},'',this._Container);
    QuickElement('span',{},'Channel Nickname',this._Container);
    QuickElement('br',{},'',this._Container);
    this._CNChanQuit = QuickElement('input',{type: "checkbox"},'',this._Container);
    QuickElement('span',{},'Channel Quit',this._Container);
    QuickElement('br',{},'',this._Container);
    this._CNPrivateMessage = QuickElement('input',{type: "checkbox"},'',this._Container);
    QuickElement('span',{},'Private Message',this._Container);
    QuickElement('br',{},'',this._Container);
    this._CNPrivateNotice = QuickElement('input',{type: "checkbox"},'',this._Container);
    QuickElement('span',{},'Private Notice',this._Container);
    QuickElement('br',{},'',this._Container);
    this._CNPrivateCTCP = QuickElement('input',{type: "checkbox"},'',this._Container);
    QuickElement('span',{},'Private CTCP',this._Container);
    QuickElement('br',{},'',this._Container);
    this._CNConnect = QuickElement('input',{type: "checkbox"},'',this._Container);
    QuickElement('span',{},'Connect/Disconnect',this._Container);
    QuickElement('br',{},'',this._Container);
    this._CNInvite = QuickElement('input',{type: "checkbox"},'',this._Container);
    QuickElement('span',{},'Invite',this._Container);
    QuickElement('br',{},'',this._Container);
    QuickElement('span',{},'Notification Timeout:',this._Container);
    this._CNTimeout = QuickElement('input',{type: "text"},'',this._Container);

    QuickElement('p',{},'',this._Container);
    QuickElement('span',{},'Other Options:',this._Container);
    QuickElement('br',{},'',this._Container);

    this._COClose = QuickElement('input',{type: "checkbox"},'',this._Container);
    QuickElement('span',{},'Confirm close Status still Connected',this._Container);
    QuickElement('br',{},'',this._Container);
    this._COPaste = QuickElement('input',{type: "checkbox"},'',this._Container);
    QuickElement('span',{},'Confirm Large Pastes',this._Container);
    QuickElement('br',{},'',this._Container);
    this.setCentralWidget(this._Container);
    this._Init();

    /*-------------------------------------------------------------------------------------------------
    Setup Event Listeners
    -------------------------------------------------------------------------------------------------*/
    this.addEventListener('childEvent',this.handleEvent.bind(this));

    /*this._EBeeps.addEventListener('change',(e) => {  this._Root._Config['options']['irc'].ebeeps = e.target.checked; });
    this._Reconnect.addEventListener('change',(e) => {  this._Root._Config['options']['irc'].reconnect = e.target.checked; });
    this._ConnectRejoin.addEventListener('change',(e) => {  this._Root._Config['options']['irc'].connectrejoin = e.target.checked; });
    this._KickRejoin.addEventListener('change',(e) => {  this._Root._Config['options']['irc'].kickrejoin = e.target.checked; });
    this._KeepOpen.addEventListener('change',(e) => {  this._Root._Config['options']['irc'].keepchanopen = e.target.checked; });
    this._Timestamp.addEventListener('change',(e) => {  this._Root._Config['options']['irc'].timestamp = e.target.checked; });
    this._Prefix.addEventListener('change',(e) => {  this._Root._Config['options']['irc'].showprefix = e.target.checked; });
    this._WEvent.addEventListener('change',(e) => {  this._Root._Config['windows'].event = e.target.value; });
    this._WMsg.addEventListener('change',(e) => {  this._Root._Config['windows'].message = e.target.value; });
    this._WHlt.addEventListener('change',(e) => {  this._Root._Config['windows'].highlight = e.target.value; });
    */
  }

  /*-------------------------------------------------------------------------------------------------
  Default Callbacks and Event Handler
  -------------------------------------------------------------------------------------------------*/
  connectedCallback() { super.connectedCallback(); }
  disconnectedCallback() { super.disconnectedCallback(); }
  handleEvent(e) { 
    super.handleEvent(e);
    if (e.type == 'childEvent') {
      if (e.detail.QEvent == Qt.QEvent.Close) { 
        this._Root._SaveConfig(true);
        this.hide(); 
      }
    }
  }

  /*-------------------------------------------------------------------------------------------------
  Private Functions
  -------------------------------------------------------------------------------------------------*/
  _Init() {
    this._MNick.value = this._Root._Config.options.MNick;
    this._ANick.value = this._Root._Config.options.ANick;
    this._QMsg.value = this._Root._Config.options.QuitMessage;
    this._CStartup.checked = this._Root._Config.options.ConnectOnStartup;
    this._CReconnect.checked = this._Root._Config.options.ReconnectOnDisconnect;
    this._CQStartup.checked = this._Root._Config.options.ShowQuickConnectOnStartup;
    this._CInvisible.checked = this._Root._Config.options.UseInvisibleMode;
    this._CPrefix.checked = this._Root._Config.options.PrefixMessages;
    this._CQuery.checked = this._Root._Config.options.StartQueriesMinimized;
    this._CWQuery.checked = this._Root._Config.options.WhoisOnQueryOpen;
    this._CKeepChans.checked = this._Root._Config.options.KeepChannelsOpen;
    this._CInvite.checked = this._Root._Config.options.AutoJoinOnInvite;
    this._CRejoin.checked = this._Root._Config.options.RejoinWhenKicked;
    this._CRejoinConnect.checked = this._Root._Config.options.RejoinOnConnect;
    this._CEvents.checked = this._Root._Config.options.ShortChannelEvents;
    this._CAddress.checked = this._Root._Config.options.ShowUserAddress;
    this._CTyping.checked = this._Root._Config.options.SendIRCv3Typing;
    this._CStrip.checked = this._Root._Config.options.StripControlCodes;
    this._CSplit.checked = this._Root._Config.options.SplitLongMessages;
    this._CTime.checked = this._Root._Config.options.TimestampEvents;
    this._CTimeFmt.value = this._Root._Config.options.TimestampFormat;
    this._CEnableSounds.checked = this._Root._Config.options.EnableSounds;
    this._CBeepChan.checked = this._Root._Config.options.BeepOnChannelMsg;
    this._CBeepQuery.checked = this._Root._Config.options.BeepOnQueryMsg;
    this._CPStatus.value = this._Root._Config.options.StatusDoubleClick;
    this._CPQuery.value = this._Root._Config.options.QueryDoubleClick;
    this._CPChan.value = this._Root._Config.options.ChannelDoubleClick;
    this._CPNick.value = this._Root._Config.options.NicklistDoubleClick;
    this._CDNetworkTitle.checked = this._Root._Config.options.ShowNetworkInTitle;
    this._CDNickTitle.checked = this._Root._Config.options.ShowNicknameInTitle;
    this._CDTree.checked = this._Root._Config.options.ShowNicknameInTree;
    this._CDEmbed.checked = this._Root._Config.options.EmbedMediaUrls;
    this._CDBuffer.value = this._Root._Config.options.WindowBuffer;
    this._COClose.checked = this._Root._Config.options.ConfirmCloseStatusStillConnected;
    this._COPaste.checked = this._Root._Config.options.ConfirmLargePastes;

    this._CEnableNotifications.checked = this._Root._Config.options.EnableNotifications;
    this._CNChanMessage.checked = this._Root._Config.options.TipChanMessage;
    this._CNChanNotice.checked = this._Root._Config.options.TipChanNotice;
    this._CNChanCTCP.checked = this._Root._Config.options.TipChanCTCP;
    this._CNChanJoinPart.checked = this._Root._Config.options.TipChanJoinPart;
    this._CNChanKick.checked = this._Root._Config.options.TipChanKick;
    this._CNChanMode.checked = this._Root._Config.options.TipChanMode;
    this._CNChanTopic.checked = this._Root._Config.options.TipChanTopic;
    this._CNChanNickname.checked = this._Root._Config.options.TipChanNickname;
    this._CNChanQuit.checked = this._Root._Config.options.TipChanQuit;
    this._CNPrivateMessage.checked = this._Root._Config.options.TipPrivateMessage;
    this._CNPrivateNotice.checked = this._Root._Config.options.TipPrivateNotice;
    this._CNPrivateCTCP.checked = this._Root._Config.options.TipPrivateCTCP;
    this._CNConnect.checked = this._Root._Config.options.TipOtherConnect;
    this._CNInvite.checked = this._Root._Config.options.TipOtherInvite;
    this._CNTimeout.value = this._Root._Config.options.TipDuration;

    /*
    this._EBeeps.checked = this._Root._Config['options']['irc'].ebeeps;
    this._Reconnect.checked = this._Root._Config['options']['irc'].reconnect;
    this._ConnectRejoin.checked = this._Root._Config['options']['irc'].connectrejoin;
    this._KickRejoin.checked = this._Root._Config['options']['irc'].kickrejoin;
    this._KeepOpen.checked = this._Root._Config['options']['irc'].keepchanopen;
    this._Timestamp.checked = this._Root._Config['options']['irc'].timestamp;
    this._Prefix.checked = this._Root._Config['options']['irc'].showprefix;
    this._WEvent.value = this._Root._Config['windows'].event;
    this._WMsg.value = this._Root._Config['windows'].message;
    this._WHlt.value = this._Root._Config['windows'].highlight;
    */
  }
}
customElements.define('web-configgeneral', ConfigGeneral);

/*---------------------------------------------------------------------------------------------------------
  Colors Config
---------------------------------------------------------------------------------------------------------*/

class ConfigColors extends QDialog {
    constructor(mainapp) {
      super();
      this.setWindowFlag(Qt.WindowType.WindowMinMaxButtonsHint,false);
      /*-------------------------------------------------------------------------------------------------
        Private Properties
      -------------------------------------------------------------------------------------------------*/
        this._MetaObject.push("ConfigColors");
      this.classList.add("ConfigColors");
      this._Root = mainapp;
  
      /*-------------------------------------------------------------------------------------------------
      Build UI Components
      -------------------------------------------------------------------------------------------------*/
        this._Container = QuickElement('div',{style: "margin: 3px; overflow: auto;"},'Appearance:');
      this._ViewPort = new QListView().setBaseSize(null,100);
      //this._ViewPort.style.flexDirection = "row";
      this._ViewPort._CentralWidget.style.flexWrap = "wrap";
      this._ViewPort._CentralWidget.style.overflow = "auto";
      this._Container.appendChild(this._ViewPort);
      this._ViewPort.addAction(new QAction('','Action Text'));
      this._ViewPort.addAction(new QAction('','Ctcp Text'));
      this._ViewPort.addAction(new QAction('','Highlight Text'));
      this._ViewPort.addAction(new QAction('','Info Text'));
      this._ViewPort.addAction(new QAction('','Invite Text'));
      this._ViewPort.addAction(new QAction('','Join Text'));
      this._ViewPort.addAction(new QAction('','Kick Text'));
      this._ViewPort.addAction(new QAction('','Mode Text'));
      this._ViewPort.addAction(new QAction('','Nick Text'));
      this._ViewPort.addAction(new QAction('','Normal Text'));
      this._ViewPort.addAction(new QAction('','Notice Text'));
      this._ViewPort.addAction(new QAction('','Own Text'));
      this._ViewPort.addAction(new QAction('','Part Text'));
      this._ViewPort.addAction(new QAction('','Topic Text'));
      this._ViewPort.addAction(new QAction('','Quit Text'));
  
      this._ViewPort.addAction(new QAction('','Treebar Background'));
      this._ViewPort.addAction(new QAction('','Treebar Text'));
      this._ViewPort.addAction(new QAction('','MDI Background'));
      this._ViewPort.addAction(new QAction('','Viewport Background'));
      this._ViewPort.addAction(new QAction('','Listbox Background'));
      this._ViewPort.addAction(new QAction('','Listbox Text'));
      this._ViewPort.addAction(new QAction('','Editbox Background'));
      this._ViewPort.addAction(new QAction('','Editbox Text'));
  
      this._ViewPort.addAction(new QAction('','Tree/Switch Event'));
      this._ViewPort.addAction(new QAction('','Tree/Switch Highlight'));
      this._ViewPort.addAction(new QAction('','Tree/Switch Message'));
  
      this.setCentralWidget(this._Container);
      this._Table = QuickElement('table',{});
      for (var x = 0; x <= 1; x++) {
        var tr = QuickElement('tr',{});
        for (var y = 0; y <= 7; y++) {
          var td = QuickElement('td',{style: "background: " + this._Root._Config['palette'][x * 7 + y + x]},(x * 7 + y + x).toString().padStart(2,'0'))
          td.dataset.index = x * 7 + y + x;
          td.addEventListener('click',(e) => { this._SetColor(e); });
          tr.appendChild(td);
        }
        this._Table.appendChild(tr);
      }
      this._TableEx = QuickElement('table',{});
      for (var x = 0; x <= 6; x++) {
        var tr = QuickElement('tr',{});
        for (var y = 0; y <= 11; y++) {
          var td = QuickElement('td',{style: "color: #ffffff; background: " + this._Root._Config['palette'][x * 11 + y + x + 16]},(x * 11 + y + x + 16).toString().padStart(2,'0'))
          td.dataset.index = x * 11 + y + x + 16;
          td.addEventListener('click',(e) => { this._SetColor(e); });
          tr.appendChild(td);
        }
        this._TableEx.appendChild(tr);
      }
      this._ColorTable = QuickElement('table',{});
      var tr = QuickElement('tr',{},'',this._ColorTable);
      var td1 = QuickElement('td',{valign: 'top'},'',tr);
      var td2 = QuickElement('td',{},'',tr);
      var td3 = QuickElement('td',{valign: 'bottom'},'',tr);
      td1.appendChild(this._Table);
      td1.appendChild(document.createTextNode('Select an item from the list then select a color to change. Theme temporarily modifies, you must hit apply to save changes.'))
      td2.appendChild(this._TableEx);
      this._Apply = QuickElement('button',{},'Apply',td3);
      this._Apply.addEventListener('click',(e) => { this._Root._SaveConfig(true); });
  
      this._CloseBttn = QuickElement('button',{},'Close',td3);
      this._CloseBttn.addEventListener('pointerup',(e) => { this._customEvent('childEvent',{ bubbles: true, detail: { target: this, jsEvent: e, 'QEvent': Qt.QEvent.Close } }); });
      this._Container.appendChild(this._ColorTable);
  
      this._InitList();
  
      /*-------------------------------------------------------------------------------------------------
      Setup Event Listeners
      -------------------------------------------------------------------------------------------------*/
      this.addEventListener('childEvent',this.handleEvent.bind(this));
    }
  
    /*-------------------------------------------------------------------------------------------------
    Default Callbacks and Event Handler
    -------------------------------------------------------------------------------------------------*/
    connectedCallback() { super.connectedCallback(); }
    disconnectedCallback() { super.disconnectedCallback(); }
    handleEvent(e) { 
      super.handleEvent(e);
      if (e.type == 'childEvent') {
        if (e.detail.QEvent == Qt.QEvent.Close) { 
          this._Root._SaveConfig(false);
          this.hide(); 
        }
      }
    }
  
    /*-------------------------------------------------------------------------------------------------
    Private Functions
    -------------------------------------------------------------------------------------------------*/
    _InitList() {
      var CIndex = Object.keys(this._Root._Config['colors']);
      this._ViewPort.Children().forEach((child,index) => {
        if (/ Background$/i.test(child._IconText.innerText)) { 
          child.style.background = this._Root._Color(CIndex[index]); 
          child._IconText.style.color = "white";
          child._IconText.style.mixBlendMode = "difference";
        }
        else { child._IconText.style.color = this._Root._Color(CIndex[index]); }
      });
    }
    _SetColor(e) {
      var CIndex = Object.keys(this._Root._Config['colors']);
      this._ViewPort.querySelectorAll('.selected').forEach((child) => { 
        this._Root._Config['colors'][CIndex[this._ViewPort.Children().indexOf(child)]] = e.target.dataset.index;
        if (/ Background$/i.test(child._IconText.innerText)) { child.style.background = e.target.style.background; }
        else { child._IconText.style.color = e.target.style.background; }
      });
      this._Root._SaveConfig(true,true);
    }
  }
  customElements.define('web-configcolors', ConfigColors);
  
/*---------------------------------------------------------------------------------------------------------
  Quick Connect
---------------------------------------------------------------------------------------------------------*/

class QuickConnect extends QDialog {
    constructor(mainapp) {
      super();
      this.setWindowFlag(Qt.WindowType.WindowMinMaxButtonsHint,false);
      /*-------------------------------------------------------------------------------------------------
        Private Properties
      -------------------------------------------------------------------------------------------------*/
      this._MetaObject.push("QuickConnect");
      this.classList.add("QuickConnect");
      this._Root = mainapp;
  
      /*-------------------------------------------------------------------------------------------------
      Build UI Components
      -------------------------------------------------------------------------------------------------*/
      this._Container = QuickElement('div',{style: "margin: 3px; overflow: auto;"},'User Information:');
      
      this._Nicks = QuickElement('div',{style: "margin: 6px; display: flex; flex-direction: column; "},'',this._Container);
      this._MNickSpan = QuickElement('span',{style: "display: flex;"},'Main Nick:',this._Nicks);
      this._MNick = QuickElement('input',{type: 'text',style: "flex: 1;"},'',this._MNickSpan);
      this._ANickSpan = QuickElement('span',{style: "display: flex;"},'Alt. Nick:',this._Nicks);
      this._ANick = QuickElement('input',{type: 'text',style: "flex: 1;"},'',this._ANickSpan);

      this._Networks = QuickElement('div',{style: "display: flex; flex-direction: row; "},'');
      this._NetworkBtns = QuickElement('div',{style: "display: flex; flex-direction: column;"},'');
      this._AddBttn = QuickElement('button',{},'Add',this._NetworkBtns);
      this._RemoveBttn = QuickElement('button',{},'Remove',this._NetworkBtns);
      this._EditBttn = QuickElement('button',{},'Edit...',this._NetworkBtns);


      this._ViewPort = new QListView().setBaseSize(null,100);
      this._ViewPortItems = [];
      //this._ViewPort.style.flexDirection = "column";
      //this._ViewPort._CentralWidget.style.flexWrap = "wrap";

      this._Networks.appendChild(this._ViewPort);
      this._Networks.appendChild(this._NetworkBtns);

      this._Container.appendChild(this._Networks);
      this._CloseBttn = QuickElement('button',{style: "float: right"},'Close',this._Container);
      this._CloseBttn.addEventListener('click',(e) => { this.close(); });

      this._ConnectBttn = QuickElement('button',{style: "float: right"},'Connect',this._Container);
      this._ShowStartup = QuickElement('input',{type: "checkbox"},'',this._Container);
      this._ShowLabel = QuickElement('span',{},'Show on Startup',this._Container);
      this._ConnectBttn.addEventListener('click',(e) => { 
        if (this._ViewPort.currentItem()) { this._Root._processInputLine(this._Root.MDI.activeSubWindow(),"/server" + (this._MNick.value != "" ? " -i " + this._MNick.value : "") + " " + this._Root._Config.servers[this._ViewPort.currentItem().innerText]); }
        //console.log();
        this.close(); 
      });
      
      this._InitList();
      this.setCentralWidget(this._Container);
  
      /*-------------------------------------------------------------------------------------------------
      Setup Event Listeners
      -------------------------------------------------------------------------------------------------*/
      this.addEventListener('childEvent',this.handleEvent.bind(this));
    }
  
    /*-------------------------------------------------------------------------------------------------
    Default Callbacks and Event Handler
    -------------------------------------------------------------------------------------------------*/
    connectedCallback() { super.connectedCallback(); }
    disconnectedCallback() { super.disconnectedCallback(); }
    handleEvent(e) { 
      super.handleEvent(e);
      if (e.type == 'childEvent') {
        if (e.detail.QEvent == Qt.QEvent.Close) { 
          this.hide(); 
        }
      }
    }
  
    /*-------------------------------------------------------------------------------------------------
    Private Functions
    -------------------------------------------------------------------------------------------------*/
    _Init() { 
      this._ShowStartup.checked = this._Root._Config.options.ShowQuickConnectOnStartup;
      let serverkeys = Object.keys(this._Root._Config['servers']);
      if (serverkeys.length != this._ViewPortItems.length) {

      }
      else {

      }

    }
    _InitList() {
      Object.keys(this._Root._Config['servers']).forEach((network) => { 
        this._ViewPortItems.push(new QAction('',network));
        this._ViewPort.addAction(this._ViewPortItems[this._ViewPortItems.length -1]);
      });
      if (this._ViewPortItems.length > 0) { this._ViewPort.setSelected(this._ViewPortItems[0]); }
    }
}
customElements.define('web-quickconnect', QuickConnect);

/*---------------------------------------------------------------------------------------------------------
  Select Font
---------------------------------------------------------------------------------------------------------*/

class FontSelect extends QDialog {
  constructor(mainapp,fonts) {
    super();
    this.setWindowFlag(Qt.WindowType.WindowMinMaxButtonsHint,false);
    /*-------------------------------------------------------------------------------------------------
      Private Properties
    -------------------------------------------------------------------------------------------------*/
    this._MetaObject.push("FontSelect");
    this.classList.add("FontSelect");
    this._Root = mainapp;
    this._Fonts = fonts;

    /*-------------------------------------------------------------------------------------------------
    Build UI Components
    -------------------------------------------------------------------------------------------------*/
    this._Container = QuickElement('div',{style: "margin: 3px; overflow: auto;"},'');
    this._Preview = QuickElement('div',{},'The quick brown fox jumps over the lazy dog.');
    this._SliderSettings = QuickElement('div',{},'');
    
    this._ViewPort = new QListView().setBaseSize(null,100);
    this._ViewPort.addEventListener('selectionChanged',(e) => { 
      this._Preview.style.fontFamily = this._ViewPort.currentItem().innerText;
    });
    this._ViewPortItems = [];
    //this._ViewPort.style.flexDirection = "column";
    //this._ViewPort._CentralWidget.style.flexWrap = "wrap";

    this._Container.appendChild(this._ViewPort);
    this._Container.appendChild(this._Preview);
    this._Container.appendChild(this._SliderSettings);

    this._Bold = QuickElement('input',{type: "checkbox"},'',this._Container);
    this._BoldLabel = QuickElement('span',{},'bold',this._Container);
    this._Bold.addEventListener('click',(e) => { 
      this._Preview.style.fontWeight = (this._Bold.checked ? "bold" : "");
    });
    this._Italic = QuickElement('input',{type: "checkbox"},'',this._Container);
    this._ItalicLabel = QuickElement('span',{},'italic',this._Container);
    this._Italic.addEventListener('click',(e) => { 
      this._Preview.style.fontStyle = (this._Italic.checked ? "italic" : "");
    });

    this._CloseBttn = QuickElement('button',{style: "float: right"},'Close',this._Container);
    this._CloseBttn.addEventListener('click',(e) => { this.close(); });

    this._SelectBttn = QuickElement('button',{style: "float: right"},'Select',this._Container);
    this._SelectBttn.addEventListener('click',(e) => { 
      let window = this._Root.MDI.activeSubWindow().ViewPort;
      window.style.fontFamily = this._Preview.style.fontFamily;
      window.style.fontWeight = this._Preview.style.fontWeight;
      window.style.fontStyle = this._Preview.style.fontStyle;
      window.style.fontSize = this._Preview.style.fontSize;
      //this._Root._processInputLine(this._Root.MDI.activeSubWindow(),"/server -i " + this._MNick.value + " " + this._Root._Config.servers[this._ViewPort.currentItem().innerText]);
      //console.log();
      this.close(); 
    });
    this._FontSizer = QuickElement('input',{type: 'range', min: 8, max: 36, value: 10},'',this._SliderSettings);
    this._FontNumber = QuickElement('input',{type: 'number', min: 8, max: 36, value: 10},'',this._SliderSettings);
    this._FontSizer.addEventListener('input',(e) => { 
      this._FontNumber.value = this._FontSizer.value;
      this._Preview.style.fontSize = this._FontSizer.value + "pt"; 
    });
    this._InitList();
    this.setCentralWidget(this._Container);

    /*-------------------------------------------------------------------------------------------------
    Setup Event Listeners
    -------------------------------------------------------------------------------------------------*/
    this.addEventListener('childEvent',this.handleEvent.bind(this));
  }

  /*-------------------------------------------------------------------------------------------------
  Default Callbacks and Event Handler
  -------------------------------------------------------------------------------------------------*/
  connectedCallback() { super.connectedCallback(); }
  disconnectedCallback() { super.disconnectedCallback(); }
  handleEvent(e) { 
    super.handleEvent(e);
    if (e.type == 'childEvent') {
      if (e.detail.QEvent == Qt.QEvent.Close) { 
        this.hide(); 
      }
    }
  }

  /*-------------------------------------------------------------------------------------------------
  Private Functions
  -------------------------------------------------------------------------------------------------*/
  _Init() { 
  }
  _InitList() {
    for (let [i,font] of this._Fonts.entries()) { 
      let tmpAction = new QAction('',font)
      tmpAction._IconText.style.fontFamily = font;

      this._ViewPortItems.push(tmpAction);
      this._ViewPort.addAction(tmpAction);
    }
  }
}
customElements.define('web-fontselect', FontSelect);

/*---------------------------------------------------------------------------------------------------------
  Select Font
---------------------------------------------------------------------------------------------------------*/

class TabTest extends QDialog {
  constructor(mainapp) {
    super();
    this.setWindowFlag(Qt.WindowType.WindowMinMaxButtonsHint,false);
    /*-------------------------------------------------------------------------------------------------
      Private Properties
    -------------------------------------------------------------------------------------------------*/
    this._MetaObject.push("FontSelect");
    this.classList.add("FontSelect");
    this._Root = mainapp;

    /*-------------------------------------------------------------------------------------------------
    Build UI Components
    -------------------------------------------------------------------------------------------------*/
    this._Container = QuickElement('div',{style: "margin: 3px; overflow: auto;"},'');
    this._TabWidget = new QTabWidget(this._Container);
    //this._Container.appendChild(this._TabWidget);
    this._TabWidget.addTab(QuickElement('div',{},"p1"),new QAction('images/connect.png',''),'Page 1');
    this._TabWidget.addTab(QuickElement('div',{},"p2"),new QAction('',''),'Page 2');
    this.setCentralWidget(this._Container);

    /*-------------------------------------------------------------------------------------------------
    Setup Event Listeners
    -------------------------------------------------------------------------------------------------*/
    this.addEventListener('childEvent',this.handleEvent.bind(this));
  }

  /*-------------------------------------------------------------------------------------------------
  Default Callbacks and Event Handler
  -------------------------------------------------------------------------------------------------*/
  connectedCallback() { super.connectedCallback(); }
  disconnectedCallback() { super.disconnectedCallback(); }
  handleEvent(e) { 
    super.handleEvent(e);
    if (e.type == 'childEvent') {
      if (e.detail.QEvent == Qt.QEvent.Close) { 
        this.hide(); 
      }
    }
  }

  /*-------------------------------------------------------------------------------------------------
  Private Functions
  -------------------------------------------------------------------------------------------------*/
}
customElements.define('web-tabtest', TabTest);