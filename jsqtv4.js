/*===============================================================================
Helper Functions
===============================================================================*/

function BitOnOff(method,num,bit) {
  var mask = 1 << (bit - 1);
  if (method == 2) { return (num & mask); }
  else if (method == 1) { num |= mask; }
  else { num &= ~mask; }
  return num;
}
function IsBit(num,bit) { return BitOnOff(2,num,bit); }
function BitOn(num,bit) { return BitOnOff(1,num,bit); }
function BitOff(num,bit) { return BitOnOff(0,num,bit); }

function QuickElement(name,attr,text) {
  var tmp = document.createElement(name) //Object.assign(,{textContent: text});
  for (var key in attr) { tmp.setAttribute(key,attr[key]); }
  tmp.innerHTML = text || '';
  return tmp;
}

/*===============================================================================
Qt Style Object Constructor
===============================================================================*/

class QObject extends HTMLElement {
  constructor(QParent) {
    super();

	  // Private Properties
	  this._Base = ["QObject"];
    this.classList.add("QObject");
    
	  this._BlockSignals = false;
	  this._Children = []; //Set has no indexOf :/ don't wanna cast it with Array.from() all the time, we'll just check "includes" on the array before pushing to it...
	  this._ObjectName = null;
	  this._Parent = QParent;
	  this._Signals = {};
  
    /*==== Emitted Signals ====================================
    TODO: destroyed(obj = null)
    objectNameChanged(objectName)
    =========================================================*/
    
    //test thingy!!
    //this.addEventListener('childEvent',(e) => { console.log(e.detail.target.metaObject() + ":Event:" + e.detail.QEvent); });
    	
    //insert into DOM (delay so all extensions get to execute modifiers)
    setTimeout(() => { this.setParent(QParent); });
  }
  connectedCallback() { }
  disconnectedCallback() { }
  
  //Default Event Handler Callback function
  handleEvent(e) { 
	  if (!this._BlockSignals) {
	    //Look for callbacks and execute them.
	    if (this._Signals[e.type]) { this._Signals[e.type].forEach(function(func) {
        //console.log("* CB: " + this._Base + ":" + e.type + ":" + typeof func.Call + ":" + func.Args); 
        func.Call.apply(func.Bind,(func.Args ? func.Args.push(e) : [e])); e.stopPropagation(); },this); 
      }
    }
  }
  
  //Private Functions
  _updateClassList() { this.className = this._Base.join(" "); }
  _customEvent(type,modifiers) { this.dispatchEvent(new CustomEvent(type,modifiers || {})); }
  _updateParent(parent) {
    if (Array.isArray(parent._Base) && parent._Base.includes('QObject')) {
      if (!parent._Children.includes(this)) { 
        parent._Children.push(this);
        parent._customEvent('childEvent',{ detail: { target: this, 'QEvent': (this._Base.includes('QAction') ? QEvent.ActionAdded : QEvent.ChildAdded) } });
      }
      if (this._Parent && this._Parent != parent && Array.isArray(this._Parent._Base) && this._Parent._Base.includes('QObject') && this._Parent._Children.includes(this)) { 
        this._Parent._Children.splice(this._Parent._Children.indexOf(this),1); 
        this._Parent._customEvent('childEvent',{ detail: { target: this, 'QEvent': (this._Base.includes('QAction') ? QEvent.ActionRemoved : QEvent.ChildRemoved) } });
      }
    }
    this._Parent = parent;
  }
  _removeChildObject(child) {
    if (this._Children.includes(child)) { 
      this._Children.splice(this._Children.indexOf(child),1); 
      this._customEvent('childEvent',{ detail: { target: child, 'QEvent': (child._Base.includes('QAction') ? QEvent.ActionRemoved : QEvent.ChildRemoved) } });
      child.parentNode.removeChild(child);
    }
    else { console.log("Error!"); console.log(child); }
  }

  //Public Functions
  blockSignals(bool) { this._BlockSignals = bool; return this; }  
  children() { return this._Children; }
  connect(signal,reciever,slot,args) { if (!this._Signals[signal]) { this._Signals[signal] = []; } this._Signals[signal].push({Bind: reciever, Call: slot, Args: args }); return this; }
  disconnect(signal,reciever,slot) { var Cbs = this._Signals[signal] , i = Cbs.length; while (i--) { var CB = Cbs[i]; if (CB.Bind == reciever && CB.Call == slot) { Cbs.splice(i,1); } } }
  isWidgetType() { return this._Base.includes('QWidget'); }
  isWindowType() { }
  metaObject() { return this._Base[this._Base.length - 1]; }
  objectName() { return this._ObjectName; }
  parent() { return this._Parent; }
  setObjectName(text) { this._ObjectName = text; this._customEvent('objectNameChanged',{ detail: { objectName: text } }); }
  setParent(parent,before) {
	  if (parent && parent.nodeType === Node.ELEMENT_NODE) {
	    this._updateParent(parent);
	    if (parent.hasOwnProperty('_CentralWidget')) { 
        if (before) { parent._CentralWidget.insertBefore(this,before); }
        else { parent._CentralWidget.appendChild(this); }
      }
	    else {
        if (before) { parent.insertBefore(this,before); }
        else { parent.appendChild(this); }
      }
    }
    return this;
  }
  signalsBlocked() { return this._BlockSignals; }
  
  //Public Slots
  //deleteLater() { } //What do we do with this?
}
customElements.define('q-object', QObject);

/*===============================================================================
Qt Style Action Constructor
===============================================================================*/

class QAction extends QObject {
  constructor(icon,text,parent) {
    // Always call super first in constructor
    super(parent);
    
    //Private Properties
	  this._Base.push("QAction");
    this.classList.add("QAction");

    this.setAttribute("style","position: relative;");
    
    //Build UI Components
	  this._Icon = QuickElement('img',{src: icon || 'transparent.png',draggable: "false",class: "Icon"});
	  this._IconText = QuickElement('span',{class: "Text"},text);
	  this._CentralWidget = QuickElement('div',{class: "CentralWidget"});

	  //firefox fails to use draggable=false .... force it in the drag event...
	  this._Icon.addEventListener('dragstart',(e) => { e.preventDefault(); });

	  this.appendChild(this._Icon);
	  this.appendChild(this._IconText);
	  this.appendChild(this._CentralWidget);

    /*==== Emitted Signals ====================================
    changed()
    hovered()
    toggled(checked)
    triggered(checked = false)
    =========================================================*/

    //Listen to Signals
    this.addEventListener('triggered',this);
    this.addEventListener('toggled',this);

    //Setup Event Listeners
    this.addEventListener('contextmenu',(e) => { 
      if (this.classList.contains('QMenu')) {
        this.classList.add('menurequested');
        e.preventDefault();
      }
    });
    this.addEventListener('pointerenter',(e) => { this._customEvent('hovered'); });
    this.addEventListener('click',(e) => {
      if (this.isCheckable()) { this.toggle(); }
      else { this.trigger(); }
    });
  }
  connectedCallback() { super.connectedCallback(); }
  disconnectedCallback() { super.disconnectedCallback(); }

  //Default Event Handler
  handleEvent(e) { super.handleEvent(e); }

  //Public Functions
  addAction(action) { action.setParent(this); }
  addMenu(menu) { menu.setParent(this); menu._Arrow.style.display = null; }
  icon() { return this._Icon.src; }
  iconText() { return this._IconText.innerText; }
  isCheckable() { return this.classList.contains('checkable'); }
  isChecked() { return this.classList.contains('checked'); }
  isSeparator() { return this.classList.contains('QActionSeparator'); }
  isVisible() { return (this.style.display = 'none' ? false : true); }
  menu() { }
  setCheckable(bool) {
    if (bool) { this.classList.add('checkable'); }
    else { this.classList.remove('checkable'); }
    return this;
  }
  setIcon(icon) { this._Icon.src = icon; return this; }
  setIconText(text) { this._IconText.innerHTML = text; return this; }
  setMenu(menu) { 
    this.classList.add('QMenu');
    this.addEventListener('contextmenu',this);
    this.addEventListener('pointerenter',() => { this.classList.remove('menurequested'); });
    return this; 
  }
  setSeparator(bool) { this._Icon.style.display = 'none'; this._IconText.innerHTML = ''; this.classList.toggle('QActionSeparator'); return this; }
  setText(text) { this.setIconText(text); return this; } //For now, same as setIconText
  setToolTip(tip) { this.title = tip; return this; }
  text() { return this._IconText.innerText; } //For now, same as iconText
  toolTip() { return this.title; }
  
  //Public Slots
  setChecked(bool) {
    if (bool) { this.classList.add('checked'); }
    else { this.classList.remove('checked'); }
    return this;
  }
  setDisabled(bool) { }
  setEnabled(bool) { }
  setVisible(bool) { 
    if (bool) { this.style.display = null; }
    else { this.style.display = 'none'; }
    return this;
  }
  toggle() { this.setChecked((this.isChecked() ? false : true)); this._customEvent('toggled',{ detail: { checked: this.isChecked() } }); }
  trigger() { this._customEvent('triggered',{ detail: { checked: false } }); }
}
customElements.define('q-action', QAction);

/*===============================================================================
Qt Style Mdi Area Constructor
===============================================================================*/

class QMdiArea extends QObject {
  constructor(parent) {
    super(parent);

    // Private Properties
	  this._Base.push("QMdiArea");
    this.classList.add("QMdiArea");
    this._CascadeData = [0,0,0];
    this._CurrentWindowState = 0;

    /*==== Catched Signals ====================================
    subWindowActivated(window) 
    =========================================================*/

    //Listen to signals
	  this.addEventListener('subWindowActivated',this);	
    this.addEventListener('childEvent',this);

    //Setup Event Listeners
  }
  connectedCallback() { super.connectedCallback(); } 
  disconnectedCallback() { super.disconnectedCallback(); }
  
  //Default Event Handler
  handleEvent(e) { 
    if (e.type == 'subWindowActivated') {
      if (e.detail.target.style.display == 'none') { e.detail.target.style.display = null; }
      e.stopPropagation();
    }
    if (e.type == 'childEvent') {
      if (e.detail.QEvent == QEvent.ChildAdded) {
        this._cascadeNewSubWindow(e.detail.target);
        setTimeout(() => { e.detail.target._customEvent('aboutToActivate'); });
        if (this._CurrentWindowState == Qt.WindowMaximized) {
          e.detail.target._RestoreX = e.detail.target.style.left;
          e.detail.target._RestoreY = e.detail.target.style.top;
          e.detail.target._RestoreW = e.detail.target.style.width;
          e.detail.target._RestoreH = e.detail.target.style.height;
          e.detail.target._Maximize.innerHTML = "&#128471;&#xFE0E;";
          e.detail.target.style.resize = 'none';
          e.detail.target.style.left = e.detail.target.style.top = e.detail.target.style.width = e.detail.target.style.height = null;
        }
      }
      else if (e.detail.QEvent == QEvent.WindowStateChange) {
        if (e.detail.state == Qt.WindowMaximized) { this._setSubWindowsMaximized(true); }
        else if (e.detail.state == Qt.WindowNoState) { this._setSubWindowsMaximized(false); }
        else if (e.detail.state == Qt.WindowMinimized) { this.activatePreviousSubWindow(); }
      }
      e.stopPropagation();
    }
    super.handleEvent(e); 
  }

  //Private Functions
  _cascadeNewSubWindow(window) {
    var newx = parseInt(window.style.left) , newy = parseInt(window.style.top) , handled = false;
    if (isNaN(newx)) { newx = 0; }
    if (isNaN(newy)) { newy = 0; }
    if (newx == 0 && newy == 0) {
      while (!handled) {
        newx += this._CascadeData[0] + 16 * this._CascadeData[2];
        newy += this._CascadeData[1];
        this._CascadeData[0] += 16;
        this._CascadeData[1] += 16;
        var w = parseInt(window.style.width) , xw = newx + w , h = parseInt(window.style.height) , yh = newy + h;
        if ((isNaN(w) || isNaN(h)) || (w > this.offsetWidth || h > this.offsetHeight)) { break; }
        if (xw < this.offsetWidth && yh < this.offsetHeight) {
          window.style.left = newx + "px";
          window.style.top = newy + "px";
          handled = true;
        }
        else { 
          if (newy == 0 && (xw > this.offsetWidth || yh > this.offsetHeight)) { this._CascadeData = [0,0,0]; }
          else { this._CascadeData[2]++; }
          newx = newy = this._CascadeData[0] = this._CascadeData[1] = 0; this._CascadeData[2]++;
        }
      }
    }
  }
  _setSubWindowsMaximized(bool) {
    for (var i = 0; i < this.childNodes.length; i++) {
      var node = this.childNodes[i];
      if (node.hasOwnProperty('_Base') && node._Base.includes('QMdiSubWindow')) {
        if (bool) {
          this._CurrentWindowState = Qt.WindowMaximized;
          node._RestoreX = node.style.left;
          node._RestoreY = node.style.top;
          node._RestoreW = node.style.width;
          node._RestoreH = node.style.height;
          node.style.left = node.style.top = 0;
          node.style.width = node.style.height = null;
          node._Maximize.innerHTML = "&#128471;&#xFE0E;";
          node.style.resize = 'none';
        }
        else {
          this._CurrentWindowState = Qt.WindowNoState;
          node.style.left = node._RestoreX;
          node.style.top = node._RestoreY;
          node.style.width = node._RestoreW;
          node.style.height = node._RestoreH;
          node._Maximize.innerHTML = "&#128470;&#xFE0E;";
          node.style.resize = 'both';
        }
      } 
    }
  }
  
  //Public Functions
  activeSubWindow() { return this.lastElementChild; }
  addSubWindow(Window) { Window.setParent(this); }
  removeSubWindow(Window) { this._removeChildObject(Window); }

  //Public Slots 
  //TODO: follow activation order instead of insertion order
  activateNextSubWindow() {
    var index = this._Children.indexOf(this.lastElementChild) + 1;
    if (index == this._Children.length) { index = 0; }
    this.setActiveSubWindow(this._Children[index]);    
  }
  //TODO: follow activation order instead of insertion order
  activatePreviousSubWindow() {
    var index = this._Children.indexOf(this.lastElementChild) - 1;
    if (index < 0) { index = this._Children.length - 1; }
    this.setActiveSubWindow(this._Children[index]);
  }
  cascadeSubWindows() { }
  closeActiveSubWindow() { }
  closeAllSubWindows() { }
  setActiveSubWindow(Window) { 
    Window._customEvent('aboutToActivate'); 
    Window._customEvent('subWindowActivated',{ bubbles: true, detail: { target: Window } }); 
    Window.setParent(this); 
  }
  tileSubWindows() { }
}
customElements.define('q-mdiarea', QMdiArea);

/*===============================================================================
Qt Style MenuBar Constructor 
===============================================================================*/
/*NOTE: Qt has this inherit QWidget, but we won't ever float it, doesn't need 
window controls (icon,title,min/max/close) so I'm inheriting QObject */

class QMenuBar extends QObject {
  constructor(parent) {
    // Always call super first in constructor
    super(parent);

	  //Private Properties
	  this._Base.push("QMenuBar");
    this.classList.add("QMenuBar");
    this.style.userSelect = 'none';

	  //Build UI Components
    this._Containers = [QuickElement('span',{}),QuickElement('span',{class: "MdiClipControls",style: "display: none; float: right;"})];
    this._CentralWidget = QuickElement('span',{class: "CentralWidget"});
    this._Icon = QuickElement('img',{src: '',draggable: "false",class: "MdiIcon",style: "display: none;"});
    this._Minimize = QuickElement('span',{class: "Minimize"},"&#128469;&#xFE0E;");
    this._Maximize = QuickElement('span',{class: "Maximize"},"&#128470;&#xFE0E;");
    this._Close = QuickElement('span',{class: "Close"},"&#128473;&#xFE0E;");

    this._Containers[0].appendChild(this._Icon);
    this._Containers[1].appendChild(this._Minimize);
    this._Containers[1].appendChild(this._Maximize);
    this._Containers[1].appendChild(this._Close);
    this.appendChild(this._Containers[0]);
    this.appendChild(this._CentralWidget);
    this.appendChild(this._Containers[1]);

    /*==== Catched Signals ====================================
    hovered(action)
    triggered(action)
    =========================================================*/
    
    //Listen to Signals

    //Setup Event Listeners
  }
  connectedCallback() { super.connectedCallback(); }
  disconnectedCallback() { super.disconnectedCallback(); }

  //Default Event Handler
  handleEvent(e) { super.handleEvent(e); }

  //Public Functions
  addAction(action) { action.setParent(this); }
  addMenu(Menu) { Menu.setParent(this); }
  addSeperator() { new QAction().setSeperator().setParent(this); }
  //clear() { } //TODO
  insertMenu(Before,Menu) { Menu.setParent(this,Before); }
  insertSeperator(Before) { new QAction().setSeperator().setParent(this,Before); }
  
  //Public Slots
  setVisible(bool) { 
    if (bool) { this.style.display = null; }
    else { this.style.display = 'none'; }
    return this;
  }
}
customElements.define('q-menubar', QMenuBar);

/*===============================================================================
Qt Style Menu Constructor
===============================================================================*/
/*NOTE: Qt has this inherit QWidget, but we won't ever float it, doesn't need 
window controls (icon,title,min/max/close) so I'm inheriting QObject */

class QMenu extends QObject {
  constructor(text) {
    // Always call super first in constructor
    super();

	  //Private Properties
	  this._Base.push("QMenu");
    this.classList.add("QMenu");
    this.setAttribute("style","position: relative;");

	  //Build UI Components   
    this._Icon = QuickElement('img',{src: "transparent.png", class: "Icon"});
    this._Text = QuickElement('span',{class: "Text"},text);
    this._Arrow = QuickElement('span',{class: "Arrow",style: "width: 16px; margin-left: 8px; display: none;"},"▶");
    this._CentralWidget = QuickElement('div',{class: "CentralWidget", style: "position: absolute;"});
    this.appendChild(this._Icon);
    this.appendChild(this._Text);
    this.appendChild(this._Arrow);
    this.appendChild(this._CentralWidget);

    /*==== Emitted Signals ====================================
    aboutToHide()       Not sure about these, CSS menus...
    aboutToShow()
    ====== Catched Signals ====================================
    hovered(action)
    triggered(action)
    =========================================================*/

    //Listen to Signals    

    //Setup Event Listeners
    //dirty hack to close menus on click...
    this.addEventListener('click',(e) => {
      this._CentralWidget.style.display = 'none';
      setTimeout(() => { this._CentralWidget.style.display = null; });
    });
    
  }
  connectedCallback() { super.connectedCallback(); }
  disconnectedCallback() { super.disconnectedCallback(); }

  //Default Event Handler
  handleEvent(e) { super.handleEvent(e); }

  //Public Functions
  addAction(Action) { Action.setParent(this); }
  addMenu(Menu) { Menu.setParent(this); Menu._Arrow.style.display = null; }
  addSeperator() { new QAction().setSeperator().setParent(this); }
  //clear() { } //TODO
  hideTearOffMenu() { }
  icon() { }
  insertMenu(Before,Menu) { Menu.setParent(this,Before); }
  insertSeperator(Before) { new QAction().setSeperator().setParent(this,Before); }
  removeMenu(Menu) { this._removeChildObject(Menu); }
  setIcon(icon) {
    if (icon) { this._Icon.src = icon; this._Icon.style.display = null; }
    else { this._Icon.style.display = 'none'; }
  }
  setTitle(title) { this._Text.innerHTML = title; }
  title() { return this._Text.innerText; }

  //Public Slots
}
customElements.define('q-menu', QMenu);

/*===============================================================================
Qt Style Statusbar Constructor
===============================================================================*/
/*NOTE: Qt has this inherit QWidget, but we won't ever float it, doesn't need 
window controls (icon,title,min/max/close) so I'm inheriting QObject */

class QStatusBar extends QObject {
  constructor(parent) {
    super(parent);

	  //Private Properties
	  this._Base.push("QStatusBar");
    this.classList.add("QStatusBar");
    this.style.userSelect = 'none';

	  //Build UI Components
    this._CentralWidget = QuickElement('div',{class:"CentralWidget"});
    this.appendChild(this._CentralWidget);

    /*==== Emitted Signals ====================================
      statusbar different than original QStatusBar!!!
    =========================================================*/    
    
    //Listen to Signals

    //Setup Event Listeners
  }
  connectedCallback() { super.connectedCallback(); }
  disconnectedCallback() { super.disconnectedCallback(); }
  
  //Default Event Handler
  handleEvent(e) { super.handleEvent(e); }

  //Public Functions
  addWidget(Widget,stretch) { this.appendChild(Widget); }
  insertWidget(Before,Widget,stretch) { this.insertBefore(Widget,Before); }
  removeWidget(Widget) { this._removeChildObject(Widget); }

  //Public Slots
}
customElements.define('q-statusbar', QStatusBar);

/*===============================================================================
Qt Style Tabbar Constructor
===============================================================================*/
/*NOTE: Qt has this inherit QWidget, but we won't ever float it, doesn't need 
window controls (icon,title,min/max/close) so I'm inheriting QObject */

class QTabBar extends QObject {
  constructor(parent) {
    super(parent);

	  //Private Properties
	  this._Base.push("QTabBar");
    this.classList.add("QTabBar");
    this.style.userSelect = 'none';

	  //Build UI Components
    this._CentralWidget = QuickElement('div',{class:"QTabBar"});
    this.appendChild(this._CentralWidget);

    /*==== Emitted Signals ====================================
      currentChanged(index)
      tabBarClicked(index)
      tabBarDoubleClicked(index)
      tabCloseRequested(index)
      tabMoved(from,to)
    =========================================================*/    
    
    //Listen to Signals

    //Setup Event Listeners
  }
  connectedCallback() { super.connectedCallback(); }
  disconnectedCallback() { super.disconnectedCallback(); }
  
  //Default Event Handler
  handleEvent(e) { super.handleEvent(e); }

  //Public Functions
  addTab(icon,text) { }
  count() { }
  insertTab(index,icon,text) { }
  moveTab(from,to) { }
  removeTab(index) { }
  setTabIcon(index,icon) { }
  setTabText(index,text) { }
  setTabToolTop(index,tip) { }
  tabIcon(index) { }
  tabText(index) { }
  tabToolTip(index) { }

  //Public Slots
  setCurrentIndex(index) { }
}
customElements.define('q-tabbar', QTabBar);

/*===============================================================================
Qt Style enum Flags
===============================================================================*/
//TODO: sub-object these so we call it by Qt.XXX.XXX
var Qt = {
  //QWidget flags
  Widget: 0,
  Window: 1,
  Dialog: 3,
  Popup: 9,
  Tool: 11,
  SubWindow: 18,
  WindowTitleHint: 4096,
  WindowMinimizeButtonHint: 16384,
  WindowMaximizeButtonHint: 32768,
  WindowMinMaxButtonsHint: 49152,
  WindowCloseButtonHint: 134217728,
  WindowStaysOnTopHint: 262144,
  WindowType_Mask: 255,

  //QDockWidget flags
  LeftDockWidgetArea: 1,
  RightDockWidgetArea: 2,
  TopDockWidgetArea: 4,
  BottomDockWidgetArea: 8,
  AllDockWidgetAreas: 15,
  NoDockWidgetArea: 0,

  //QToolBar flags
  LeftToolBarArea: 1,
  RightToolBarArea: 2,
  TopToolBarArea: 4,
  BottomToolBarArea: 8,
  AllToolBarAreas: 15,
  NoToolBarArea: 0,
  
  //QWindowState flags
  WindowNoState: 0,
  WindowMinimized: 1,
  WindowMaximized: 2,
  WindowFullScreen: 4,
  WindowActive: 8
}
var QEvent = {
  ActionAdded: 114,
  ActionChanged: 113,
  ActionRemoved: 115,
  ChildAdded: 68,
  ChildRemoved: 71,
  Close: 19,
  ContextMenu: 82,
  DragEnter: 60,
  DragLeave: 62,
  DragMove: 61,
  Drop: 63,
  Hide: 18,
  IconTextChange: 101,
  Leave: 11,
  MouseButtonDblClick: 4,
  MouseButtonPress: 2,
  MouseButtonRelease: 3,
  MouseMove: 5,
  Move: 13,
  ParentChange: 21,
  Resize: 14,
  Show: 17,
  TouchBegin: 194,
  TouchCancel: 209,
  TouchEnd: 196,
  TouchUpdate: 195,
  Wheel: 31,
  WindowIconChange: 34,
  WindowStateChange: 105,
  WindowTitleChange: 33
}

/*===============================================================================
Qt Style Widget Constructor
===============================================================================*/

class QWidget extends QObject {
  constructor(parent,flags) {
    // Always call super first in constructor
    super(parent);

	  // Private Properties
	  this._Base.push("QWidget");
    this.classList.add("QWidget");
	  this._WindowFlags = (flags || 0);
    this.setWindowFlags(flags);

    this._AcceptDrops = false;
    this._Maximized = false;
    this._Minimized = false;
    this._MoveData = null;

	  //Build UI Components
    this._Handle = QuickElement('div',{class: "WindowTitleBar", style: "user-select: none; border-spacing: 0; margin: 0; padding: 2px; flex-wrap: nowrap; white-space: nowrap;"});
    this._Icon = QuickElement('img',{class: "WindowIcon", src: "favicon.ico",style: "max-width: 16px; max-height: 16px;",draggable: "false"});
    this._Title = QuickElement('span',{class: "WindowTitle",style: "margin: 0 4px 0 4px; flex: auto; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;"},"");
    this._ClipControls = QuickElement('span',{class: "WindowClipControls", style: "max-width: 48px;"})

    this._Minimize = QuickElement('span',{class: "Minimize"},"&#128469;&#xFE0E;");
    this._Maximize = QuickElement('span',{class: "Maximize"},"&#128470;&#xFE0E;");
    this._Close = QuickElement('span',{class: "Close"},"&#128473;&#xFE0E;");

    this._Handle.appendChild(this._Icon);
    this._Handle.appendChild(this._Title);	
    this._Handle.appendChild(this._ClipControls);	

    this._ClipControls.appendChild(this._Minimize);
    this._ClipControls.appendChild(this._Maximize);
    this._ClipControls.appendChild(this._Close);	
    this.appendChild(this._Handle);
    this._ApplyWindowFlags();

    /*==== Emitted Signals ====================================
    customContextMenuRequested(pos)
    windowIconChanged(icon)
    windowTitleChanged(title)
    =========================================================*/
    
    //Listen to Signals
    this.addEventListener('customContextMenuRequested',this);
    this.addEventListener('windowIconChanged',this);
    this.addEventListener('windowTitleChanged',this);

    //Setup Event Listeners
    this.addEventListener('contextmenu',(e) => { this._customEvent('customContextMenuRequested',{ detail: { event: e } }); });

    //ChildEvent Stuffs!
	  var Events = ['dragenter','dragleave','dragstart','drop','pointerleave','dblclick','pointerdown','pointerup','pointermove','wheel']
	  Events.forEach((e) => { this.addEventListener(e,this); },this);
    this._Observer = new ResizeObserver((e) => { this._customEvent('childEvent',{ bubbles: true, detail: { target: this, jsEvent: e, 'QEvent': QEvent.Resize } }); }).observe(this);
    this._Close.addEventListener('pointerup',(e) => { this._customEvent('childEvent',{ bubbles: true, detail: { target: this, jsEvent: e, 'QEvent': QEvent.Close } }); })

    //insert into DOM (delay so all extensions get to execute modifiers)
    setTimeout(() => { this.setParent(parent,this._WindowFlags); });
  }
  connectedCallback() { super.connectedCallback(); }
  disconnectedCallback() { super.disconnectedCallback(); }

  //Default Event Handler
  handleEvent(e) {
    //Handle emitting custom childEvent for various QEvent types
	  switch (e.type) {
	    case 'dragenter':
        this._customEvent('childEvent',{ bubbles: true, detail: { target: this, jsEvent: e, 'QEvent': QEvent.DragEnter } });
      break;
      case 'dragleave':
        this._customEvent('childEvent',{ bubbles: true, detail: { target: this, jsEvent: e, 'QEvent': QEvent.DragLeave } });
      break;
      case 'dragstart':
        this._customEvent('childEvent',{ bubbles: true, detail: { target: this, jsEvent: e, 'QEvent': QEvent.DragMove } });
      break;
      case 'drop':
        this._customEvent('childEvent',{ bubbles: true, detail: { target: this, jsEvent: e, 'QEvent': QEvent.Drop } });
      break;
      case 'pointerleave':
        this._customEvent('childEvent',{ bubbles: true, detail: { target: this, jsEvent: e, 'QEvent': QEvent.Leave } });
      break;
      case 'dblclick':
        this._customEvent('childEvent',{ bubbles: true, detail: { target: this, jsEvent: e, 'QEvent': QEvent.MouseButtonDblClick } });
      break;
      case 'pointerdown':
        this._customEvent('childEvent',{ bubbles: true, detail: { target: this, jsEvent: e, 'QEvent': QEvent.MouseButtonPress } });
      break;
      case 'pointerup':
        this._customEvent('childEvent',{ bubbles: true, detail: { target: this, jsEvent: e, 'QEvent': QEvent.MouseButtonRelease } });
      break;
      case 'pointermove':
        this._customEvent('childEvent',{ bubbles: true, detail: { target: this, jsEvent: e, 'QEvent': QEvent.MouseMove } });
      break;
      case 'wheel':
        this._customEvent('childEvent',{ bubbles: true, detail: { target: this, jsEvent: e, 'QEvent': QEvent.Wheel } });
      break;
      default:
      break;
    }
    super.handleEvent(e); 
  }

  //Private Functions
  _ApplyWindowFlags() {
    //Are we a window?
    if (IsBit(this._WindowFlags,1)) {
      if ((this._WindowFlags & Qt.WindowTitleHint) == Qt.WindowTitleHint) { this._Handle.style.display = null; }
      else { this._Handle.style.display = 'none'; }
      if ((this._WindowFlags & Qt.Tool) != Qt.Tool) { this._Icon.style.display = null; }
      else { this._Icon.style.display = 'none'; }
      if ((this._WindowFlags & Qt.WindowMinimizeButtonHint) == Qt.WindowMinimizeButtonHint) { this._Minimize.style.display = null; }
      else { this._Minimize.style.display = 'none'; }
      if ((this._WindowFlags & Qt.WindowMaximizeButtonHint) == Qt.WindowMaximizeButtonHint) { this._Maximize.style.display = null; }
      else { this._Maximize.style.display = 'none'; }
      if ((this._WindowFlags & Qt.WindowCloseButtonHint) == Qt.WindowCloseButtonHint) { this._Close.style.display = null; }
      else { this._Close.style.display = 'none'; }
    }
    //we're a widget...
    else {
      //hide all the controls...
      this._Handle.style.display = this._Icon.style.display = this._Minimize.style.display = this._Maximize.style.display = this._Close.style.display = 'none';
      //TODO: store x,y,w,h,minw,minh,maxw,maxh incase we become a window again...
    }
    this._customEvent('childEvent',{ bubbles: true, detail: { target: this, jsEvent: undefined, 'QEvent': QEvent.WindowStateChange } });
  }

  //Public Functions
  acceptDrops() { }
  actions() { }
  activateWindow() { }
  addAction(action) { action.setParent(this); }
  addActions(actions) { actions.forEach((action) => { action.setParent(this) }); }
  contentsMargins() { return { top: this.style.marginTop, right: this.style.marginRight, bottom: this.style.marginBottom, left: this.style.marginLeft }; }
  cursor() { return this.style.cursor; }
  height() { return this.style.height; }
  insertAction(before,action) { action.setParent(this,before); }
  insertActions(before,actions) { actions.forEach((action) => { action.setParent(this,before) }); }
  isActiveWindow() { }
  isEnabled() { return (this.disabled == false ? true : false); }
  isHidden() { return (this.style.display == 'none' ? true : false); }
  isMaximized() { return this._Maximized; }
  isMinimized() { return this._Minimized; }
  isModal() { }
  isVisible() { return (this.style.display == 'none' ? false : true); }
  isWindow() { return ((this._WindowFlags & Qt.WindowTitleHint) == Qt.WindowTitleHint); }
  maximumHeight() { return this.style.maxHeight; }
  maximumWidth() { return this.style.maxWidth; }
  minimumHeight() { return this.style.minHeight; }
  minimumWidth() { return this.style.minWidth; }
  move(x,y) { 
    if (!isNaN(x)) { this.style.left = x + "px"; }
    if (!isNaN(y)) { this.style.top = y + "px"; }
  }
  overrideWindowFlags(flags) { }
  pos() { return [parseInt(this.style.left),parseInt(this.style.top)]; }
  removeAction(action) { this._removeChildObject(action); }
  resize(w,h) { 
    if (!isNaN(w)) { this.style.width = w + "px"; }
    if (!isNaN(h)) { this.style.height = h + "px"; }
    if (this._Base.includes('QMdiSubWindow')) { this.style.resize = 'both'; }
    return this;
  }
  scroll(dx,dy) { 
    if (!isNaN(dx)) { this.scrollLeft = dx; }
	  if (!isNaN(dy)) { this.scrollTop = dy; } 
    return this;
  }
  setAcceptDrops(bool) { }
  //setAttribute(attribute,bool = true) //Disabled, HTML elements have a setAttribute function...
  setBaseSize(basew,baseh) { this.resize(basew,baseh); return this; } //just call resize for now...
  setContentsMargins(top,right,bottom,left) {
    if (!isNaN(top)) { this.style.marginTop = top + "px"; }
    if (!isNaN(right)) { this.style.marginRight = right + "px"; }
    if (!isNaN(bottom)) { this.style.marginBottom = bottom + "px"; }
    if (!isNaN(left)) { this.style.marginLeft = left + "px"; }
    return this;
  }
  setCursor(cursor) { this.style.cursor = cursor; return this; }
  setFixedSize(w,h) { this.resize(w,h); return this; } //Just call resize for now..
  setFocus() { this.focus(); return this; }
  setMaximumSize(w,h) { 
    if (!isNaN(w)) { this.style.maxWidth = w + "px"; }
    if (!isNaN(h)) { this.style.maxHeight = h + "px"; }  
    return this;
  }
  setMinimumSize(w,h) { 
    if (!isNaN(w)) { this.style.minWidth = w + "px"; }
    if (!isNaN(h)) { this.style.minHeight = h + "px"; }
    return this;
  }
  setParent(parent,flags,before) {
    //TODO: remove any flags that shouldn't exist changing parents...
	  if (parent && parent.nodeType === Node.ELEMENT_NODE) {
      this._WindowFlags = (flags || this._WindowFlags);
      this._ApplyWindowFlags();
      super.setParent(parent,before);
    }
    return this;
  }
  setResizable(bool) { this.style.resize = (bool ? "both" : "none"); return this; }
  setToolTip(tip) { this.title = tip; return this; }
  setWindowFlag(flag,bool) {
    if (bool) { this._WindowFlags |= flag; }
    else { this._WindowFlags &= ~flag; }
    this._ApplyWindowFlags();
    return this;
  }
  setWindowFlags(flags) { this._WindowFlags = flags; return this; }
  setWindowIcon(icon) { 
    this._Icon.src = icon; 
    this._customEvent('childEvent',{ bubbles: true, detail: { target: this, 'QEvent': QEvent.WindowIconChange } });
    this._customEvent('windowIconChanged',{ detail: { 'icon': icon } });
    return this;
  }
  toolTip() { return this.title; }
  width() { return this.style.witdh; }
  window() { }
  windowIcon() { return this._Icon.src; }
  windowTitle(title) { return this._Title.innerText; }
  x() { return this.style.left; }
  y() { return this.style.top; }
  
  //Public Slots
  close() { }
  hide() { this.style.display = 'none'; }
  setDisabled(bool) { }
  setEnabled(bool) { }
  setFocus() { }
  setHidden(bool) { 
    if (bool) { this.hide(); } 
    else { this.show(); }
  }
  setVisible(bool) { 
    if (bool) { this.style.display = null; }
    else { this.style.display = 'none'; }
    return this;
  }
  setWindowTitle(title) { 
    this._Title.innerHTML = title; 
    this._customEvent('childEvent',{ bubbles: true, detail: { target: this, 'QEvent': QEvent.WindowTitleChange } });
    this._customEvent('windowTitleChanged',{ detail: { 'title': title } });
    return this; 
  }
  show() { this.style.display = null; }
  showMaximized() { }
  showMinimized() { }
  showNormal() { }  
}
customElements.define('q-widget', QWidget);

/*===============================================================================
Qt Style Dock Widget Constructor
===============================================================================*/

class QDockWidget extends QWidget {
  constructor(qstring) {
    var flags = Qt.Window | Qt.Tool | Qt.WindowTitleHint | Qt.WindowCloseButtonHint;
    super(null,flags);

	  //Private Properties
	  this._Base.push("QDockWidget");
    this.classList.add("QDockWidget");
    this._AllowedAreas = Qt.LeftDockWidgetArea | Qt.RightDockWidgetArea | Qt.TopDockWidgetArea | Qt.BottomDockWidgetArea;

    //Build UI Components
    this.setWindowTitle(qstring);
    this._CentralWidget = QuickElement('div',{class: "CentralWidget"});
    this.appendChild(this._CentralWidget);

    /*==== Emitted Signals ====================================
    allowedAreasChanged(allowedAreas)
    TODO: dockLocationChanged(area)
    TODO: featuresChanged(features)
    TODO: topLevelChanged(bool topLevel)
    visibilityChanged(visible)
    =========================================================*/
    
    //Listen to Signals
    this.addEventListener('allowedAreasChanged',this);
    this.addEventListener('visibilityChanged',this);
    this.addEventListener('childEvent',this);

    //Setup Event Listeners
    this.addEventListener('dragstart',(e) => { this.classList.toggle('Qt-CurrentDragWidget'); e.dataTransfer.setData('text/plain',null); });
    this._Handle.addEventListener('pointerover',(e) => { this.setAttribute('draggable',true); });
    this._Handle.addEventListener('pointerout',(e) => { this.setAttribute('draggable',false); });
    this._Close.addEventListener('click',(e) => { this.setVisible(false); this._customEvent('visibilityChanged', { detail: { visible: false } }); });
    //document.body.appendChild(this);
  }
  connectedCallback() { super.connectedCallback(); }
  disconnectedCallback() { super.disconnectedCallback(); }
  
  //Default Event Handler
  handleEvent(e) { 
    super.handleEvent(e);
    if (e.type == 'childEvent') {
      if (e.detail.QEvent == QEvent.Resize) {
        var Parent = this.parentNode, Children = Array.from(Parent.childNodes);
        Children.forEach((child) => {
          if (child != this) {
            if (Parent.classList.contains('QDockWidgetArea-Horizontal')) { child.style.height = this.style.height; }
            if (Parent.classList.contains('QDockWidgetArea-Vertical')) { child.style.width = this.style.width; }
          }
        });
      }
    }
  }

  // Public Functions
  setAllowedAreas(Areas) { this._AllowedAreas = Areas; this._customEvent('allowedAreasChanged',{ detail: { allowedAreas: Areas } }); return this; }
  setCentralWidget(Widget) { this._CentralWidget.appendChild(Widget); return this; }
}
// Define the new element
customElements.define('q-dockwidget', QDockWidget);

/*===============================================================================
Qt Style ListView Constructor
===============================================================================*/

class QListView extends QWidget {
  constructor(parent) {
    // Always call super first in constructor
    super(parent);

	  //Private Properties
	  this._Base.push("QListView");
    this.classList.add("QListView");
    this.style.userSelect = 'none';
    this.classList.add("Static");

	  //Signals
	  //this.addEventListener('indexesMoved',this);

    //Setup Event Listeners
    this.addEventListener('selectionChanged',(e) => {
      this.setSelected(e.detail.selected);
      if (e.detail.deselected && e.detail.selected != e.detail.deselected) { this.deSelect(e.detail.deselected); }
    });
  }
  connectedCallback() { super.connectedCallback(); }
  disconnectedCallback() { super.disconnectedCallback(); }
  
  //Default Event Handler
  handleEvent(e) { super.handleEvent(e); }

  //Public Functions
  addSeperator() { this.appendChild(new QAction().setSeperator()); }
  insertSeperator(Before) { this.setParent(new QAction().setSeperator(),Before); }
  setViewMode(mode) {
    this.classList.remove("Static");
    this.classList.remove("IconView");
    this.className.add((/^iconview$/i.test(mode) ? "IconView" : "Static"));
    return this;
  }
  setSelected(Action) { Action.className = "selected"; }
  deSelect(Action) { Action.classList.remove("selected"); }

  //Public Slots
}
customElements.define('q-listview', QListView);

/*===============================================================================
Qt Style Toolbar Constructor
===============================================================================*/

class QToolBar extends QWidget {
  constructor() {
    super(parent);

	  //Private Properties
	  this._Base.push("QToolBar");
    this.classList.add("QToolBar");
    this.style.userSelect = 'none';
    this._AllowedAreas = Qt.LeftToolBarArea | Qt.RightToolBarArea | Qt.TopToolBarArea | Qt.BottomToolBarArea;

    //Build UI Components
    this._Handle = QuickElement('div',{class: "ToolBarHandle"});
    this.appendChild(this._Handle);

    /*==== Emitted Signals ====================================
    allowedAreasChanged(allowedAreas)
    TODO: iconSizeChanged(size)
    movableChanged(movable)
    TODO: orientationChanged(orientation)
    TODO: toolButtonStyleChanged(toolButtonStyle)
    TODO: topLevelChanged(bool topLevel)
    visibilityChanged(visible)
    ====== Catched Signals ====================================
    TODO: actionTriggered(action)    
    =========================================================*/  

    //Listen to Signals

    //Setup Event Listeners
    this.addEventListener('dragstart',(e) => { this.classList.toggle('Qt-CurrentDragWidget'); e.dataTransfer.setData('text/plain',null); });
    this._Handle.addEventListener('pointerover',(e) => { this.setAttribute('draggable',true); });
    this._Handle.addEventListener('pointerout',(e) => { this.setAttribute('draggable',false); });
  }
  connectedCallback() { super.connectedCallback(); }
  disconnectedCallback() { super.disconnectedCallback(); }
  
  //Default Event Handler
  handleEvent(e) { super.handleEvent(e); }

  //Private Functions

  //Public Functions
  addSeperator() { this.appendChild(new QAction().setSeparator()); }
  isMovable() { return (this._Handle.style.display == 'none' ? false : true); }
  insertSeperator(Before) { this.insertBefore(new QAction().setSeparator(),Before); } 
  setAllowedAreas(Areas) { this._AllowedAreas = Areas; this._customEvent('allowedAreasChanged', { detail: { allowedAreas: Area } }); return this; }
  setMovable(bool) {
    if (bool) { this._Handle.style.display = null; }
    else { this._Handle.style.display = 'none'; }
    this._customEvent('movableChanged',{ detail: { movable: bool } });
    return this;
  }
  //Public Slots
}
customElements.define('q-toolbar', QToolBar);

/*===============================================================================
Qt Style Tree Widget Constructor (Temporary)
===============================================================================*/

class QTreeWidget extends QWidget {
  constructor(parent) {
    super(parent);

    // Private Properties
    this._Base.push("QTreeWidget");
    this.classList.add("QTreeWidget");
    this.style.userSelect = 'none';

    //Build UI Components
    this._CentralWidget = QuickElement('div',{'class':"CentralWidget"});
    this.appendChild(this._CentralWidget);

    /*==== Emitted Signals ====================================
    TODO: itemSelectionChanged()
    TODO: currentItemChanged(current,previous)
    ====== Catched Signals ====================================
    TODO: itemActivated(item,column)
    TODO: itemChanged(item,column)
    TODO: itemClicked(item,column)
    TODO: itemCollapsed(item)
    TODO: itemDoubleClicked(item,column)
    TODO: itemEntered(item,column)
    TODO: itemExpanded(item)
    TODO: itemPressed(item,column)
    =========================================================*/
    
    //Listen to Signals

    //Setup Event Listeners
    this.addEventListener('itemSelectionChanged',(e) => { this.setCurrentItem(e.detail.target); });
  }
  connectedCallback() { super.connectedCallback(); }
  disconnectedCallback() { super.disconnectedCallback(); }

  //Default Event Handler
  handleEvent(e) { super.handleEvent(e); }

  //Private Functions

  //Public Functions
  addTopLevelItem(Item) { }
  insertTopLevelItem(Before,Item) { }
  setCurrentItem(item) {
    this.querySelectorAll('.selected').forEach((child) => { child.classList.remove('selected'); });
    item._Container.classList.add('selected');
  }
}
// Define the new element
customElements.define('q-treewidget', QTreeWidget);


/*===============================================================================
Qt Style Tree Widget Constructor (Temporary)
===============================================================================*/

class QTreeWidgetItem extends QWidget {
  constructor(qicon,qstring,parent) {
    super(parent);

    // Private Properties
    this._Base.push("QTreeWidgetItem");
    this.classList.add("QTreeWidgetItem");
  
    //Build UI Components
    this._Container = QuickElement('div',{'class':'Container'});
    this._TreeIcon = QuickElement('img',{'class':'Icon',src: qicon || '',draggable: "false"});
    this._TreeLabel = QuickElement('span',{'class':'Text'},qstring);
    this._CentralWidget = QuickElement('div',{'class':"CentralWidget"});
    this._Container.appendChild(this._TreeIcon);
    this._Container.appendChild(this._TreeLabel);
    this.appendChild(this._Container);
    this.appendChild(this._CentralWidget);

    /*==== Emitted Signals ====================================
    TODO: itemActivated(item,column)
    TODO: itemChanged(item,column)
    TODO: itemClicked(item,column)
    TODO: itemCollapsed(item)
    TODO: itemDoubleClicked(item,column)
    TODO: itemEntered(item,column)
    TODO: itemExpanded(item)
    TODO: itemPressed(item,column)
    =========================================================*/
    
    //Listen to Signals
    this.addEventListener('itemClicked',this);

    //Setup Event Listeners
    this._Container.addEventListener('click',(e) => { this._customEvent('itemSelectionChanged',{ bubbles: true, detail: { target: this } }); this._customEvent('itemClicked',{ bubbles: true, detail: { target: this } }); });
    this._TreeIcon.addEventListener('click',(e) => { this._ToggleExpanded(); e.stopPropagation(); });
  }
  connectedCallback() { super.connectedCallback(); }
  disconnectedCallback() { super.disconnectedCallback(); }
  
  //Default Event Handler
  handleEvent(e) { super.handleEvent(e); }

  //Private Functions
  _ToggleExpanded() { 
    if (this._CentralWidget.style.display == 'none') { 
      this._customEvent('itemExpanded',{ bubbles: true, detail: { target: this } });
      this._CentralWidget.style.display = null;
    }
    else { 
      this._customEvent('itemCollapsed',{ bubbles: true, detail: { target: this } });
      this._CentralWidget.style.display = 'none'; 
    }
  }
  
  // Public Functions
  addChild(child) { this._CentralWidget.appendChild(child); }
  addChildren(children) { chilren.forEach((child) => { this._CentralWidget.appendChild(child); }); }
  insertChild(before,child) { }
  insertChildren(Before,children) { }
  isSelected() { return this._Container.classList.contains('selected'); }
  removeChild(child) { this._removeChildObject(child); }
  setIcon(icon) { this._TreeIcon.src = icon; return this; }
  setText(text) { this._TreeLabel.innerHTML = text; return this; }
  setToolTip (tooltip) { this.title = tooltip; return this; }
  setExpanded(bool) {
    if (bool) { this._CentralWidget.style.display = null; }
    else { this._CentralWidget.style.display = 'none'; }
  }
  setSelected(bool) { this._customEvent('itemSelectionChanged',{ bubbles: true, detail: { target: this } }); }
}
// Define the new element
customElements.define('q-treewidgetitem', QTreeWidgetItem);

/*===============================================================================
Qt Style Tree Widget Constructor (Finish actual Qt treebar class...)
===============================================================================

class QTreeWidget extends QWidget {
  constructor() {
    super(parent);

	  //Private Properties
	  this._Base.push("QTreeWidget");
    this.classList.add("QTreeWidget");
    this.style.userSelect = 'none';
    this._Columns = 1;
    this._Headers = [QuickElement('th',{style: 'display: inline-block; padding-right: 16px; resize: horizontal; white-space: nowrap; overflow: hidden;'})];

    //Build UI Components
    this._Table = QuickElement('table',{style: 'width: 100%;'});
    this._HeaderRow = QuickElement('tr',{style: 'display: flex;'});
    this._Headers.forEach((header) => { this._HeaderRow.appendChild(header); });

    this._Table.appendChild(this._HeaderRow);
    this.appendChild(this._Table);

    //Signals
    //currentItemChanged
    //itemActivated
    //itemChanged
    //itemClicked
    //itemCollapsed
    //itemDoubleClicked
    //itemEntered
    //itemExpanded
    //itemPressed
    //itemSelectionChanged

    //Setup Event Listeners
  }
  connectedCallback() { super.connectedCallback(); }
  disconnectedCallback() { super.disconnectedCallback(); }
  
  //Default Event Handler
  handleEvent(e) { super.handleEvent(e); }

  //Private Functions

  //Public Functions
  addTopLevelItem(item) {}
  addTopLevelItems(items) {}
  columnCount() {}
  //currentColumn() {}
  currentItem() {}
  editItem(item,column = 0) {}
  headerItem() {}
  indexOfTopLevelItem(item) {}
  insertTopLevelItem(index,item) {}
  insertTopLevelItems(index,items) {}
  removeItemWidget(item,column) {}
  selectedItems() {}
  setColumnCount(columns) {
    if (columns > this._Columns) {
      var diff = columns - this._Headers.length;
      console.log(this._Headers.length + " - " + columns);
      if (diff > 0) {
      console.log('adding headers');
        for (var x = 0; x <= (diff -1); x++) { 
          var newheader = QuickElement('th',{style: 'flex: auto; display: inline-block; padding-right: 16px; resize: horizontal; white-space: nowrap; overflow: hidden;'});
          this._Headers.push(newheader); 
          this._HeaderRow.appendChild(newheader);
        }
      }
      this._Columns = columns;
    }
    return this;
  }
  setCurrentItem(item,column = 0) {}
  setHeaderItem(item) {}
  setHeaderLabel(label) { this._Headers[0].innerHTML = label; }
  setHeaderLabels(labels) {
    for (var x = 0; x < labels.length; x++) {
      if (this._Headers[x]) { this._Headers[x].innerText = labels[x]; }
    }
  }
  topLevelItem(index) {}
  topLevelItemCount() { }  

  //Public Slots
  clear() {}
  collapseItem(item) {}
  expandItem(item) {}
  scrollToItem(item) {}
}
customElements.define('q-treewidget', QTreeWidget);

/*===============================================================================
Qt Style Main Window Constructor (will be shared with subwindows and dialogs)
===============================================================================*/

class QMainWindow extends QWidget {
  constructor(parent,flags) {
    parent = (parent || document.body);
    flags = (flags || Qt.Window | Qt.WindowTitleHint | Qt.WindowMinMaxButtonsHint | Qt.WindowCloseButtonHint);
    super(parent,flags);

	  //Private Properties
	  this._Base.push("QMainWindow");
    this.classList.add("QMainWindow");
	
    //Build UI Components
    this._Containers = [QuickElement('div',{style:"display: flex; flex-direction: row; flex: 1; overflow: hidden;"}),QuickElement('div',{style:"display: flex; flex-direction: column; flex: 1; overflow: hidden;"}),QuickElement('div',{style:"display: flex; flex-direction: row; flex: 1; overflow: hidden;"}),QuickElement('div',{style:"display: flex; flex-direction: column; flex: 1; overflow: hidden;"})];
    this._MenuBar = new QMenuBar();
    this._ToolBarAreas = { top: QuickElement('div',{class:"QToolBarArea-Horizontal","data-position":"top"}), left: QuickElement('div',{class:"QToolBarArea-Vertical","data-position":"left"}), bottom: QuickElement('div',{class:"QToolBarArea-Horizontal","data-position":"bottom"}), right: QuickElement('div',{class:"QToolBarArea-Vertical","data-position":"right"}) };
    this._DockWidgetAreas = { top: QuickElement('div',{class:"QDockWidgetArea-Horizontal","data-position":"top"}), left: QuickElement('div',{class:"QDockWidgetArea-Vertical","data-position":"left"}), bottom: QuickElement('div',{class:"QDockWidgetArea-Horizontal","data-position":"bottom"}), right: QuickElement('div',{class:"QDockWidgetArea-Vertical","data-position":"right"}) };
    this._CentralWidget = QuickElement('div',{class: "CentralWidget", style: "display: flex; flex: auto; flex-direction: column; flex-wrap: nowrap; overflow: hidden;"},);
    this._StatusBar = new QStatusBar();
    this.appendChild(this._MenuBar);
    this.appendChild(this._Containers[0]);
    this._Containers[0].appendChild(this._ToolBarAreas['left']);
    this._Containers[0].appendChild(this._Containers[1]);
    this._Containers[1].appendChild(this._ToolBarAreas['top']);
    this._Containers[1].appendChild(this._Containers[2]);
    this._Containers[2].appendChild(this._DockWidgetAreas['left']);
    this._Containers[2].appendChild(this._Containers[3]);
    this._Containers[3].appendChild(this._DockWidgetAreas['top']);
    this._Containers[3].appendChild(this._CentralWidget);
    this._Containers[3].appendChild(this._DockWidgetAreas['bottom']);
    this._Containers[2].appendChild(this._DockWidgetAreas['right']);
    this._Containers[1].appendChild(this._ToolBarAreas['bottom']);
    this._Containers[0].appendChild(this._ToolBarAreas['right']);	
    this.appendChild(this._StatusBar);

    /*==== Emitted Signals ====================================
    Parent class handles: iconSizeChanged(iconSize)
    Parent class handles: toolButtonStyleChanged(toolButtonStyle)
    TODO: tabifiedDockWidgetActivated(dockwidget)
    =========================================================*/
    
    //Listen to Signals

    //Setup Event Listeners
    this.addEventListener('dragstart',(event) => { 
      var dragged = event.target;
      if (dragged.hasOwnProperty('_Base')) {
        if (dragged._Base.includes('QToolBar')) {
          setTimeout(() => { 
            Object.keys(this._ToolBarAreas).forEach((Area) => {
              if (((dragged._AllowedAreas & Qt.LeftToolBarArea) == Qt.LeftToolBarArea && Area == 'left') || ((dragged._AllowedAreas & Qt.RightToolBarArea) == Qt.RightToolBarArea && Area == 'right') || ((dragged._AllowedAreas & Qt.TopToolBarArea) == Qt.TopToolBarArea && Area == 'top') || ((dragged._AllowedAreas & Qt.BottomToolBarArea) == Qt.BottomToolBarArea && Area == 'bottom')) {
                this._ToolBarAreas[Area].style.minWidth = "22px"; this._ToolBarAreas[Area].style.minHeight = "22px"; 
              }
            },this); 
          },0);
        }
        if (dragged._Base.includes('QDockWidget')) {
          setTimeout(() => { 
            Object.keys(this._DockWidgetAreas).forEach((Area) => { 
              if (((dragged._AllowedAreas & Qt.LeftDockWidgetArea) == Qt.LeftDockWidgetArea && Area == 'left') || ((dragged._AllowedAreas & Qt.RightDockWidgetArea) == Qt.RightDockWidgetArea && Area == 'right') || ((dragged._AllowedAreas & Qt.TopDockWidgetArea) == Qt.TopDockWidgetArea && Area == 'top') || ((dragged._AllowedAreas & Qt.BottomDockWidgetArea) == Qt.BottomDockWidgetArea && Area == 'bottom')) {
                this._DockWidgetAreas[Area].style.minWidth = "22px"; this._DockWidgetAreas[Area].style.minHeight = "22px";
              }
            },this);
          },0);
        }
        this._acceptDrops = true;
        event.stopPropagation();
      }
    },false);
    this.addEventListener('dragend',(event) => { 
      var dragged = document.querySelector('.Qt-CurrentDragWidget');
      Object.keys(this._ToolBarAreas).forEach((Area) => { this._ToolBarAreas[Area].style.minWidth = ""; this._ToolBarAreas[Area].style.minHeight = ""; },this); 
      Object.keys(this._DockWidgetAreas).forEach((Area) => { this._DockWidgetAreas[Area].style.minWidth = ""; this._DockWidgetAreas[Area].style.minHeight = ""; },this); 
      if (dragged) { dragged.classList.toggle('Qt-CurrentDragWidget') }
      this._acceptDrops = false;
    },false);

    for (var area in this._ToolBarAreas) {
      var Main = this;
      this._ToolBarAreas[area].addEventListener('dragover',function(event,main = Main) {
        var dragged = document.querySelector('.Qt-CurrentDragWidget') , Area = this.dataset.position;
        if (dragged && dragged.hasOwnProperty('_Base') && dragged._Base.includes('QToolBar') && main._acceptDrops == true) { 
          if (((dragged._AllowedAreas & Qt.LeftToolBarArea) == Qt.LeftToolBarArea && Area == 'left') || ((dragged._AllowedAreas & Qt.RightToolBarArea) == Qt.RightToolBarArea && Area == 'right') || ((dragged._AllowedAreas & Qt.TopToolBarArea) == Qt.TopToolBarArea && Area == 'top') || ((dragged._AllowedAreas & Qt.BottomToolBarArea) == Qt.BottomToolBarArea && Area == 'bottom')) {
            event.preventDefault(); 
          }
        } 
      }.bind(this._ToolBarAreas[area]), false);
      this._ToolBarAreas[area].addEventListener('drop',(event) => { 
        var dragged = document.querySelector('.Qt-CurrentDragWidget');
        if (dragged && dragged.hasOwnProperty('_Base') && dragged._Base.includes('QToolBar')) { 
          if (this._acceptDrops == true) { 
            event.preventDefault();
            if (event.target == event.currentTarget) { event.currentTarget.appendChild(dragged); dragged.setAttribute('draggable',false); } 
            else {
              var owner = event.target; 
              while(owner) {
                if (/^QToolBarArea/.test(owner.parentNode.className)) { event.currentTarget.insertBefore(dragged,((owner.previousSibling == null && owner.nextSibling == null) || (owner.nextSibling != event.target && owner.previousSibling != null) ? owner.nextSibling : owner)); dragged.setAttribute('draggable',false); break; } 
                else { owner = owner.parentNode; }
              } 
            }
          }
        }
      },false);
	  }

    for (var area in this._DockWidgetAreas) {
      var Main = this;
      this._DockWidgetAreas[area].addEventListener('dragover',function(event,main = Main) {
        var dragged = document.querySelector('.Qt-CurrentDragWidget') , Area = this.dataset.position;
        if (dragged && dragged.hasOwnProperty('_Base') && dragged._Base.includes('QDockWidget') && main._acceptDrops == true) { 
          if (((dragged._AllowedAreas & Qt.LeftDockWidgetArea) == Qt.LeftDockWidgetArea && Area == 'left') || ((dragged._AllowedAreas & Qt.RightDockWidgetArea) == Qt.RightDockWidgetArea && Area == 'right') || ((dragged._AllowedAreas & Qt.TopDockWidgetArea) == Qt.TopDockWidgetArea && Area == 'top') || ((dragged._AllowedAreas & Qt.BottomDockWidgetArea) == Qt.BottomDockWidgetArea && Area == 'bottom')) {
            event.preventDefault(); 
          }
        }
      }.bind(this._DockWidgetAreas[area]), false);
      this._DockWidgetAreas[area].addEventListener('drop',(event) => { 
        var dragged = document.querySelector('.Qt-CurrentDragWidget');
        if (dragged && dragged.hasOwnProperty('_Base') && dragged._Base.includes('QDockWidget')) { 
          if (this._acceptDrops == true) { 
            event.preventDefault();
            if (event.target == event.currentTarget) { event.currentTarget.appendChild(dragged); dragged.setAttribute('draggable',false); } 
            else {
              var owner = event.target; 
              while(owner) {
                if (/^QDockWidgetArea/.test(owner.parentNode.className)) { event.currentTarget.insertBefore(dragged,((owner.previousSibling == null && owner.nextSibling == null) || (owner.nextSibling != event.target && owner.previousSibling != null) ? owner.nextSibling : owner)); dragged.setAttribute('draggable',false); break; } 
                else { owner = owner.parentNode; }
              } 
            }
          }
        }
      },false);
	  }
  }
  connectedCallback() { super.connectedCallback(); }
  disconnectedCallback() { super.disconnectedCallback(); }
  
  //Default Event Handler
  handleEvent(e) { super.handleEvent(e); }

  //Private Functions

  //Public Functions
  addDockWidget(area,dockwidget,orientation) {
    if (dockwidget._Base.includes('QDockWidget')) {
      if ((area & Qt.LeftDockWidgetArea) == Qt.LeftDockWidgetArea) { var Area = 'left' }
      else if ((area & Qt.RightDockWidgetArea) == Qt.RightDockWidgetArea) { var Area = 'right' }
      else if ((area & Qt.TopDockWidgetArea) == Qt.TopDockWidgetArea) { var Area = 'top' }
      else if ((area & Qt.BottomDockWidgetArea) == Qt.BottomDockWidgetArea) { var Area = 'bottom' }
      if (Area) {
        dockwidget._updateParent(this);
        this._DockWidgetAreas[Area].appendChild(dockwidget); 
      }
    }      
    return this;    
  } //Maybe use orientation later?
  addToolBar(area,toolbar) { 
    if (toolbar._Base.includes('QToolBar')) {
      if ((area & Qt.LeftToolBarArea) == Qt.LeftToolBarArea) { var Area = 'left' }
      else if ((area & Qt.RightToolBarArea) == Qt.RightToolBarArea) { var Area = 'right' }
      else if ((area & Qt.TopToolBarArea) == Qt.TopToolBarArea) { var Area = 'top' }
      else if ((area & Qt.BottomToolBarArea) == Qt.BottomToolBarArea) { var Area = 'bottom' }
      if (Area) {
        toolbar._updateParent(this);
        this._ToolBarAreas[Area].appendChild(toolbar); 
      }
    }      
    return this;    
  }
  //addToolbarBreak(area) { } //TODO
  centralWidget() { return this._CentralWidget; }
  //dockWidgetArea(dockwidget) { } //Return dock location or null (if floating)
  insertToolBar(before,toolbar) { }
  //inserToolBarBreak(before) { } //TODO
  menuBar() { return this._MenuBar; } //We're always gonna make a menubar, it just might have no menus... so this is pointless...
  menuWidget() { return this._MenuBar; }
  removeDockWidget(dockwidget) { }
  removeToolBar(toolbar) { }
  //removeToolBarBreak(before) { }
  resizeDocks(docks,sizes,orientations) { }
  setCentralWidget(widget) { this._CentralWidget.appendChild(widget); return this; }
  //setMenuBar(menubar) { }
  //setMenuWidget(menubar) { }
  //setStatusBar(statusbar) { }
  statusBar() { return this._StatusBar; }
  //takeCentralWidget() { }
  toolBarArea(toolbar) { } //Return dock location or null (if floating)
  
  //Public Slots
}
// Define the new element
customElements.define('q-mainwindow', QMainWindow);


/*===============================================================================
Qt Style Dialog Constructor
===============================================================================*/

class QDialog extends QMainWindow {
  constructor(flags) {
    flags = (flags || Qt.Window | Qt.Dialog | Qt.WindowTitleHint | Qt.WindowCloseButtonHint);
    super(document.body,flags);

    // Private Properties
    this._Base.push("QDialog");

    /*==== Emitted Signals ====================================
    TODO: accepted()
    TODO: finished(int result)
    TODO: rejected()
    =========================================================*/
    
    //Listen to Signals
    //this.addEventListener('accepted',this);
    //this.addEventListener('finished',this);
    //this.addEventListener('rejected',this);

    //Build UI Components

    //Setup Event Listeners
    this.addEventListener('pointermove',(e) => { this._MoveDialogPosition(e); });
    this.addEventListener('pointerleave',(e) => { this._StopMove(e); });

    this._Handle.addEventListener('pointerdown',(e) => { this._StartMove(e); });
    this._Handle.addEventListener('pointerup',(e) => { this._StopMove(e); });
    this.addEventListener('pointerleave',(e) => { this._StopMove(e); });

    //this._Minimize.addEventListener('click',(e) => { this._MinimizeBtn(e); });
    //this._Maximize.addEventListener('click',(e) => { this._MaximizeBtn(e); });
    //this._Close.addEventListener('click',(e) => { this._CloseBtn(); });
  }
  connectedCallback() { super.connectedCallback(); } 
  disconnectedCallback() { super.disconnectedCallback(); }
  
  //Default Event Handler
  handleEvent(e) { super.handleEvent(e); }

  // Private Functions
  _MoveDialogPosition(e) {
    if (this._MoveData) {
      var posX = e.clientX || (e.touches ? e.touches[0].clientX : 0),posY = e.clientY  || (e.touches ? e.touches[0].clientY : 0),aX = posX - this._MoveData.diffX,aY = posY - this._MoveData.diffY;
      var diffW = this._MoveData.cWi - this._MoveData.eWi, diffH = this._MoveData.cHe - this._MoveData.eHe;
      if (aX < 0) aX = 0;
      if (aY < 0) aY = 0;
      if (aX > diffW) { aX = diffW; }
      if (aY > diffH) { aY = diffH; }
      this.move(aX,aY); 
    }
  }
  _CloseBtn() { this._customEvent('closeEvent',{ detail: { target: this } }); }
  _StartMove(e) {
    if (!this._Maximized) {
      var posX = e.clientX || e.touches[0].clientX, posY = e.clientY || e.touches[0].clientY, divTop = this.style.top.replace('px',''), divLeft = this.style.left.replace('px','');
      this._MoveData = { eWi: parseInt(this.style.width) || this.offsetWidth, eHe: parseInt(this.style.height) || this.offsetHeight, cWi: parseInt(document.body.offsetWidth), cHe: parseInt(document.body.offsetHeight), diffX: posX - divLeft, diffY: posY - divTop }; 
    }
  }
  _StopMove(e) { this._MoveData = null; }
  
  // Private Functions
}
customElements.define('q-dialog', QDialog);

/*===============================================================================
Qt Style Mdi Subwindow Constructor
===============================================================================*/

class QMdiSubWindow extends QMainWindow {
  constructor(parent,flags) {
    flags = (flags || Qt.Window | Qt.SubWindow | Qt.WindowTitleHint | Qt.WindowMinMaxButtonsHint | Qt.WindowCloseButtonHint);
    super(parent,flags);

    // Private Properties
	  this._Base.push("QMdiSubWindow");
    this.classList.add("QMdiSubWindow");
    this._Title.innerHTML = "QMdiSubWindow base test example";

    //Signals
    /*==== Emitted Signals ====================================
    aboutToActivate()
    TODO: windowStateChanged(oldState,newState)
    =========================================================*/
    
    //Listen to Signals
    this.addEventListener('aboutToActivate',this);

    //Setup Event Listeners
    this.addEventListener('pointerdown',(e) => {
      if (this._Parent && this._Parent != document.body && this._Parent._Base.includes('QMdiArea')) {
        if (this != this._Parent.lastElementChild) { 
          this._customEvent('aboutToActivate'); 
          this._customEvent('subWindowActivated',{ bubbles: true, detail: { target: this } }); 
          this.parentNode.appendChild(this);
        }
      }
    });  
    this.addEventListener('pointermove',(e) => { this._MoveSubWindowPosition(e); });
    this.addEventListener('pointerleave',(e) => { this._StopMove(e); });

    this._Handle.addEventListener('pointerdown',(e) => { this._StartMove(e); });
    this._Handle.addEventListener('pointerup',(e) => { this._StopMove(e); });
    this._Handle.addEventListener('dblclick',(e) => { this._MaximizeBtn(e); });
    this._Minimize.addEventListener('click',(e) => { this._MinimizeBtn(e); });
    this._Maximize.addEventListener('click',(e) => { this._MaximizeBtn(e); });
    this._Close.addEventListener('click',(e) => { this._CloseBtn(); });
  }
  connectedCallback() { super.connectedCallback(); } 
  disconnectedCallback() { super.disconnectedCallback(); }
  
  //Default Event Handler
  handleEvent(e) { super.handleEvent(e); }

  // Private Functions
  _MoveSubWindowPosition(e) {
    if (this._MoveData) {
      var posX = e.clientX || (e.touches ? e.touches[0].clientX : 0),posY = e.clientY  || (e.touches ? e.touches[0].clientY : 0),aX = posX - this._MoveData.diffX,aY = posY - this._MoveData.diffY;
      if (aX < 0) aX = 0;
      if (aY < 0) aY = 0;
      this.move(aX,aY); 
    }
  }
  _MinimizeBtn() { 
    this._customEvent('childEvent',{ bubbles: true, detail: { target: this, 'QEvent': QEvent.WindowStateChange, state: Qt.WindowMinimized } });
    this.style.display = 'none';
  }
  _MaximizeBtn(e) { this._customEvent('childEvent',{ bubbles: true, detail: { target: this, 'QEvent': QEvent.WindowStateChange, state: (!this.style.width && !this.style.height ? Qt.WindowNoState : Qt.WindowMaximized) } }); }
  _CloseBtn() { this._customEvent('closeEvent',{ detail: { target: this } }); }
  _StartMove(e) {
    if (this.style.width && this.style.height) {
      var posX = e.clientX || e.touches[0].clientX, posY = e.clientY || e.touches[0].clientY, divTop = this.style.top.replace('px',''), divLeft = this.style.left.replace('px','');
      this._MoveData = { eWi: parseInt(this.style.width) || this.offsetWidth, eHe: parseInt(this.style.height) || this.offsetHeight, cWi: parseInt(document.body.offsetWidth), cHe: parseInt(document.body.offsetHeight), diffX: posX - divLeft, diffY: posY - divTop }; 
    }
  }
  _StopMove(e) { this._MoveData = null; }
  
  //Public Functions
  //isShaded() { }
  mdiArea() { return this._Parent; }
  setWidget(widget) { super.setCentralWidget(widget) }
}
customElements.define('q-mdisubwindow', QMdiSubWindow);
