class CustomWindow extends QMdiSubWindow {
    constructor(parent,Attributes) {
      super(parent);
      this._Root = Attributes.root;
      this._Type = Attributes.type;
      this._Cid = Attributes.cid;
      this._Target = Attributes.target;
      this._Highlight = 0;
      this._TypeObject = {};
      this._TypeTimer = '';
  
      /*-------------------------------------------------------------------------------------------------
      Build UI Components
      -------------------------------------------------------------------------------------------------*/
      this.style.resize = "both";
      this.style.zIndex = 0;
  
      var IconURL = 'favicon.ico', treeparent = (Attributes.owner ? Attributes.owner.TreeItem : Attributes.root.Treebar);
      if (/^(status|channel|query|chanlist)$/i.test(Attributes.type)) { IconURL = "images/" + Attributes.type + ".ico"; }
  
      this.setWindowIcon(IconURL);
      this.setWindowTitle((Attributes.title || Attributes.target));
  
      this.TreeItem = new QTreeWidgetItem(IconURL,Attributes.target,treeparent).connect('itemClicked',this,() => { if (Array.isArray(this.parent()._MetaObject) && this.parent()._MetaObject.includes('QMdiArea')) { this.parent().setActiveSubWindow(this); } });
      this.TreeItem._SwitchItem = new QAction(IconURL,Attributes.target).setCheckable(true).connect('toggled',this,() => { if (Array.isArray(this.parent()._MetaObject) && this.parent()._MetaObject.includes('QMdiArea')) { this.parent().setActiveSubWindow(this); } });
      this.TreeItem._SwitchItem.setAttribute("style","flex-shrink:1;overflow:hidden");
      Attributes.root.SwitchBar.addAction(this.TreeItem._SwitchItem);
      this.Container = QuickElement('div',{style: 'display: flex; flex-direction: column; flex: auto; overflow: hidden;'},'',this._CentralWidget);
      if (Attributes.type == 'chanlist') {
        this.TreeList = new QTreeWidget(this.Container).setColumnCount(3);
        this.TreeList.addEventListener('dblclick',(e) => { if (/^div$/i.test(e.target.tagName)) { this._Root._processInputLine(this._Root._Sessions[this._Cid].Windows['status window'],'/join ' + e.target.parentNode.childNodes[0].innerText); } });
      }
      else if (Attributes.type == 'channel') {
        this.ListDock = new QDockWidget('Nicklist').setBaseSize(100,null).setResizable(false).setAllowedAreas(Qt.DockWidgetArea.LeftDockWidgetArea | Qt.DockWidgetArea.RightDockWidgetArea).setWindowFlag(Qt.WindowType.WindowUndockButtonHint,false).setWindowFlag(Qt.WindowType.WindowCloseButtonHint,false).setFeature(Qt.DockWidgetFeature.DockWidgetFloatable,false);
        this.List = new QListView(this.ListDock).setBaseSize(100,null);
        this.List.style.background = this._Color('listbox');
        this.List.style.color = this._Color('listboxtext');
        this.List.addEventListener('dblclick',(e) => { if (/^span$/i.test(e.target.tagName)) { this._Root._NewSubWindow(this._Cid,'query',e.target.parentNode.dataset.nick); } });
        this.addDockWidget(Qt.DockWidgetArea.RightDockWidgetArea,this.ListDock);
  
        this.Toolbar = new QToolBar();
        this.Info = new QAction('images/info.ico').setToolTip('Chan Info').setCheckable(true).connect('toggled',this,this._ToggleChanCentral);
        this.Idle = new QAction('images/hourglass.ico').setToolTip('Channel Idle').setCheckable(true).connect('toggled',this,this._ToggleIdle);
        this.UserStats = new QAction('images/piechart.ico').setToolTip('User Statistics').setCheckable(true).connect('toggled',this,this._ToggleStats);
        this.ToggleNick = new QAction('images/users.ico').setToolTip('Toggle Nicklist').setCheckable(true).setChecked(true).connect('toggled',this,this._ToggleNicklist);
        this.SetFont = new QAction('images/font.png').setToolTip('Set Font').connect('triggered',this._Root,this._Root._ToggleSelectFont);

        this.Toolbar.addAction(this.Info);
        this.Toolbar.addAction(new QAction().setSeparator());
        this.Toolbar.addAction(this.Idle);
        this.Toolbar.addAction(this.UserStats);
        this.Toolbar.addAction(new QAction().setSeparator());
        this.Toolbar.addAction(this.ToggleNick);
        this.Toolbar.addAction(new QAction().setSeparator());
        this.Toolbar.addAction(this.SetFont);
        this.addToolBar(Qt.ToolBarArea.TopToolBarArea,this.Toolbar);
  
        this.ChanCentral = QuickElement('div',{'class': 'chancentral', style: "display: none; flex-direction: column; background: inherit; flex: auto; overflow-y: scroll;"},'',this.Container);
        QuickElement('span',{},'Topic:<br>',this.ChanCentral);
        this.ChanCentralTopic = QuickElement('input',{style: 'flex: 0 1'},'',this.ChanCentral);
        QuickElement('span',{},'Bans List:<br>',this.ChanCentral);
        this.CentralTree = new QTreeWidget(this.ChanCentral);
        this.CentralTree.setColumnCount(3);
        this.CentralTree.setHeaderLabels(['mask','set by','time']);
        this.ButtonSpan = QuickElement('span',{},'',this.ChanCentral);
        QuickElement('button',{},'Bans',this.ButtonSpan);
        QuickElement('button',{},'Excepts',this.ButtonSpan);
        QuickElement('button',{},'Invites',this.ButtonSpan);
        QuickElement('button',{},'Quiets',this.ButtonSpan);
        QuickElement('button',{},'Edit',this.ButtonSpan);
        QuickElement('button',{},'Remove',this.ButtonSpan);
  
        //this.NickModeBar = new QToolBar();
        //Client.NickMode.split("").forEach((mode) => { 
        //  this.NickModeBar.addAction(new QAction('',"~" + mode).setToolTip('Toggle mode ' + mode).connect('triggered',this,() => { this._QuickMode(mode) }));
        //});
        //this.addToolBar(Qt.RightToolBarArea,this.NickModeBar);
        this.IdleContainer = QuickElement('span',{style: 'padding: 0 4px; display: none;'},'Idle: 0',this.statusBar());
        this.StatsContainer = QuickElement('span',{style: 'padding: 0 4px; display: none;'},'Count: 0',this.statusBar());
      }
      else if (Attributes.type == 'query') {
        this.Toolbar = new QToolBar();
        this.Info = new QAction('images/info.ico').setToolTip('Whois Nick').connect('triggered',this,() => { this._Root._processInputLine(this,'/whois ' + this._Target); });
        this.SetFont = new QAction('images/font.png').setToolTip('Set Font').connect('triggered',this._Root,this._Root._ToggleSelectFont);
        this.Toolbar.addAction(this.Info);
        this.Toolbar.addAction(new QAction().setSeparator());
        this.Toolbar.addAction(this.SetFont);
        this.addToolBar(Qt.ToolBarArea.TopToolBarArea,this.Toolbar);
      }
      else if (Attributes.type == 'status') {
        this.Toolbar = new QToolBar();
        this.QuickConnect = new QAction('images/connect.png').setToolTip('Quick Connect').connect('triggered',this,() => { this._Root._ToggleQuickConnect(); });  
        this.NewSession = new QAction('images/addserver.ico').setToolTip('New Server Window').connect('triggered',this,() => { this._Root._NewSession(); });
        this.ToggleOnline = new QAction('images/stopwatch.ico').setToolTip('Online Timer').setCheckable(true).connect('toggled',this,this._ToggleOnline);
        this.SetFont = new QAction('images/font.png').setToolTip('Set Font').connect('triggered',this._Root,this._Root._ToggleSelectFont);
        this.QuickJoin = new QAction('images/hash.png').setToolTip('Quick /join').connect('triggered',this._Root,this._Root._ToggleQuickJoin);
        this.Toolbar.addAction(this.QuickConnect);
        this.Toolbar.addAction(new QAction().setSeparator());
        this.Toolbar.addAction(this.NewSession);
        this.Toolbar.addAction(new QAction().setSeparator());
        this.Toolbar.addAction(this.ToggleOnline);
        this.Toolbar.addAction(new QAction().setSeparator());
        this.Toolbar.addAction(this.SetFont);
        this.Toolbar.addAction(new QAction().setSeparator());
        this.Toolbar.addAction(this.QuickJoin);
        this.addToolBar(Qt.ToolBarArea.TopToolBarArea,this.Toolbar);
        this.OnlineContainer = QuickElement('span',{style: 'padding: 0 4px; display: none'},'Online: -',this.statusBar());
      }
      else if (Attributes.type == 'picture') {
        this.Picture = QuickElement('canvas',{id: this._Target.substr(1) },'',this.Container);
        this.Picture.addEventListener('pointerdown',(e) => { this._customEvent('input', { bubbles: true, detail: { target: this, jsEvent: e } }); });
        this.Picture.addEventListener('pointermove',(e) => { this._customEvent('input', { bubbles: true, detail: { target: this, jsEvent: e } }); });
        this.Picture.addEventListener('pointerup',(e) => { this._customEvent('input', { bubbles: true, detail: { target: this, jsEvent: e } }); });
        this.Picture.addEventListener('pointercancel',(e) => { this._customEvent('input', { bubbles: true, detail: { target: this, jsEvent: e } }); });
        //this.Canvas.addEventListener('keyboard',this._MainApp._picwinRelay.bind(this));
  
  
      }
      if (/^(status|channel|query)$/i.test(Attributes.type)) { 
        this.ViewPort = QuickElement('div',{'class': 'viewport', style: "display: flex; flex-direction: column; background: inherit; flex: auto; text-indent: -1em; padding: 0 0 0 1.2em; word-wrap: break-word; white-space: pre-wrap; overflow-y: scroll;"},'',this.Container);
        this.ViewPort.style.background = this._Color('viewport');
        this.ViewPort.addEventListener('pointerup',(e) => { 
          var selectedText = window.getSelection().toString().replace(/\u200B/g, "");
          if (selectedText != '') { navigator.clipboard.writeText(selectedText); }
        });
        this.ViewPort.addEventListener('dblclick',(e) => { 
          console.log("dclick!");
          if (Attributes.type == "status") { this._Root._processInputLine(this,this._Root._Config.options.StatusDoubleClick); } 
          else if (Attributes.type == "query") { this._Root._processInputLine(this,this._Root._Config.options.QueryDoubleClick + " " + this._Target); } 
          else if (Attributes.type == "channel") { this._Root._processInputLine(this,this._Root._Config.options.ChannelDoubleClick + " " + this._Target); }
        });

        this.ViewPort.addEventListener('scroll',(e) => { 
          this.ViewPort._LastTop = this.ViewPort.scrollTop; 
          this.ViewPort._isEnd = ((this.ViewPort.scrollTop + this.ViewPort.clientHeight) == this.ViewPort.scrollHeight ? true : false);
        });
        //this._ViewPortObserver = new MutationObserver(this._Observation.bind(this));
        //this._ViewPortObserver.observe(this.ViewPort,{childList: true});
  
        this.EditBox = QuickElement('input',{type: "text", style: "background: inherit; color: inherit; border: 1px solid transparent"},'',this.Container);
        this.EditBox._OwnerWindow = this;
        this.EditBox.style.background = this._Color('editbox');
        this.EditBox.style.color = this._Color('editboxtext');
        this.EditBox.addEventListener('keydown',(e) => { this._Root._handleInput(this,e); });
        this.EditBox.addEventListener('paste',(e) => { 
          var lines = event.clipboardData.getData('Text').split("\n");
          if (lines.length > 1) {
            e.stopPropagation();
            e.preventDefault();
            lines.forEach((line) => { this._Root._processInputLine(this,line); });
          }
        });
        this._EditBoxHistory = [];
  
        if (!window.mobileCheck()) { this.EditBox.focus(); }
      }
  
      this._Root.Treebar.setCurrentItem(this.TreeItem);
      this._Root.SwitchBar.Children().forEach((child) => { child.setChecked((child == this.TreeItem._SwitchItem ? true : false)); });
      this.addEventListener('pointerup',(e) => { if (this.hasOwnProperty('EditBox') && !window.mobileCheck() && document.activeElement.tagName != "INPUT") { this.EditBox.focus(); } });
      if (this._Type == "query") { this._updateTitle(); }
    }
  
    handleEvent(e) { 
      if (e.type == 'aboutToActivate') {
        this._Root.Treebar.setCurrentItem(this.TreeItem);
        this._Root.SwitchBar.Children().forEach((child) => { child.setChecked((child == this.TreeItem._SwitchItem ? true : false)); });
        this._Root._updateStatus();
        this._Highlight = 0;
        this.TreeItem._TreeLabel.style.color = this._Root._Config['palette'][([99,this._Root._Config['colors'].barevent,this._Root._Config['colors'].barmessage,this._Root._Config['colors'].barhighlight][this._Highlight])];
        this.TreeItem._SwitchItem.style.color = this.TreeItem._TreeLabel.style.color; 
        if (this.hasOwnProperty('ViewPort')) { this.ViewPort.scrollTop = this.ViewPort._LastTop; }
        if (this.hasOwnProperty('EditBox') && !window.mobileCheck()) { this.EditBox.focus(); }
      }
      else if (e.type == 'childEvent') {
        if (e.detail.QEvent == Qt.QEvent.Resize) {
          if (this.hasOwnProperty('Picture')) {
            var blob = this.Picture.toDataURL('image/png');
            this.Picture.setAttribute('width',this.Container.offsetWidth);
            this.Picture.setAttribute('height',this.Container.offsetHeight);
            this._loadBlob(blob,true);
          }
        }
        else if (e.detail.QEvent == Qt.QEvent.Close) {
          if (this._Type == 'status') { this._Root._CloseSession(this._Cid); }
          else { 
            if (this._Type == 'channel') {
              var Client = this._Root._Sessions[this._Cid].Client , IAL = Client.GetIAL(Client.Me);
              if (IAL && IAL.channels.hasOwnProperty(this._Target.toLowerCase())) { Client.WSSend("PART " + this._Target); }
            }
            this._Root._CloseSubWindow(this._Cid,this); 
          }
        }
      }
      super.handleEvent(e);
    }
  
    _Color(type,bool) { return this._Root._Color(type,bool); }
    _embedFragment(Async) {
      if (this.hasOwnProperty('ViewPort')) {
        if (this.hasOwnProperty('_DocumentFragment')) {
          var shouldscroll = ((this.ViewPort.scrollTop + this.ViewPort.clientHeight) == this.ViewPort.scrollHeight ? true : false);
          this.ViewPort.appendChild(this._DocumentFragment);
          delete this._DocumentFragment;
          if (shouldscroll) { this._scrollBottom(); }
  
        Async.forEach((id) => {
          AsyncEmbed(id).then((info) => {
            var shouldscroll = ((this.ViewPort.scrollTop + this.ViewPort.clientHeight) == this.ViewPort.scrollHeight ? true : false);
            var elem = document.getElementById(id);
            if (info.type == "image") {
              info.data.style.maxWidth = info.data.style.maxHeight = "300px";
              info.data.style.aspectRatio = info.data.naturalWidth + " / " + info.data.naturalHeight;
              elem.parentNode.insertBefore(info.data,elem);
              elem.parentNode.removeChild(elem);
            }
            else if (info.type == "audio" || info.type == "video") {
              elem.parentNode.insertBefore(info.data,elem);
              elem.parentNode.removeChild(elem);
            }
            else {
              elem.innerText = info.src;
              elem.removeAttribute('id');
            }
            if (shouldscroll) { this._scrollBottom(); }
          });
        });
        }
      }
    }
    _echo(highlight,color,string) {
      if (this.hasOwnProperty('ViewPort')) {
        if (this.ViewPort.childNodes.length == this._Root._Config['options'].WindowBuffer) { this.ViewPort.removeChild(this.ViewPort.firstElementChild); }
        if (!this.hasOwnProperty('_DocumentFragment')) { this._DocumentFragment = document.createDocumentFragment(); }
        var Async = [] , str = this._Root.CC2Html(string + "\n") , embedmedia = this._Root._Config.options.EmbedMediaUrls;
        if (this._Type != "status") { 
          str = str.replace(/((?:https?|ftps?):\/\/(?:[\w_-]+(?:(?:\.[\w_-]+)+))(?:[\w.,@?^=%&:/~+#-;]*[\w@?^=%&/~+#-])?)/ig,function(match,url) {   
            if (embedmedia && /^https?:\/\/(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/g.test(url)) { return '<iframe width="320" height="280" src="//www.youtube.com/embed/' + RegExp.$1 + '" frameborder="0" allowfullscreen></iframe>'; }
            else {
              var rng = "AsyncEmbed-" + (Math.random() + 1).toString(36).substring(2);
              if (embedmedia) { Async.push(rng); }
              return '<a href="' + url + '" target="_blank"><span id="' + rng + '">' + url + '</span></a>';
            }
          });
        }
        //Avoid making embeds in status windows, instead just provide clickable links
        else { str = str.replace(/((?:https?|ftps?):\/\/(?:[\w_-]+(?:(?:\.[\w_-]+)+))(?:[\w.,@?^=%&:/~+#-;]*[\w@?^=%&/~+#-])?)/ig,function(match,url) { return '<a href="' + url + '" target="_blank">' + url + '</a>'; }); }
        this._DocumentFragment.appendChild(QuickElement('span',{style:'color:' + color},str));
        window.requestAnimationFrame(() => { this._embedFragment(Async); });
      }
      if (this._Type == "query") { this._updateTitle(); }
      if (!this.TreeItem.isSelected() && highlight > this._Highlight) { this._Highlight = highlight; }
      this.TreeItem._TreeLabel.style.color = this._Root._Config['palette'][([99,this._Root._Config['colors'].barevent,this._Root._Config['colors'].barmessage,this._Root._Config['colors'].barhighlight][this._Highlight])];
      this.TreeItem._SwitchItem.style.color = this.TreeItem._TreeLabel.style.color;
    }
    _scrollBottom() { 
      //We need to give the browser time to render, so a slight timeout before scrolling to the bottom is necessary...
      if (this.hasOwnProperty('ViewPort')) { setTimeout(() => { this.ViewPort.scrollTop = this.ViewPort.scrollHeight; }); }
    }
    _updateTypers(bool) {
      var typers = [] , remove = [] , now = Date.now();
      Object.keys(this._TypeObject).forEach((key) => { 
        if (now - this._TypeObject[key] < 6000) { typers.push(key); }
        else { remove.push(key); }
      });
      remove.forEach((key) => { delete this._TypeObject[key]; });
  
      if (typers.length > 0 && typers.length <= 3) { this.EditBox.setAttribute('placeholder',typers.join(", ").replace(/\x2c([^\x2c]*)$/," and$1") + (typers.length  == 1 ? " is " : " are ") + "typing..."); }
      else if (typers.length > 3) { this.EditBox.setAttribute('placeholder',"Multiple people are typing..."); }
      else { this.EditBox.setAttribute('placeholder',""); }
      if (!bool) { this._TypeTimer = setTimeout(() => { this._updateTypers(true); },6000); }
    }
    _updateTitle() {
      var Client = this._Root._Sessions[this._Cid].Client;
      if (this._Type == "status") { 
        this.TreeItem.setText((Client.Network != "" ? Client.Network : (Client.Server != "" ? Client.Server : "Status")) + (Client.Me != "" && this._Root._Config.options.ShowNicknameInTree ? " " + Client.Me : ""));
        this.TreeItem._SwitchItem.setText((Client.Network != "" ? Client.Network : (Client.Server != "" ? Client.Server : "Status")));
        if (Client.Socket && Client.Socket.readyState == 1) { this.setWindowTitle("Status: " + Client.Me + " [+" + Client.UMode + "] on " + Client.Network + " (" + Client.Server + ")"); }
        else { this.setWindowTitle("Status: Not Connected"); }
      }
      else if (this._Type == "channel") {
        var Chan = Client.GetICL(this._Target);
        if (Chan) { 
          this.setWindowTitle(this._Target + (this._Root._Config.options.ShowNetworkInTitle == true ? " (" + Client.Network + ")" : "") + " [" + Chan.Nicks.length + "] [+" + Chan.mode + "]: " + this._Root.CC2Html(Chan.topic)); 
          this.ChanCentralTopic.value = Chan.topic;
        }
        else { this.setWindowTitle(this._Target) }
      }
      else if (this._Type == "query") {
        var IAL = Client.GetIAL(this._Target);
        this.setWindowTitle(this._Target + (this._Root._Config.options.ShowNetworkInTitle == true ? " (" + Client.Network + ")" : "") + (IAL ? " (" + IAL.address + ")" : ""));
      }
    }
    _addBan(mask,setby,time) {
      let tmp = new QTreeWidgetItem('',mask,this.CentralTree);
      tmp.setColumnText(1,setby);
      tmp.setColumnText(2,AscTime(new Date(parseInt(time) * 1000),'ddd mmm dd HH:nn:ss yyyy'));
    }
    _ToggleChanCentral(e) {
      if (e.detail.checked) { 
        this.ChanCentral.style.display = 'flex'; 
        this.ViewPort.style.display = 'none'; 
      }
      else { this.ChanCentral.style.display = 'none'; this.ViewPort.style.display = 'flex'; }
    }
    _ToggleIdle(e) {
      var ch = this.ViewPort.clientHeight;
      if (e.detail.checked) { this.IdleContainer.style.display = null; this.Timer = setInterval(() => { this._updateIdle() },500); this._updateIdle(); }
      else { this.IdleContainer.style.display = 'none'; this.Timer = clearInterval(this.Timer); }
      ch -= this.ViewPort.clientHeight
      if (ch > 0) { this.ViewPort.scrollTop += ch; }
    }
    _ToggleStats(e) {
      var ch = this.ViewPort.clientHeight;
      if (e.detail.checked) { this.StatsContainer.style.display = null; this._updateStats(); }
      else { this.StatsContainer.style.display = 'none'; }
      ch -= this.ViewPort.clientHeight
      if (ch > 0) { this.ViewPort.scrollTop += ch; }
    }
    _ToggleOnline(e) {
      var ch = this.ViewPort.clientHeight;
      if (e.detail.checked) { this.OnlineContainer.style.display = null; this.Timer = setInterval(() => { this._updateOnline() },500); this._updateOnline(); }
      else { this.OnlineContainer.style.display = 'none'; this.Timer = clearInterval(this.Timer); }
      ch -= this.ViewPort.clientHeight
      if (ch > 0) { this.ViewPort.scrollTop += ch; }
    }
    _updateIdle() { 
      var Client = this._Root._Sessions[this._Cid].Client , Chan = Client.GetICL(this._Target);
      if (Chan) {
        var dur = parseInt((Date.now() / 1000) - Chan.idle) , H = parseInt(dur / 3600) , M = parseInt((dur - H * 3600) / 60) , N = dur % 60
        this.IdleContainer.innerHTML = "Idle: " + H.toString().padStart(2,'0') + ":" + M.toString().padStart(2,'0') + ":" + N.toString().padStart(2,'0'); 
      }
      else { this.IdleContainer.innerHTML = "Idle: -"; }
    }
    _updateStats() { 
      var Client = this._Root._Sessions[this._Cid].Client , Chan = Client.GetICL(this._Target);
      if (Chan) {
        var keys = {};
        Client.Prefix.split("").forEach((key) => { keys[key] = 0; });
        Chan.Nicks.forEach((nick) => {
          var IAL = Client.GetIAL(nick);
          if (IAL.channels[this._Target.toLowerCase()] != '') { IAL.channels[this._Target.toLowerCase()].split("").forEach((key) => { keys[key]++; }); }
        });
        this.StatsContainer.innerHTML = JSON.stringify(keys).replace(/[\x22\x7B\x7D]/g,"").replace(/([\x2C\x3A])/g,(m) => { return m + " "; });
      }
      else { this.StatsContainer.innerHTML = ""; }
    }
    _updateOnline() { 
      var Client = this._Root._Sessions[this._Cid].Client , Time = Client.OTime;
      if (Time != '') {
        var dur = parseInt(Date.now() / 1000 - Time) , H = parseInt(dur / 3600) , M = parseInt((dur - H * 3600) / 60) , N = dur % 60
        this.OnlineContainer.innerHTML = "Online: " + H.toString().padStart(2,'0') + ":" + M.toString().padStart(2,'0') + ":" + N.toString().padStart(2,'0'); 
      }
      else { this.OnlineContainer.innerHTML = 'Online: -'}
    }
  
    _ToggleNicklist(e) {
      if (e.detail.checked) { this.ListDock.show(); }
      else { this.ListDock.hide(); }
    }
    _handleNickListEvent(event,nick,newnick) {
      var Client = this._Root._Sessions[this._Cid].Client , Chan = Client.GetICL(this._Target);
      if (/^(?:part|quit|kick)$/.test(event)) {
        var NickAction = this.List.querySelector("[data-nick='" + encodeURIComponent(nick) + "']");
        if (NickAction) { this.List.removeAction(NickAction); }
      }
      else if (event == 'join') {
        var IAL = Client.GetIAL(nick), Index = Chan.Nicks.indexOf(nick);
        if (IAL.channels.hasOwnProperty(this._Target.toLowerCase())) {
          var item = new QAction('',IAL.channels[this._Target.toLowerCase()].substr(0,1) + nick);
          item.dataset.nick = encodeURIComponent(nick);
          if (Index < Chan.Nicks.length-1) { this.List.insertAction(this.List._CentralWidget.childNodes[Index],item); }
          else { this.List.addAction(item); }
        }
      }
      else if (event == 'nick') {
        var NickAction = this.List.querySelector("[data-nick='" + encodeURIComponent(nick) + "']");
        if (NickAction) {
          var IAL = Client.GetIAL(newnick) , Index = Chan.Nicks.indexOf(newnick);
          this.List.removeAction(NickAction);
          NickAction.setText(IAL.channels[this._Target.toLowerCase()].substr(0,1) + newnick);
          NickAction.dataset.nick = encodeURIComponent(newnick);
          if (Index < Chan.Nicks.length-1) { this.List.insertAction(this.List._CentralWidget.childNodes[Index],NickAction); }
          else { this.List.addAction(NickAction); }
        }
      }
      else if (event == 'mode') {
        var nicks = new Set(nick.split(/ /).slice(1));
        nicks.forEach((Nick) => {
          if (Client.isOn(Nick,this._Target)) {
            var NickAction = this.List.querySelector("[data-nick='" + encodeURIComponent(Nick) + "']");
            if (NickAction) {
              var IAL = Client.GetIAL(Nick) , Index = Chan.Nicks.indexOf(Nick);
              this.List.removeAction(NickAction);
              NickAction.setText(IAL.channels[this._Target.toLowerCase()].substr(0,1) + Nick);
              NickAction.dataset.nick = encodeURIComponent(Nick);
              if (Index < Chan.Nicks.length-1) { this.List.insertAction(this.List._CentralWidget.childNodes[Index],NickAction); }
              else { this.List.addAction(NickAction); }
            }
            else { console.log("Nicklist Error! " + Nick + " was not found!"); }
          }
        });
      }
      this._updateTitle();
      this._updateStats();
    }
    _SortTree() {
      var Client = this._Root._Sessions[this._Cid].Client , array = this.TreeItem.Children();
      var sorted = array.sort((a,b) => {
        var c = Client.isChan(a._TreeLabel.innerText), d = Client.isChan(b._TreeLabel.innerText);
        if (c && !d) { return -1; }
        if (!c && d) { return 1; }
        return 0;
      });
      sorted.forEach((item) => { 
        item.parentNode.appendChild(item);
        var index = sorted.indexOf(item) , prev = (index == 0 ? this.TreeItem._SwitchItem : sorted[index-1]._SwitchItem );
        item._SwitchItem.parentNode.insertBefore(item._SwitchItem,prev.nextSibling);
        //if (index + 1 < sorted.length) { sorted[index+1].parentNode.insertBefore(item._SwitchItem,sorted[index+1]._SwitchItem); }
       });
    }
    _loadBlob(blob,url) {
      var source = new Image();
      source.addEventListener('load', (e) => { this.Picture.getContext('2d').drawImage(source,0,0,source.width,source.height); });
      source.addEventListener('error', () => { console.log('fuck! ' + blob); } );
      source.src = (!url ? 'data:' + [blob]: blob);
    }
  
    DrawCopy(flags,Source,x,y,w,h,dx,dy,dw,dh) {
      var Ctx = this.Picture.getContext("2d");
      Ctx.putImageData(Source.getImageData(x,y,w,h),dx,dy); 
    }
    DrawDot(flags,color,size,x,y) {  
      var Ctx = this.Picture.getContext("2d");
      Ctx.beginPath();
      Ctx.arc(x,y,size,0,Math.PI*2);
      Ctx.closePath();
      Ctx.lineWidth = 1;
      
      if (flags.indexOf("f") != -1) {
          Ctx.fillStyle = color;
        Ctx.fill();
      }
      else {
        //this._ctx.lineWidth = size;
          Ctx.strokeStyle = color;
        Ctx.stroke();
      }
    }
    DrawLine(flags,color,size,x1,y1,x2,y2) {
      var Ctx = this.Picture.getContext("2d");
      Ctx.beginPath();
      Ctx.moveTo(x1,y1);
      Ctx.lineTo(x2,y2);
      Ctx.closePath();
  
      Ctx.lineWidth = size;
      Ctx.strokeStyle = color;
      Ctx.stroke();
    }
    DrawArrow(flags,color,size,headlen,x1,y1,x2,y2) {
      var Ctx = this.Picture.getContext("2d") , angle = Math.atan2(y2-y1, x2-x1);
      Ctx.beginPath();
      Ctx.moveTo(x1,y1);
      Ctx.lineTo(x2,y2);
      Ctx.moveTo(x2,y2);
      Ctx.lineTo(x2 - headlen * Math.cos(angle - Math.PI / 6), y2 - headlen * Math.sin(angle - Math.PI / 6));
      Ctx.lineTo(x2,y2);
      Ctx.lineTo(x2 - headlen * Math.cos(angle + Math.PI / 6), y2 - headlen * Math.sin(angle + Math.PI / 6));
      Ctx.closePath();
  
      Ctx.lineWidth = size;
      Ctx.strokeStyle = color;
      Ctx.stroke();     
    }
  
    DrawRect(flags,color,size,x,y,w,h) {
      var Ctx = this.Picture.getContext("2d");
      Ctx.beginPath();
      if (flags.indexOf("d") != -1) { }
      else if (flags.indexOf("e") != -1) { }
      else { Ctx.rect(x,y,w,h); }
      Ctx.closePath();
  
      Ctx.lineWidth = size;
      if (flags.indexOf("f") != -1) {
        Ctx.fillStyle = color;
        Ctx.fill();
      }
      else {
        Ctx.strokeStyle = color;
        Ctx.stroke();
      }
    }
    DrawPolygon(flags,color,size,Points) {
      var Ctx = this.Picture.getContext("2d");
      Ctx.beginPath();
      Ctx.moveTo(Points[0],Points[1]);
      for (var i = 2; i < Points.length; i += 2) { Ctx.lineTo(Points[i],Points[i+1]); }
      //Ctx.lineTo(Points[0],Points[1]);
      Ctx.closePath();
      if (flags.indexOf("f") != -1) {
        Ctx.fillStyle = color;
        Ctx.fill();
      }
      else {
        Ctx.lineWidth = size;
        Ctx.strokeStyle = color;
        Ctx.stroke();
      }
    }
    DrawText(flags,color,font,x,y,text) {
      var Ctx = this.Picture.getContext("2d") , metrics = Ctx.measureText(text);
      Ctx.fillStyle = color;
      Ctx.font = font;
      //metrics are funny... ascent+decent != actual height... *2 is too much... 1.5 is a crapshoot close guess...
      Ctx.fillText(text,x,y);
      //+ (metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent) * 1.5);
    }
    GetDot(x,y) { 
      var Ctx = this.Picture.getContext("2d") , imgData = Ctx.getImageData(0,0,this.Picture.width,this.Picture.height);
      var index = y*imgData.width+x , i = index*4 , d = imgData.data
      return d[i].toString(16).padStart(2,0) + d[i+1].toString(16).padStart(2,0) + d[i+2].toString(16).padStart(2,0) + d[i+3].toString(16).padStart(2,0);
    }
    PutDot(color,x,y) {
      var Ctx = this.Picture.getContext("2d") , imgData = Ctx.getImageData(0,0,this.Picture.width,this.Picture.height);
      var pixelData = {
        width: imgData.width,
        height: imgData.height,
        data: new Uint32Array(imgData.data.buffer),
      };
      imgData.data[y*imgData.width+x] = color;
      Ctx.putImageData(imgData, 0, 0);
    }
    /*DrawFill(flags,newColor,oldColor,x,y) {
      if (x < 0 || y < 0 || x >= this.Picture.width || y >= this.Picture.height) { return; }
      var color = this.GetDot(x,y);
      //console.log(this.GetDot(x,y) + " vs " + oldColor + " or " + newColor)
      //return;
      if (color == oldColor || color == newColor) { return; }
      console.log(x + "," + y + " " + color + " == " + oldColor + " || " + color + " == " + newColor);
      this.PutDot(newColor,x,y);
      this.DrawFill('',newColor,oldColor,x+1,y);
      this.DrawFill('',newColor,oldColor,x-1,y);
      this.DrawFill('',newColor,oldColor,x,y+1);
      this.DrawFill('',newColor,oldColor,x,y-1);
    }
    DrawFill(flags,fillColor,StopColor,x,y) {
      function getPixel(pixelData, x, y) {
        if (x < 0 || y < 0 || x >= pixelData.width || y >= pixelData.height) { return -1; } 
        else { return pixelData.data[y * pixelData.width + x]; }
      }    
      // read the pixels in the canvas
      var Ctx = this.Picture.getContext("2d") , imageData = Ctx.getImageData(0,0,this.Picture.width,this.Picture.height);
  
      // make a Uint32Array view on the pixels so we can manipulate pixels
      // one 32bit value at a time instead of as 4 bytes per pixel
      const pixelData = {
        width: imageData.width,
        height: imageData.height,
        data: new Uint32Array(imageData.data.buffer),
      };
  
      // get the color we're filling
      const targetColor = getPixel(pixelData, x, y);
    
      // check we are actually filling a different color
      if (targetColor !== fillColor && targetColor !== StopColor) {
        const spansToCheck = [];
        function addSpan(left, right, y, direction) { spansToCheck.push({left, right, y, direction}); }    
        function checkSpan(left, right, y, direction) {
          let inSpan = false;
          let start;
          let x;
          for (x = left; x < right; ++x) {
            const color = getPixel(pixelData, x, y);
            if (color === targetColor) {
              if (!inSpan) {
                inSpan = true;
                start = x;
              }
            } 
            else {
              if (inSpan) {
                inSpan = false;
                addSpan(start, x - 1, y, direction);
              }
            }
          }
          if (inSpan) {
            inSpan = false;
            addSpan(start, x - 1, y, direction);
          }
        }
        addSpan(x, x, y, 0);
        while (spansToCheck.length > 0) {
          const {left, right, y, direction} = spansToCheck.pop();
        
          // do left until we hit something, while we do this check above and below and add
          let l = left;
          for (;;) {
            --l;
            const color = getPixel(pixelData, l, y);
            if (color !== targetColor) { break; }
          }
          ++l
        
          let r = right;
          for (;;) {
            ++r;
            const color = getPixel(pixelData, r, y);
            if (color !== targetColor) { break; }
          }
          const lineOffset = y * pixelData.width;
          pixelData.data.fill(fillColor, lineOffset + l, lineOffset + r);
          if (direction <= 0) { checkSpan(l, r, y - 1, -1); } 
          else { checkSpan(l, left, y - 1, -1); checkSpan(right, r, y - 1, -1); }
          if (direction >= 0) { checkSpan(l, r, y + 1, +1); } 
          else { checkSpan(l, left, y + 1, +1); checkSpan(right, r, y + 1, +1); }     
        }
        // put the data back
        Ctx.putImageData(imageData, 0, 0);
      }
    }*/
  }
  customElements.define('web-customwindow', CustomWindow);  