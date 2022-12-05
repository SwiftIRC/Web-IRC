/*
TODO LIST:
QCalendarWidget
QCheckBox?
QColorDialog
QComboBox?
QDateEdit
QDateTimeEdit
QDial
QDoubleSpinBox
QGroupBox
QLabel?
QLineEdit?
QProgressBar 
QPushButton?
QRadioButton?
QSlider?
QTabBar
QTextEdit?
QTimeEdit
*/
/*===============================================================================
Qt Style enum Flags
===============================================================================*/
var Qt = {
  //1x1 Transparent PNG Blob to be used with <img> tags not assigned a src.
  Pin: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABSElEQVQ4T2NkoBAwkqBfCaj2Hrp6Yg2YZsXHGnPs029boAEXkQ0hxgClUhnuu4Uy3Azptz9+2fz2pw2yIcQYELFAm2W5N58Aw5//TAxpaIbgMsDGTZCt5/Gvfz+zZf/auQkzMDADId8/AYbfQEOQXYLNgAigk5fnS3Mz/GH4x/CX5QPDXyAEgWMfmBnefedimP3y26HrX/8EAYXeYjNA31eY/ch0FX4eHmZGoI1/GT4xfWDY/vYvQ86N/9OBmpYB8RFYQOLygn60iuSFidKsDCy/fzJ8+PuXwfnS+0d3v/+VJyoaNTU1FzU1NcVuqMxj6BT+ywBySezND6AY4CVoAExzaWnppQcPHmQDvbNdg5OFp/vJ10ig5hWEDGhdvXp1FVSzEyiQgFgfiDWxaQYZhh4Graqqqrq3b99OhGommNKJSUh4DRl4AwAkSoERsE4D5gAAAABJRU5ErkJggg==",
  TransparentPNG: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAALHRFWHRDcmVhdGlvbiBUaW1lAFR1ZSAyMyBOb3YgMjAyMSAwMjowNzowOSAtMDUwMPDEJCEAAAAHdElNRQflCxcHCAtqBzujAAAACXBIWXMAAB7CAAAewgFu0HU+AAAABGdBTUEAALGPC/xhBQAAAAtJREFUeNpjYAACAAAFAAHp+tzYAAAAAElFTkSuQmCC",
  BlackDock: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAZklEQVQ4T2NkoBAwUqifYQQYYAMMo2dAfA9XWBEKgx1QzVnkGACy/TBUozIuV+BzAch2d6gB04E0VlfgMgDZdpjrsboClwHItsMMwOoKbAZEAHUsxxFotkDxI8hyhGKBYEofBgYAAJo2DhHPY845AAAAAElFTkSuQmCC",
  WhiteDock: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAcUlEQVQ4T2NkoBAwUqifYbgb8P///zxgGJ1nZGQ8jCus8IYB0IBbQI1vgQZYkmwA1PaJUI12uFyB0wVQ21WhBpzA5QqsBqDZDnM9VlfgMgDkd5jtMAOwugLDAKDtk4E6cnAEWj7QK5OQ5YZ7SiQmpwIAQlEjEepMPNYAAAAASUVORK5CYII=",
  BlackUnDock: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAaUlEQVQ4T2NkoBAwUqifYZgaEAEMl+U4wsYWKH4EWQ5XGNwBKlJGM2QnkO+BbjAuA7C5AsN2kGH4YgHZFVhtJ2QAsiuw2k7IAJA8yBUgjOF3WFgQSkggVzxBD3liYoHoFE7IBQQNGngDAKAGDhG8dIjjAAAAAElFTkSuQmCC",
  WhiteUnDock: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAbUlEQVQ4T2NkoBAwUqifYTga8P///8nAcMnBETb5jIyMk5DlsIYB0JA3QEXCaIbcBmpWQzcYlwHYXIFhO8gwnLGA5gqsthMyANkVWG3HawBIEuqKd9j8DgsLvAkJGiMg56OEPMFYICV5D4OkDABIFSMRL7y75wAAAABJRU5ErkJggg==",
  BlackMinimise: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAQElEQVQ4T2NkoBAwUqifYdQAhtEwACYimqWDMqDhnWiptBzI70JPubhcoARUKIWm+BmQf49YA4jOIjQLA6JdAAAZRAQR8PbkJwAAAABJRU5ErkJggg==",
  WhiteMinimize: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAR0lEQVQ4T2NkoBAwUqifYdQAhtEwACYi2qSD////bwQa7oeWSjcxMjL6o6dcrC4AGmALVGiIpvg80IDDRBlASv6gTRiQ4gIAdd4KEdn4j7wAAAAASUVORK5CYII=",
  BlackMaximize: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAT0lEQVQ4T2NkoBAwUqifYZga0AoMF2McYXMWKF6NLIctDHYAFezDYYATUNyDGANQFCFpABk+UgygKBD1gQHFiyMWPgPFLxKKBZKyx8DnBQBlXBARxGMRyAAAAABJRU5ErkJggg==",
  WhiteMaximize: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAVklEQVQ4T2NkoBAwUqifYTga8P///z3AcJHDETaPGBkZXZDlMMIAaMAtoILrOAzQBBqgRtAAdEUwDSDDR4oBlAZiONAAcRyx8BIYiCvxxgKpeWPg8wIAOZM0EbzxIzIAAAAASUVORK5CYII=",
  BlackRestore: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAdklEQVQ4T2NkoBAwUqifYZgbsANL+JwFilUji+MLgztAhbPQDHEC8j0IGaAPVMALxP1AXIik+AiQDXIVQQNAityxOB/kWqINQLEFqhFkJlFhgGELNpthLsQWiCAD9qF5IQ3IV8GWarEZAAtEdPWgQMQAwyApAwBKURERmKzpGQAAAABJRU5ErkJggg==",
  WhiteRestore: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAgklEQVQ4T2NkoBAwUqifYTgb8P///1tYwucRIyOjC7I4zjAAGvAGqPAomiGaQAPU8BoA1BgOVCAOxKVA3A1TDNQ4CeQqYgwAOV0V3flAjYxEG4BuC1J4EA4DbLZgE4N7Dd2pUNuuo4lbA10lgi3VYsQCUiCiqAcFIlEGkJo3Bj4vAAAcSDURA8pCDgAAAABJRU5ErkJggg==",
  BlackClose: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAjUlEQVQ4T2NkoBAwUqifYXAaIAz0liYQH0Hznj6Q/wSI3yKLY/MCSOEFIJ4OxFlQxRFAejkQGwDxRUIGgORhGkCGHIJqjgTSK9ADHV8gwgwB6cGqGSRBrAHI3kFxBC4DYLaDbAYBkP+xGoIvEJGdDTPQFj12sBkAikYZ9NAG8omORvSAxssfnEmZJC8AAMyuGREFDduvAAAAAElFTkSuQmCC",
  WhiteClose: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAkElEQVQ4T2NkoBAwUqifYRAa8P//f3mgt/wZGRknIXsPKB4O5J8Aij9EFsfwAlThCqhiS5BioNhkIJUDxBFAA1biNQBNwwkg/wxU8xSg5lz0QMcZiEi2gvRg1QySINYAkN/B3iHKBUi2T4FqAPkfqyH4AhHubCQD89FjB5sBoGi0QA9toqOR1KQ9CJMyqV4AAL1UPRFjX4vfAAAAAElFTkSuQmCC",

  DockWidgetArea: {
    LeftDockWidgetArea: 1,
    RightDockWidgetArea: 2,
    TopDockWidgetArea: 4,
    BottomDockWidgetArea: 8,
    AllDockWidgetAreas: 15,
    NoDockWidgetArea: 0,  
  },
  DockWidgetFeature: {
    DockWidgetClosable: 1,
    DockWidgetMovable: 2,
    DockWidgetFloatable: 4,
    AllowTabs: 8,
    NoDockWidgetFeatures: 0,
  },
  FindChildOption: {
    FindDirectChildrenOnly: 0,
    FindDirectChildrenRecursively: 1,
  },
  Orientation: {
    Horizontal: 0,
    Vertical: 1,
  },
  QEvent: {
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
    WindowTitleChange: 33,
  },
  TabPosition: {
    North: 0,
    South: 1,
    West: 2,
    East: 3,
  },
  ToolBarArea: {
    LeftToolBarArea: 1,
    RightToolBarArea: 2,
    TopToolBarArea: 4,
    BottomToolBarArea: 8,
    AllToolBarAreas: 15,
    NoToolBarArea: 0,
  },
  WindowState: {
    WindowNoState: 0,
    WindowMinimized: 1,
    WindowMaximized: 2,
    WindowFullScreen: 4,
    WindowActive: 8,
  },
  WindowType: {
    Widget: 0,
    Window: 1,
    Dialog: 3,
    Popup: 9,
    Tool: 10,
    SubWindow: 18,
    WindowTitleHint: 4096,
    WindowMinimizeButtonHint: 16384,
    WindowMaximizeButtonHint: 32768,
    WindowMinMaxButtonsHint: 49152,
    WindowCloseButtonHint: 134217728,
    WindowStaysOnTopHint: 262144,
    WindowType_Mask: 255,
  },
}

function QuickElement(name,attr,text,parent) {
  var tmp = document.createElement(name) //Object.assign(,{textContent: text});
  for (var key in attr) { tmp.setAttribute(key,attr[key]); }
  if (text && text != '') { tmp.innerHTML = text; }
  if (parent instanceof HTMLElement) { parent.appendChild(tmp); }
  return tmp;
}

//------------------------------------ BASE Class ------------------------------------

/*===============================================================================
Qt Style QObject Class
===============================================================================*/

class QObject extends HTMLElement {
  //static get observedAttributes() { return []; } //Array of Element Attribute Names
  constructor(parent) {
    super();
    // Private Properties
	  this._MetaObject = ["QObject"];    
    this._BlockSignals = false;
	  this._Signals = {};
	  this._Timers = [];
    this._ParentForDisconnectedCallback = (parent != document.body ? parent : null);

    // For CSS styling later
    this.classList.add("QObject");
    //this.setAttribute("style","display: flex;");

    //Listen to Signals
    this.addEventListener('childEvent',this);

    //insert into DOM (delay so all extensions get to execute modifiers)
    if (parent) { this.setParent(parent); }
  }
  connectedCallback() { 
    var Parent = this.parent(); 
    if (Parent) {
      this._ParentForDisconnectedCallback = Parent;
      if (Parent.hasOwnProperty('_MetaObject') && Parent._MetaObject.includes('QObject')) {
        if (this.inherits('QAction')) { Parent._customEvent('childEvent',{ bubbles: false, detail: { target: this, 'QEvent': Qt.QEvent.ActionAdded } }); }
        else { Parent._customEvent('childEvent',{ bubbles: false, detail: { target: this, 'QEvent': Qt.QEvent.ChildAdded } }); }
      }
    } 
  } //Inserted into DOM
  disconnectedCallback() { 
    var Parent = this.parent(); 
    if (Parent && Parent.hasOwnProperty('_MetaObject') && Parent._MetaObject.includes('QObject')) { 
      if (this.inherits('QAction')) { Parent._customEvent('childEvent',{ bubbles: false, detail: { target: this, 'QEvent': Qt.QEvent.ActionRemoved } }); }
      else { Parent._customEvent('childEvent',{ bubbles: false, detail: { target: this, 'QEvent': Qt.QEvent.ChildRemoved } }); }
    }
    this._ParentForDisconnectedCallback = null;
  } //Removed from DOM
  //adoptedCallback() { var Parent = this.parent(); if (Parent) { Parent._customEvent('childEvent',{ bubbles: false, detail: { target: this, 'QEvent': Qt.QEvent.ParentChange } }); } } //Moved into iframe DOM
  //attributeChangedCallback(name,oldValue,newValue) { } //Element attributes changed
    
  //Default Event Handler Callback function
  handleEvent(e) { 
	  if (!this._BlockSignals) {
	    //Look for callbacks and execute them.
	    if (this._Signals[e.type]) { this._Signals[e.type].forEach(function(func) {
        //console.log("* CB: " + this.metaObject() + ":" + e.type + ":" + typeof func.Call + ":" + func.Args);
        if (typeof func.Call != 'undefined') { func.Call.apply(func.Bind,(func.Args ? func.Args.push(e) : [e])); }
        else { console.log("Error! " + this.metaObject() + " Signal: " + e.type + " Function callback doesn't exist!") }
        e.stopPropagation(); },this); 
      }
    }
    if (e.type == 'childEvent') { 
      //e.stopPropagation(); //Stop bubbling if we reach the root QObject
      //console.log("MetaObject: " + e.detail.target.metaObject() + " QEvent: " + e.detail.QEvent + " Bubbles? " + e.bubbles + " Reciever TagName: " + this.tagName); 
    }
  }
  
  //Private Functions
  _customEvent(type,modifiers) { this.dispatchEvent(new CustomEvent(type,modifiers || {})); }

  //Public Functions
  blockSignals(bool) { this._BlockSignals = bool; return this; }
  Children() { //can't match Qt's lowercase children() because of it existing already on a node....
    if (this.hasOwnProperty('_CentralWidget')) { return Array.from(this._CentralWidget.childNodes); }
    else { return Array.from(this.childNodes); }
  }
  connect(signal,reciever,slot,args) { if (!this._Signals[signal]) { this._Signals[signal] = []; } this._Signals[signal].push({Bind: reciever, Call: slot, Args: args }); return this; }
  disconnect(signal,reciever,slot) { var Cbs = this._Signals[signal] , i = Cbs.length; while (i--) { var CB = Cbs[i]; if (CB.Bind == reciever && CB.Call == slot) { Cbs.splice(i,1); } } return this; }
  dumpObjectInfo() { console.log(this); return this; }
  findChild(name,options,recursive) {}
  findChildren(name,options,recursive) {}
  inherits(type) { return this._MetaObject.includes(type); }
  isWidgetType() { return this._MetaObject.includes('QWidget'); }
  isWindowType() { return !this._MetaObject.includes('QWidget'); }
  killTimer(id) { return this; }
  metaObject() { return this._MetaObject[this._MetaObject.length - 1]; }
  objectName() { return this.getAttribute('ObjectName'); }
  parent() { 
    if (this._ParentForDisconnectedCallback && this._ParentForDisconnectedCallback instanceof HTMLElement) { return this._ParentForDisconnectedCallback; }
    else {
      var findOwner = this, found = false;
      while (findOwner.parentNode && findOwner.parentNode instanceof HTMLElement) {
        if (findOwner.parentNode.hasOwnProperty('_MetaObject') && findOwner.parentNode.inherits('QObject')) { found = true; break; }
        findOwner = findOwner.parentNode;
      }
      if (found) { return findOwner.parentNode; }
    }
  }
  property(name) { return this.getAttribute(name); }
  setObjectName(text) { this.setAttribute('ObjectName',text); this._customEvent('objectNameChanged',{ bubbles: false, detail: { objectName: text } }); return this; }
  setParent(parent,before) {
    if (parent.hasOwnProperty('_MetaObject')) { 
      if (before instanceof HTMLElement) { 
        if (parent.hasOwnProperty('_CentralWidget')) { parent._CentralWidget.insertBefore(this,before); }
        else { parent.insertBefore(this,before); }
      }
      else {
        if (parent.hasOwnProperty('_CentralWidget')) { parent._CentralWidget.appendChild(this); }
        else { parent.appendChild(this); }
      }
    }
    else { //Fallback 
      if (this.metaObject() == 'QMainWindow') {
        window.addEventListener('keydown',this.handleEvent.bind(this));
        window.addEventListener('keyup',this.handleEvent.bind(this));
        console.log("Registering keyboard hooks");
      }
      if (before instanceof HTMLElement) { 
        if (parent.hasOwnProperty('_CentralWidget')) { parent._CentralWidget.insertBefore(this,before); }
        else { parent.insertBefore(this,before); }
      }
      else { parent.appendChild(this); }
      //console.log("Object " + this.metaObject() + " inserted into NON-QObject!");
    } 
    return this;
  }
  setProperty(name,value) { this.setAttribute(name,value); return this; }
  signalsBlocked() { return this._BlockSignals; }
  startTimer() { return this; }

  //Signals (For reference, these would be emitted custom events)
  //destroyed()
  //objectNameChanged()

  //Public Slots
  //deleteLater() {} //What do we do with this?
}
customElements.define('q-object', QObject);

//------------------------------------ NON Widget Classes ------------------------------------

/*===============================================================================
Qt Style QAction Class
===============================================================================*/

class QAction extends QObject {
  constructor(icon,text,parent) {
    super(parent);
    
    //Private Properties
	  this._MetaObject.push("QAction");
    this.classList.add("QAction");

    //Build UI Components
    this.setAttribute("style","position: relative;");
    this._CheckText = QuickElement('span',{class: "CheckText"},"",this);
	  this._Icon = QuickElement('img',{src: icon || Qt.TransparentPNG,draggable: "false",class: "Icon"},'',this);
	  this._IconText = QuickElement('span',{class: "Text", style: "white-space: nowrap"},text,this);
	  this._CentralWidget = QuickElement('div',{class: "CentralWidget", style: 'resize: none'},'',this);

	  //firefox fails to use draggable=false .... force it in the drag event...
	  this._Icon.addEventListener('dragstart',(e) => { e.preventDefault(); });
 
    //Listen to Signals
    //TODO: this.addEventListener('changed',this);
    this.addEventListener('hovered',this);
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
  //connectedCallback() { super.connectedCallback(); }
  //disconnectedCallback() { super.disconnectedCallback(); }

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
    var Parent = this.parent() || this._ParentForDisconnectedCallback;
    if (bool) { 
      if (Parent && (Parent.classList.contains('QMenu') || Parent.classList.contains('QMenuBar'))) { this._CheckText.innerHTML = "&#128504;"; }
      this.classList.add('checked'); 
    }
    else { 
      if (Parent && (Parent.classList.contains('QMenu') || Parent.classList.contains('QMenuBar'))) { this._CheckText.innerHTML = ""; }
      this.classList.remove('checked'); 
    }
    return this;
  }
  setDisabled(bool) { }
  setEnabled(bool) { }
  setVisible(bool) { 
    if (bool) { this.style.display = null; }
    else { this.style.display = 'none'; }
    return this;
  }
  toggle() { this.setChecked((this.isChecked() ? false : true)); this._customEvent('toggled',{ bubbles: false, detail: { checked: this.isChecked() } }); }
  trigger() { this._customEvent('triggered',{ bubbles: false, detail: { checked: false } }); }
}
customElements.define('q-action', QAction);

/*===============================================================================
Qt Style Mdi Area Constructor
===============================================================================*/

class QMdiArea extends QObject {
  constructor(parent) {
    super(parent);

    // Private Properties
	  this._MetaObject.push("QMdiArea");
    this.classList.add("QMdiArea");
    this._CascadeData = [0,0,0];
    this._CurrentWindowState = 0;

    /*==== Catched Signals ====================================
    subWindowActivated(window) 
    =========================================================*/

    //Listen to signals
	  this.addEventListener('subWindowActivated',this);	

    //Setup Event Listeners
    this.addEventListener('pointermove',(e) => { if (this.lastElementChild && this.lastElementChild.hasOwnProperty('_MetaObject') && this.lastElementChild._MetaObject.includes('QMdiSubWindow')) { this.lastElementChild._MoveWindowPosition(e); } });
    this.addEventListener('pointerleave',(e) => { if (this.lastElementChild && this.lastElementChild.hasOwnProperty('_MetaObject') && this.lastElementChild._MetaObject.includes('QMdiSubWindow')) { this.lastElementChild._StopMove(e); } });
  }
  //connectedCallback() { super.connectedCallback(); } 
  //disconnectedCallback() { super.disconnectedCallback(); }
  
  //Default Event Handler
  handleEvent(e) { 
    super.handleEvent(e);
    if (e.type == 'subWindowActivated') {
      if (e.detail.target.style.display == 'none') { e.detail.target.style.display = null; }
      e.stopPropagation();
    }
    if (e.type == 'childEvent') {
      if (e.detail.QEvent == Qt.QEvent.ChildAdded) {
        if (!e.detail.target._BlockReAdd) { this._cascadeNewSubWindow(e.detail.target); }
        e.detail.target._BlockReAdd = false;
        e.detail.target._customEvent('aboutToActivate',{ bubbles: false, detail: { target:  e.detail.target } }); 
        if (this._CurrentWindowState == Qt.WindowState.WindowMaximized) {
          //delay
          setTimeout(() => { e.detail.target._customEvent('childEvent',{ bubbles: false, detail: { target: e.detail.target, QEvent: Qt.QEvent.WindowStateChange, state: this._CurrentWindowState } }); });
        }
      }
      else if (e.detail.QEvent == Qt.QEvent.ChildRemoved) {
        if (e.detail.target.hasOwnProperty('_MetaObject') && e.detail.target._MetaObject.includes('QMdiSubWindow')) { e.detail.target._BlockReAdd = true; }
        if (this.activeSubWindow() instanceof HTMLElement) { this.setActiveSubWindow(this.activeSubWindow(),true); }
        else {
          this._CascadeData = [0,0,0];
          this._CurrentWindowState = 0;      
        }
      }
      else if (e.detail.QEvent == Qt.QEvent.WindowStateChange) {
        if (e.detail.state == Qt.WindowState.WindowMaximized) { this._setSubWindowsMaximized(true); }
        else if (e.detail.state == Qt.WindowState.WindowNoState) { this._setSubWindowsMaximized(false); }
        else if (e.detail.state == Qt.WindowState.WindowMinimized) { this.activatePreviousSubWindow(); }
      }
      e.stopPropagation();
    }
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
        var w = parseInt(window.style.width || parseInt(this.offsetWidth / 2)) , xw = newx + w , h = parseInt(window.style.height || parseInt(this.offsetHeight / 2)) , yh = newy + h;
        if ((isNaN(w) || isNaN(h)) || (w > this.offsetWidth || h > this.offsetHeight)) { break; }
        if (xw < this.offsetWidth && yh < this.offsetHeight) {
          window.style.left = newx + "px";
          window.style.top = newy + "px";
          window.style.width = w + "px";
          window.style.height = h + "px";
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
    this._CurrentWindowState = (bool ? Qt.WindowState.WindowMaximized : Qt.WindowState.WindowNoState);
    for (var i = 0; i < this.childNodes.length; i++) {
      var node = this.childNodes[i];
      if (node.hasOwnProperty('_MetaObject') && node._MetaObject.includes('QMdiSubWindow')) {
        node._customEvent('childEvent',{ bubbles: false, detail: { target: node, QEvent: Qt.QEvent.WindowStateChange, state: this._CurrentWindowState } });
      } 
    }
  }
  
  //Public Functions
  activeSubWindow() { return this.lastElementChild; }
  addSubWindow(Window) { Window.setParent(this); }
  removeSubWindow(Window) { 
    if (this.parentNode instanceof HTMLElement) { this.parentNode.removeChild(this); }
    if (this.lastElementChild) { this.setActiveSubWindow(this.lastElementChild); }
  }

  //Public Slots 
  //TODO: follow activation order instead of insertion order
  activateNextSubWindow() {
    if (this.lastElementChild) {
      var index = this.Children().indexOf(this.lastElementChild) + 1;
      if (index == this.Children().length) { index = 0; }
      this.setActiveSubWindow(this.Children()[index]);    
    }
  }
  //TODO: follow activation order instead of insertion order
  activatePreviousSubWindow() {
    if (this.lastElementChild) {
      var index = this.Children().indexOf(this.lastElementChild) - 1;
      if (index < 0) { index = this.Children().length - 1; }
      this.setActiveSubWindow(this.Children()[index]);
    }
  }
  cascadeSubWindows() { }
  closeActiveSubWindow() { if (this.lastElementChild) { this.lastElementChild._customEvent('childEvent',{ bubbles: false, detail: { target: this.lastElementChild, 'QEvent': Qt.QEvent.Close } }); } }
  closeAllSubWindows() { this.Children().forEach((child) => { child._customEvent('childEvent',{ bubbles: false, detail: { target: child, 'QEvent': Qt.QEvent.Close } }); }); }
  setActiveSubWindow(Window,blockSetParent) { 
    if (!blockSetParent) { Window.setParent(this); }
    else { Window._customEvent('aboutToActivate',{ bubbles: false, detail: { target: Window } }); }
    this._customEvent('subWindowActivated',{ bubbles: false, detail: { target: Window } }); 
  }
  tileSubWindows() { }
}
customElements.define('q-mdiarea', QMdiArea);

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
	  this._MetaObject.push("QMenu");
    this.classList.add("QMenu");
    this.setAttribute("style","position: relative;");

	  //Build UI Components   
    this._Icon = QuickElement('img',{src: Qt.TransparentPNG, class: "Icon"});
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
  //connectedCallback() { super.connectedCallback(); }
  //disconnectedCallback() { super.disconnectedCallback(); }

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
  removeMenu(Menu) { if (this.parentNode instanceof HTMLElement) { this.parentNode.removeChild(this); } }
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
Qt Style MenuBar Constructor 
===============================================================================*/
/*NOTE: Qt has this inherit QWidget, but we won't ever float it, doesn't need 
window controls (icon,title,min/max/close) so I'm inheriting QObject */

class QMenuBar extends QObject {
  constructor(parent) {
    // Always call super first in constructor
    super(parent);

	  //Private Properties
	  this._MetaObject.push("QMenuBar");
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
  //connectedCallback() { super.connectedCallback(); }
  //disconnectedCallback() { super.disconnectedCallback(); }

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
Qt Style Statusbar Constructor
===============================================================================*/
/*NOTE: Qt has this inherit QWidget, but we won't ever float it, doesn't need 
window controls (icon,title,min/max/close) so I'm inheriting QObject */

class QStatusBar extends QObject {
  constructor(parent) {
    super(parent);

	  //Private Properties
	  this._MetaObject.push("QStatusBar");
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
  //connectedCallback() { super.connectedCallback(); }
  //disconnectedCallback() { super.disconnectedCallback(); }
  
  //Default Event Handler
  handleEvent(e) { super.handleEvent(e); }

  //Public Functions
  addWidget(Widget,stretch) { this.appendChild(Widget); }
  insertWidget(Before,Widget,stretch) { this.insertBefore(Widget,Before); }
  removeWidget(Widget) { if (this.parentNode instanceof HTMLElement) { this.parentNode.removeChild(this); } }

  //Public Slots
}
customElements.define('q-statusbar', QStatusBar);

/*===============================================================================
Qt Style Tab Widget Constructor
===============================================================================*/

class QTabWidget extends QObject {
  constructor() {
    super(parent);

	  //Private Properties
	  this._MetaObject.push("QTabWidget");
    this.classList.add("QTabWidget");
    this.style.userSelect = 'none';

    //Build UI Components
    //this._Handle = QuickElement('div',{class: "ToolBarHandle"});
    //this.appendChild(this._Handle);

    this._Containers = [QuickElement('div',{style:"display: flex; flex-direction: row; flex: 1; overflow: hidden;"}),QuickElement('div',{style:"display: flex; flex-direction: column; flex: 1; overflow: hidden;"})];
    this._TabBarAreas = { top: QuickElement('div',{class:"QTabBarArea-Horizontal","data-position":"top"}), left: QuickElement('div',{class:"QTabBarArea-Vertical","data-position":"left"}), bottom: QuickElement('div',{class:"QTabBarArea-Horizontal","data-position":"bottom"}), right: QuickElement('div',{class:"QTabBarArea-Vertical","data-position":"right"}) };
    this._CentralWidget = QuickElement('div',{class: "CentralWidget", style: "display: flex; flex: auto; flex-direction: column; flex-wrap: nowrap; overflow: hidden;"},);

    this.appendChild(this._Containers[0]);
    this._Containers[0].appendChild(this._TabBarAreas['left']);
    this._Containers[0].appendChild(this._Containers[1]);
    this._Containers[1].appendChild(this._TabBarAreas['top']);
    this._Containers[1].appendChild(this._CentralWidget);
    this._Containers[1].appendChild(this._TabBarAreas['bottom']);
    this._Containers[0].appendChild(this._TabBarAreas['right']);	

    /*==== Emitted Signals ====================================
    TODO: currentChanged()
    TODO: tabBarClicked()
    TODO: tabBarDoubleClicked()
    TODO: tabCloseRequested()
    TODO: tabInserted()
    TODO: tabRemoved()
    ====== Catched Signals ====================================
    =========================================================*/  

    //Listen to Signals
    this.addEventListener('currentChanged',this);
    this.addEventListener('tabBarClicked',this);
    this.addEventListener('tabBarDoubleClicked',this);
    this.addEventListener('tabCloseRequested',this);
    this.addEventListener('tabInserted',this);
    this.addEventListener('tabRemoved',this);

    //Setup Event Listeners
  }
  //connectedCallback() { super.connectedCallback(); }
  //disconnectedCallback() { super.disconnectedCallback(); }
  
  //Default Event Handler
  handleEvent(e) { 
    super.handleEvent(e); 
    if (e.type == 'currentChanged') { }
    else if (e.type == 'tabBarClicked') { }
    else if (e.type == 'tabBarDoubleClicked') { }
    else if (e.type == 'tabCloseRequested') { }
    else if (e.type == 'tabInserted') { }
    else if (e.type == 'tabRemoved') { }
  }

  //Private Functions

  //Public Functions
  addTab(page,icon,label) {
    if (label && label != '') { icon.setIconText(label); }
    icon.connect('triggered',this,() => { 
      this.setCurrentIndex(Array.from(this._TabBarAreas[page].childNodes).indexOf(icon),icon);
    })
    this._TabBarAreas[page].appendChild(icon); 
  }
  clear() { }
  count() { }
  currentIndex() { }
  currentWidget() { }
  documentMode() { } //bool
  insertTab(index,page,icon,label) { }
  isMovable() { }
  movable() { } //bool
  removeTab() { }
  setCurrentIndex(index,tab) { 
    Array.from(this._CentralWidget.childNodes).forEach((child,N) => {
      if (N != index) { child.style.display = 'none'; }
      else { child.style.display = ''; }
    })
    this.parent().setWindowTitle(tab.iconText())
  }
  setDocumentMode() { }
  setMovable() { }
  setTabIcon() { }
  setTabPosition() { }
  setTabText() { }
  setTabToolTip() { }
  setTabsClosable() { }
  tabText() { }
  tabToolTip() { }
  tabsClosable() { } //bool
  widget() { }

  //Public Slots
}
customElements.define('q-tabwidget', QTabWidget);

/*===============================================================================
Qt Style Widget Constructor
===============================================================================*/

class QWidget extends QObject {
  constructor(parent,flags) {
    // Always call super first in constructor
    super(parent);

	  // Private Properties
	  this._MetaObject.push("QWidget");
    this.classList.add("QWidget");

    this._AcceptDrops = false;
    this._Maximized = false;
    this._Minimized = false;
    this._MoveData = null;

	  //Build UI Components
    this._Handle = QuickElement('div',{class: "WindowTitleBar", style: "user-select: none; border-spacing: 0; margin: 0; padding: 2px; flex-wrap: nowrap; white-space: nowrap;"},'',this);
    //TODO: Move icon to QAction so we can do menu stuffs

    this._Icon = new QAction('favicon.ico','',this._Handle).setMenu();
    new QAction('','Restore',this._Icon);
    new QAction('','Minimize',this._Icon).connect('triggered',this,(e) => { this._MinimizeBtn(e) });
    new QAction('','Maximize',this._Icon).connect('triggered',this,(e) => { this._MaximizeBtn(e) });;
    new QAction('','',this._Icon).setSeparator();
    new QAction('','Close',this._Icon).connect('triggered',this,(e) => { this._CloseBtn(e) });;

    //QuickElement('img',{class: "WindowIcon", src: "favicon.ico",style: "max-width: 16px; max-height: 16px;",draggable: "false"},'',this._Handle);
    this._Title = QuickElement('span',{class: "WindowTitle",style: "margin: 0 4px 0 4px; flex: auto; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;"},'',this._Handle);
    this._ClipControls = QuickElement('span',{class: "WindowClipControls", style: "max-width: 48px;"},'',this._Handle);

    //TODO: use img with Blob
    //this._Minimize = QuickElement('span',{style: "width:32px;height:32px;", class: "Minimize"},"&#128469;&#xFE0E;",this._ClipControls);
    //this._Maximize = QuickElement('span',{style: "width:32px;height:32px;", class: "Maximize"},"&#128470;&#xFE0E;",this._ClipControls);
    //this._Close = QuickElement('span',{style: "width:32px;height:32px;", class: "Close"},"&#128473;&#xFE0E;",this._ClipControls);
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      // dark mode
      this._Minimize = QuickElement('img',{style: "width:16px;height:16px;", class: "Minimize", src: Qt.WhiteMinimize },'',this._ClipControls);
      this._Maximize = QuickElement('img',{style: "width:16px;height:16px;", class: "Maximize", src: Qt.WhiteMaximize },'',this._ClipControls);
      this._Close = QuickElement('img',{style: "width:16px;height:16px;", class: "Close", src: Qt.WhiteClose },'',this._ClipControls);
    }
    else {
      // light mode?
      this._Minimize = QuickElement('img',{style: "width:16px;height:16px;", class: "Minimize", src: Qt.BlackMinimise },'',this._ClipControls);
      this._Maximize = QuickElement('img',{style: "width:16px;height:16px;", class: "Maximize", src: Qt.BlackMaximize },'',this._ClipControls);
      this._Close = QuickElement('img',{style: "width:16px;height:16px;", class: "Close", src: Qt.BlackClose },'',this._ClipControls);
    }

    //Listen to Signals
    this.addEventListener('customContextMenuRequested',this);
    this.addEventListener('windowIconChanged',this);
    this.addEventListener('windowTitleChanged',this);

    //ChildEvent Stuffs! (Might possibly remove... kinda un-necessary)
	  //var Events = ['dragenter','dragleave','dragstart','drop','pointerleave','dblclick','pointerdown','pointerup','pointermove','wheel']
	  //Events.forEach((e) => { this.addEventListener(e,this); },this);

    //Setup Event Listeners
    this.addEventListener('contextmenu',(e) => { this._customEvent('customContextMenuRequested',{ bubbles: false, detail: { event: e } }); });

    this._Observer = new ResizeObserver((e) => { this._customEvent('childEvent',{ bubbles: true, detail: { target: this, jsEvent: e, 'QEvent': Qt.QEvent.Resize } }); }).observe(this);
    this.addEventListener('pointerdown',(e) => { if ((this._WindowFlags & Qt.WindowType.WindowTitleHint) != Qt.WindowType.WindowTitleHint && this.isWindow()) { this._StartMove(e); } });
    this.addEventListener('pointermove',(e) => { this._MoveWindowPosition(e); });
    this.addEventListener('pointerup',(e) => { this._StopMove(e); });
    //this.addEventListener('pointerout',(e) => { if (this.isWindow()) { this._StopMove(e); } });

    this._Handle.addEventListener('pointerover',(e) => { if (!this.isWindow()) { this.setAttribute('draggable',true); } });
    this._Handle.addEventListener('pointerdown',(e) => { if (this.isWindow()) { this._StartMove(e); } });
    this._Handle.addEventListener('pointerout',(e) => { this.setAttribute('draggable',false); });

    this._Handle.addEventListener('dblclick',(e) => { this._MaximizeBtn(e); });
    this._Minimize.addEventListener('click',(e) => { this._MinimizeBtn(e); });
    this._Maximize.addEventListener('click',(e) => { this._MaximizeBtn(e); });  
    this._Close.addEventListener('pointerup',(e) => { this._CloseBtn(e); });

    this.setWindowFlags(flags || 0);
  }
  //connectedCallback() { super.connectedCallback(); }
  //disconnectedCallback() { super.disconnectedCallback(); }

  //Default Event Handler
  handleEvent(e) {
    //Handle emitting custom childEvent for various QEvent types
	  switch (e.type) {
	    case 'dragenter':
        this._customEvent('childEvent',{ bubbles: false, detail: { target: this, jsEvent: e, 'QEvent': Qt.QEvent.DragEnter } });
      break;
      case 'dragleave':
        this._customEvent('childEvent',{ bubbles: false, detail: { target: this, jsEvent: e, 'QEvent': Qt.QEvent.DragLeave } });
      break;
      case 'dragstart':
        this._customEvent('childEvent',{ bubbles: false, detail: { target: this, jsEvent: e, 'QEvent': Qt.QEvent.DragMove } });
      break;
      case 'drop':
        this._customEvent('childEvent',{ bubbles: false, detail: { target: this, jsEvent: e, 'QEvent': Qt.QEvent.Drop } });
      break;
      case 'pointerleave':
        this._customEvent('childEvent',{ bubbles: false, detail: { target: this, jsEvent: e, 'QEvent': Qt.QEvent.Leave } });
      break;
      case 'dblclick':
        this._customEvent('childEvent',{ bubbles: false, detail: { target: this, jsEvent: e, 'QEvent': Qt.QEvent.MouseButtonDblClick } });
      break;
      case 'pointerdown':
        this._customEvent('childEvent',{ bubbles: false, detail: { target: this, jsEvent: e, 'QEvent': Qt.QEvent.MouseButtonPress } });
      break;
      case 'pointerup':
        this._customEvent('childEvent',{ bubbles: false, detail: { target: this, jsEvent: e, 'QEvent': Qt.QEvent.MouseButtonRelease } });
      break;
      case 'pointermove':
        this._customEvent('childEvent',{ bubbles: false, detail: { target: this, jsEvent: e, 'QEvent': Qt.QEvent.MouseMove } });
      break;
      case 'wheel':
        this._customEvent('childEvent',{ bubbles: false, detail: { target: this, jsEvent: e, 'QEvent': Qt.QEvent.Wheel } });
      break;
      case 'childEvent':
        if (e.detail.QEvent == Qt.QEvent.WindowStateChange) {
          if (e.detail.state == Qt.WindowState.WindowMaximized && this._Maximized == false) {
            this._Maximized = true;
            this._Restore = {X: this.style.left, Y: this.style.top, W: this.style.width, H: this.style.height};
            this.style.left = this.style.top = 0;
            this.style.width = this.style.height = null;
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) { this._Maximize.src = Qt.WhiteRestore; }
            else { this._Maximize.src = Qt.BlackRestore; }
            //this._Maximize.innerHTML = "&#128471;&#xFE0E;";

            this.style.resize = 'none';
          }
          else if (e.detail.state == Qt.WindowState.WindowNoState && this._Maximized == true) { 
            this._Maximized = false;
            this.style.left = this._Restore.X;
            this.style.top = this._Restore.Y;
            this.style.width = this._Restore.W;
            this.style.height = this._Restore.H;
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) { this._Maximize.src = Qt.WhiteMaximize; }
            else { this._Maximize.src = Qt.BlackMaximize; }
            //this._Maximize.innerHTML = "&#128470;&#xFE0E;";
            this.style.resize = 'both';
          }
          //else if (e.detail.state == Qt.WindowState.WindowMinimized) { this.activatePreviousSubWindow(); }
        }
      break;
      default:
      break;
    }
    super.handleEvent(e); 
  }

  //Private Functions
  _MinimizeBtn(e) { 
    this._customEvent('childEvent',{ bubbles: true, detail: { target: this, 'QEvent': Qt.QEvent.WindowStateChange, state: Qt.WindowState.WindowMinimized } });
    this.style.display = 'none';
  }
  _MaximizeBtn(e) { this._customEvent('childEvent',{ bubbles: true, detail: { target: this, 'QEvent': Qt.QEvent.WindowStateChange, state: (this._Maximized ? Qt.WindowState.WindowNoState : Qt.WindowState.WindowMaximized) } }); }
  _CloseBtn(e) { this._customEvent('childEvent',{ bubbles: false, detail: { target: this, jsEvent: e, 'QEvent': Qt.QEvent.Close } }); }
  _ApplyWindowFlags() {
    //Are we a window?
    //if ((this._WindowFlags & Qt.WindowType.Window) == Qt.WindowType.Window) {
    this._Handle.style.display = ((this._WindowFlags & Qt.WindowType.WindowTitleHint) == Qt.WindowType.WindowTitleHint ? null : 'none');
    this._Icon.style.display = ((this._WindowFlags & Qt.WindowType.Tool) != Qt.WindowType.Tool ? null : 'none');
    this._Minimize.style.display = ((this._WindowFlags & Qt.WindowType.WindowMinimizeButtonHint) == Qt.WindowType.WindowMinimizeButtonHint ? null : 'none');
    this._Maximize.style.display = ((this._WindowFlags & Qt.WindowType.WindowMaximizeButtonHint) == Qt.WindowType.WindowMaximizeButtonHint ? null : 'none');
    this._Close.style.display = ((this._WindowFlags & Qt.WindowType.WindowCloseButtonHint) == Qt.WindowType.WindowCloseButtonHint ? null : 'none');
    //}
    //we're a widget...
    //else {
      //hide all the controls...
      //this._Handle.style.display = this._Icon.style.display = this._Undock.style.display = this._Minimize.style.display = this._Maximize.style.display = this._Close.style.display = 'none';
      //TODO: store x,y,w,h,minw,minh,maxw,maxh incase we become a window again...
    //}
    this._customEvent('childEvent',{ bubbles: false, detail: { target: this, jsEvent: undefined, 'QEvent': Qt.QEvent.WindowStateChange } });
  }
  _MoveWindowPosition(e) {
    if (this._MoveData) {
      var posX = e.clientX || (e.touches ? e.touches[0].clientX : 0),posY = e.clientY  || (e.touches ? e.touches[0].clientY : 0),aX = posX - this._MoveData.diffX,aY = posY - this._MoveData.diffY;
      if (aX < 0) aX = 0;
      if (aY < 0) aY = 0;
      this.move(aX,aY); 
    }
  }
  _StartMove(e) {
    if (this.style.width && this.style.height) {
      var posX = e.clientX || e.touches[0].clientX, posY = e.clientY || e.touches[0].clientY, divTop = this.style.top.replace('px',''), divLeft = this.style.left.replace('px','');
      this._MoveData = { eWi: parseInt(this.style.width) || this.offsetWidth, eHe: parseInt(this.style.height) || this.offsetHeight, cWi: parseInt(document.body.offsetWidth), cHe: parseInt(document.body.offsetHeight), diffX: posX - divLeft, diffY: posY - divTop }; 
    }
  }
  _StopMove(e) { this._MoveData = null; }

  //Public Functions
  acceptDrops() { }
  actions() { }
  activateWindow() { }
  addAction(action) { action.setParent(this); }
  addActions(actions) { actions.forEach((action) => { action.setParent(this) }); }
  baseSize() { return { width: parseInt(this.style.width), height: parseInt(this.style.height) }; }
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
  isWindow() { return ((this._WindowFlags & Qt.WindowType.Window) == Qt.WindowType.Window); }
  maximumHeight() { return this.style.maxHeight; }
  maximumWidth() { return this.style.maxWidth; }
  minimumHeight() { return this.style.minHeight; }
  minimumWidth() { return this.style.minWidth; }
  move(x,y) { 
    if (!isNaN(x)) { this.style.left = x + "px"; }
    if (!isNaN(y)) { this.style.top = y + "px"; }
  }
  overrideWindowFlags(flags) { }
  pos() { return { x: parseInt(this.style.left), y: parseInt(this.style.top) }; }
  removeAction(action) { if (action.parentNode instanceof HTMLElement) { action.parentNode.removeChild(action); } }
  resize(w,h) { 
    if (!isNaN(w)) { this.style.width = w + "px"; }
    if (!isNaN(h)) { this.style.height = h + "px"; }
    if (this._MetaObject.includes('QMdiSubWindow')) { this.style.resize = 'both'; }
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
  /*setParent(parent,flags,before) {
    super.setParent(parent,before);
    //TODO: remove any flags that shouldn't exist changing parents...
      this._WindowFlags = (flags || this._WindowFlags);
      this._ApplyWindowFlags();
    return this;
  }*/
  setResizable(bool) { this.style.resize = (bool ? "both" : "none"); return this; }
  setToolTip(tip) { this.title = tip; return this; }
  setWindowFlag(flag,bool) {
    if (bool) { this._WindowFlags |= flag; }
    else { this._WindowFlags &= ~flag; }
    this._ApplyWindowFlags();
    return this;
  }
  setWindowFlags(flags) {
    this._WindowFlags = flags; 
    this._ApplyWindowFlags();
    return this; 
  }
  setWindowIcon(icon) { 
    this._Icon.setIcon(icon); 
    this._customEvent('childEvent',{ bubbles: false, detail: { target: this, 'QEvent': Qt.QEvent.WindowIconChange } });
    this._customEvent('windowIconChanged',{ bubbles: false, detail: { 'icon': icon } });
    return this;
  }
  toolTip() { return this.title; }
  width() { return this.style.witdh; }
  window() { }
  windowIcon() { return this._Icon.src; }
  windowTitle() { return this._Title.innerText; }
  x() { return this.style.left; }
  y() { return this.style.top; }
  
  //Public Slots
  close() { }
  hide() { this.setVisible(false); return this; }
  setDisabled(bool) { }
  setEnabled(bool) { }
  setFocus() { }
  setHidden(bool) { 
    if (bool) { this.hide(); } 
    else { this.show(); }
    return this;
  }
  setVisible(bool) { 
    if (bool) { this.style.display = null; }
    else { this.style.display = 'none'; }
    this._customEvent('visibilityChanged',{ bubbles: false, detail: { visible: bool } });
    return this;
  }
  setWindowTitle(title) { 
    this._Title.innerHTML = title; 
    this._customEvent('childEvent',{ bubbles: false, detail: { target: this, 'QEvent': Qt.QEvent.WindowTitleChange } });
    this._customEvent('windowTitleChanged',{ bubbles: false, detail: { 'title': title } });
    return this; 
  }
  show() { this.setVisible(true); return this; }
  showMaximized() { }
  showMinimized() { }
  showNormal() { }  
}
customElements.define('q-widget', QWidget);

//-------------------------------------- Widget Classes --------------------------------------

/*===============================================================================
Qt Style Dock Widget Constructor
===============================================================================*/

class QDockWidget extends QWidget {
  constructor(qstring) {
    var flags = Qt.WindowType.Tool | Qt.WindowType.WindowTitleHint | Qt.WindowType.WindowCloseButtonHint;
    super(null,flags);

	  //Private Properties
	  this._MetaObject.push("QDockWidget");
    this.classList.add("QDockWidget");
    this._AllowedAreas = Qt.DockWidgetArea.AllDockWidgetAreas;
    this._Features = Qt.DockWidgetFeature.DockWidgetClosable | Qt.DockWidgetFeature.DockWidgetMovable | Qt.DockWidgetFeature.DockWidgetFloatable; 

    //Build UI Components
    this.setWindowTitle(qstring);
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      // dark mode
      this._Undock = QuickElement('img',{style: "width:16px;height:16px;", class: "Undock", src: Qt.WhiteUnDock });
    }
    else {
      // light mode?
      this._Undock = QuickElement('img',{style: "width:16px;height:16px;", class: "Undock", src: Qt.BlackUnDock });
    }
    this._UnTab = QuickElement('img',{style: "display:none;width:16px;height:16px;", class: "Untab", src: Qt.Pin });

    //this._Undock = QuickElement('span',{style: "width:32px;height:32px;display:none", class: "Undock"},"&#9660;&#xFE0E;");
    this._ClipControls.insertBefore(this._Undock,this._Minimize);
    //this._UnTab = QuickElement('span',{class:'Untab', style:'display: none'},"📌");
    this._ClipControls.insertBefore(this._UnTab,this._Undock);

    this._Containers = [QuickElement('div',{style:"display: flex; flex-direction: row; flex: 1; overflow: hidden;"}),QuickElement('div',{style:"display: flex; flex-direction: column; flex: 1; overflow: hidden;"})];
    this._TabBarAreas = { top: QuickElement('div',{class:"QTabBarArea-Horizontal","data-position":"top"}), left: QuickElement('div',{class:"QTabBarArea-Vertical","data-position":"left"}), bottom: QuickElement('div',{class:"QTabBarArea-Horizontal","data-position":"bottom"}), right: QuickElement('div',{class:"QTabBarArea-Vertical","data-position":"right"}) };
    this._CentralWidget = QuickElement('div',{class: "CentralWidget", style: "display: flex; flex: auto; flex-direction: column; flex-wrap: nowrap; overflow: hidden;"});

    this.appendChild(this._Containers[0]);
    this._Containers[0].appendChild(this._TabBarAreas['left']);
    this._Containers[0].appendChild(this._Containers[1]);
    this._Containers[1].appendChild(this._TabBarAreas['top']);
    this._Containers[1].appendChild(this._CentralWidget);
    this._Containers[1].appendChild(this._TabBarAreas['bottom']);
    this._Containers[0].appendChild(this._TabBarAreas['right']);
    this._ApplyFeatures();

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

    //Setup Event Listeners
    this.addEventListener('dragstart',(e) => { 
      if ((this._Features & Qt.DockWidgetFeature.DockWidgetMovable) == Qt.DockWidgetFeature.DockWidgetMovable) { this.classList.toggle('Qt-CurrentDragWidget'); e.dataTransfer.setData('text/plain',null);  } 
      else { e.preventDefault(); e.stopPropagation(); }
    });
    this._Undock.addEventListener('pointerup',(e) => {
      if (this.parentNode != document.body) { 
        this._DockParent = this.parentNode;
        this._DockParentData = {w: this.style.width, h: this.style.height , ow: this.offsetWidth , oh: this.offsetHeight };
        this.style.position = "absolute";
        if (!this.style.width) { this.style.width = this.offsetWidth + "px"; }
        if (!this.style.height) { this.style.height = this.offsetHeight + "px"; }
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) { this._Undock.src = Qt.WhiteDock; }
        else { this._Undock.src = Qt.BlackDock; }
        this.setWindowFlag(Qt.WindowType.Window,true);
        document.body.appendChild(this);
      }
      else { 
        this.style.position = "";
        this.style.width = this._DockParentData.w;
        this.style.height = this._DockParentData.h;
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) { this._Undock.src = Qt.WhiteUnDock; }
        else { this._Undock.src = Qt.BlackUnDock; }
        this.setWindowFlag(Qt.WindowType.Window,false);
        this._DockParent.appendChild(this);
      }
    });
    this._UnTab.addEventListener('pointerup',(e) => {
      Array.from(this._CentralWidget.childNodes).forEach((child) => {
        if (child.hasOwnProperty('_MetaObject') && child._MetaObject.includes('QDockWidget')) {
          if (child.style.display != 'none') { this._restoreTabbedWidget(child); this._setCurrentPage(); }
        }
      });
    });
    this._Handle.addEventListener('drop',(event) => {
      var dragged = document.querySelector('.Qt-CurrentDragWidget');
      if (dragged && dragged.hasOwnProperty('_MetaObject') && dragged._MetaObject.includes('QDockWidget')) { 
        if ((this._Features & Qt.DockWidgetFeature.AllowTabs) == Qt.DockWidgetFeature.AllowTabs) { 
          if ((dragged._Features & Qt.DockWidgetFeature.AllowTabs) == Qt.DockWidgetFeature.AllowTabs) { 
            event.preventDefault();
            dragged.classList.toggle('Qt-CurrentDragWidget');
            event.currentTarget.parentNode._tabifyDockWidget(dragged);
            dragged.setAttribute('draggable',false); 
          }
        }
      } 
    },false);

    //this._Close.addEventListener('click',(e) => { this.setVisible(false); this._customEvent('visibilityChanged', { detail: { visible: false } }); });
  }
  //connectedCallback() { super.connectedCallback(); }
  //disconnectedCallback() { super.disconnectedCallback(); }
  
  //Default Event Handler
  handleEvent(e) { 
    super.handleEvent(e);
    if (e.type == 'childEvent') {
      if (e.detail.QEvent == Qt.QEvent.Resize) {
        var Parent = this.parentNode, Children = Array.from(Parent.childNodes);
        Children.forEach((child) => {
          if (child != this) {
            if (Parent.classList.contains('QDockWidgetArea-Horizontal')) { child.style.height = this.style.height; }
            if (Parent.classList.contains('QDockWidgetArea-Vertical')) { child.style.width = this.style.width; }
          }
        });
      }
      else if (e.detail.QEvent == Qt.QEvent.Close) { this.setVisible(false); } 
    }
  }

  // Private Functions
  _ApplyFeatures() { 
    //this._Features = Qt.DockWidgetFeature.DockWidgetClosable | Qt.DockWidgetFeature.DockWidgetMovable | Qt.DockWidgetFeature.DockWidgetFloatable; 
    this._Undock.style.display = ((this._Features & Qt.DockWidgetFeature.DockWidgetFloatable) == Qt.DockWidgetFeature.DockWidgetFloatable ? null : 'none');
  }
  _restoreTabbedWidget(Widget) {
    Widget.style.display = Widget._TabData.display;
    Widget.style.resize = Widget._TabData.resizable;
    Widget.style.width = Widget._TabData.width;
    Widget.style.height = Widget._TabData.height;
    Widget.style.minWidth = Widget._TabData.minWidth;
    Widget.style.minHeight = Widget._TabData.minHeight;

    Widget.setWindowFlags(Widget._TabData.wflags);
    Widget._TabData.tabaction.parentNode.removeChild(Widget._TabData.tabaction);
    Widget._TabData.oparent.appendChild(Widget);
    Widget._TabData = {};
    Widget._UnTab.style.display = 'none';
    this._UnTab.style.display = (this._CentralWidget.childNodes.length > 1 ? '' : 'none');
  }
  _tabifyDockWidget(Widget) {
    if (!Widget.hasOwnProperty('_TabData')) { Widget._TabData = {}; }
    if (!Widget._TabData.hasOwnProperty('display')) { Widget._TabData.display = Widget.style.display; }
    if (!Widget._TabData.hasOwnProperty('width')) { Widget._TabData.width = Widget.style.width; }
    if (!Widget._TabData.hasOwnProperty('height')) { Widget._TabData.height = Widget.style.height; }
    if (!Widget._TabData.hasOwnProperty('minWidth')) { Widget._TabData.minWidth = Widget.style.minWidth; }
    if (!Widget._TabData.hasOwnProperty('minHeight')) { Widget._TabData.minHeight = Widget.style.minHeight; }
    if (!Widget._TabData.hasOwnProperty('resizable')) { Widget._TabData.resizable = Widget.style.resize; }
    if (!Widget._TabData.hasOwnProperty('wflags')) { Widget._TabData.wflags = Widget._WindowFlags; }
    if (!Widget._TabData.hasOwnProperty('oparent')) { Widget._TabData.oparent = Widget.parentNode; }
    if (Widget._TabData.hasOwnProperty('tabaction')) { Widget._TabData.tabaction.parentNode.removeChild(Widget._TabData.tabaction); }
    Widget._TabData.tabaction = new QAction('',Widget.windowTitle()).connect('triggered',this,() => { this._setCurrentPage(Widget); });

    Widget.setResizable(false);
    Widget.style.width = Widget.style.height = Widget.style.minWidth = Widget.style.minHeight = ''
    Widget.style.display = 'none';
    Widget.setWindowFlag(Qt.WindowType.WindowTitleHint,false);
    this._CentralWidget.appendChild(Widget);
    this._UnTab.style.display = (this._CentralWidget.childNodes.length > 1 ? '' : 'none');

    this._TabBarAreas['bottom'].appendChild(Widget._TabData.tabaction);

    if (Widget.hasOwnProperty('_MetaObject') && Widget._MetaObject.includes('QDockWidget')) {
      Widget._CentralWidget.querySelectorAll('q-dockwidget').forEach((child) => { this._tabifyDockWidget(child); });
    }
  }
  _setCurrentPage(page) {
    if (!page) { page = Array.from(this._CentralWidget.childNodes)[0]; }
    Array.from(this._CentralWidget.childNodes).forEach((child) => { 
      child.style.display = (child == page ? (child.hasOwnProperty('_TabData') ? child._TabData.display : 'flex') : 'none');
      if (child.hasOwnProperty('_MetaObject') && child._MetaObject.includes('QDockWidget')) {
        if (child == page) { child._TabData.tabaction.classList.add('selected'); }
        else { child._TabData.tabaction.classList.remove('selected'); }
      }
      else {
        if (child == page) { this._TabBarAreas['bottom'].firstElementChild.classList.add('selected'); }
        else { this._TabBarAreas['bottom'].firstElementChild.classList.remove('selected'); }
      }
    });
  }

  // Public Functions
  allowedAreas() { return this._AllowedAreas; }
  features() { return this._Features; }
  isAreaAllowed(Area) { return ((this._AllowedAreas & Area) == Area); }
  setAllowedAreas(Areas) { this._AllowedAreas = Areas; this._customEvent('allowedAreasChanged',{ bubbles: false, detail: { allowedAreas: Areas } }); return this; }
  setCentralWidget(Widget) {
    if (Widget.hasOwnProperty('_MetaObject') && Widget._MetaObject.includes('QDockWidget')) { this._tabifyDockWidget(Widget); }
    else {
      this._CentralWidget.appendChild(Widget);
      var TabAction = new QAction('',this.windowTitle()).connect('triggered',this,() => { this._setCurrentPage(); });
      TabAction.classList.add('selected');
      this._TabBarAreas['bottom'].appendChild(TabAction);
    }
    return this; 
  }
  setFeature(flag,bool) {
    if (bool) { this._Features |= flag; }
    else { this._Features &= ~flag; }
    this._customEvent('featuresChanged',{ bubbles: false, detail: { features: this._Features } });
    this._ApplyFeatures();
    return this;
  }
  setFeatures(flags) {
    this._Features = flags; 
    this._customEvent('featuresChanged',{ bubbles: false, detail: { features: flags } });
    this._ApplyFeatures();
    return this; 
  }
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
	  this._MetaObject.push("QListView");
    this.classList.add("QListView");
    this.style.userSelect = 'none';
    this.classList.add("Static");

	  //Signals
	  //this.addEventListener('indexesMoved',this);

    //Build UI Components
    this._CentralWidget = QuickElement('div',{'class':"CentralWidget"});
    this.appendChild(this._CentralWidget);

    //Setup Event Listeners
    this._CentralWidget.addEventListener('click',(e) => {
        var owner = e.target , handled = 0; 
        while(owner.parentNode && owner.parentNode instanceof HTMLElement) {
          if (owner.classList.contains("QAction")) { 
            this._customEvent('selectionChanged',{ bubbles: false, detail: { target: owner } }); 
            //this._customEvent('itemClicked',{ bubbles: false, detail: { target: owner } }); 
            handled = 1;
            break; 
          }
          else { owner = owner.parentNode; }
        }
        if (!handled) { this.querySelectorAll('.selected').forEach((child) => { child.classList.remove('selected'); }); }
    });
    this.addEventListener('selectionChanged',(e) => { this.setCurrentItem(e.detail.target); });
  }
  //connectedCallback() { super.connectedCallback(); }
  //disconnectedCallback() { super.disconnectedCallback(); }
  
  //Default Event Handler
  //handleEvent(e) { super.handleEvent(e); }

  //Public Functions
  addSeperator() { this.appendChild(new QAction().setSeperator()); }
  insertSeperator(Before) { this.setParent(new QAction().setSeperator(),Before); }
  setViewMode(mode) {
    this.classList.remove("Static");
    this.classList.remove("IconView");
    this.classList.add((/^iconview$/i.test(mode) ? "IconView" : "Static"));
    return this;
  }
  setCurrentItem(Action) {
    this.querySelectorAll('.selected').forEach((child) => { child.classList.remove('selected'); });
    Action.classList.add('selected');
  }
  setSelected(Action) { Action.classList.add("selected"); }
  deSelect(Action) { Action.classList.remove("selected"); }

  //Public Slots
}
customElements.define('q-listview', QListView);

/*===============================================================================
Qt Style Tree Widget Constructor (Temporary)
===============================================================================*/

class QTreeWidget extends QWidget {
  constructor(parent) {
    super(parent);

    // Private Properties
    this._MetaObject.push("QTreeWidget");
    this.classList.add("QTreeWidget");
    this.style.userSelect = 'none';

    //Build UI Components
    this._CentralWidget = QuickElement('div',{'class':"CentralWidget"});
    this.Header = QuickElement('div',{'class':"Header"},'',this._CentralWidget);
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
  //connectedCallback() { super.connectedCallback(); }
  //disconnectedCallback() { super.disconnectedCallback(); }

  //Default Event Handler
  handleEvent(e) { super.handleEvent(e); }

  //Private Functions

  //Public Functions
  addTopLevelItem(Item) { }
  addTopLevelItems(Items) { }
  columnCount() { }
  currentItem() { }
  headerItem() { }
  insertTopLevelItem(Before,Item) { }
  setColumnCount(count) { 
    for (var i = this.Header.childNodes.length; i < count; i++) { QuickElement('div',{'class':"HeaderItem"},'moo',this.Header); }
  }
  setCurrentItem(item) {
    this.querySelectorAll('.selected').forEach((child) => { child.classList.remove('selected'); });
    item._Container.classList.add('selected');
  }
  setHeaderItem() { }
  setHeaderLabel() { }
  setHeaderLabels(labels) { }

}
// Define the new element
customElements.define('q-treewidget', QTreeWidget);


/*===============================================================================
Qt Style Tree Widget Item Constructor (Temporary)
===============================================================================*/

class QTreeWidgetItem extends QWidget {
  constructor(qicon,qstring,parent) {
    super(parent);

    // Private Properties
    this._MetaObject.push("QTreeWidgetItem");
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
  //connectedCallback() { super.connectedCallback(); }
  //disconnectedCallback() { super.disconnectedCallback(); }
  
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
  //removeChild(child) { this._removeChildObject(child); }
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
Qt Style Main Window Constructor (will be shared with subwindows and dialogs)
===============================================================================*/

class QMainWindow extends QWidget {
  constructor(parent,flags) {
    parent = (parent || document.body);
    flags = (flags || Qt.WindowType.Window | Qt.WindowType.WindowTitleHint | Qt.WindowType.WindowMinMaxButtonsHint | Qt.WindowType.WindowCloseButtonHint);
    super(parent,flags);

	  //Private Properties
	  this._MetaObject.push("QMainWindow");
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
      if (dragged.hasOwnProperty('_MetaObject')) {
        if (dragged._MetaObject.includes('QToolBar')) {
            Object.keys(this._ToolBarAreas).forEach((Area) => {
              if (((dragged._AllowedAreas & Qt.ToolBarArea.LeftToolBarArea) == Qt.ToolBarArea.LeftToolBarArea && Area == 'left') || ((dragged._AllowedAreas & Qt.ToolBarArea.RightToolBarArea) == Qt.ToolBarArea.RightToolBarArea && Area == 'right') || ((dragged._AllowedAreas & Qt.ToolBarArea.TopToolBarArea) == Qt.ToolBarArea.TopToolBarArea && Area == 'top') || ((dragged._AllowedAreas & Qt.ToolBarArea.BottomToolBarArea) == Qt.ToolBarArea.BottomToolBarArea && Area == 'bottom')) {
                this._ToolBarAreas[Area].style.minWidth = "22px"; this._ToolBarAreas[Area].style.minHeight = "22px"; 
              }
            },this); 
        }
        if (dragged._MetaObject.includes('QDockWidget')) {
            Object.keys(this._DockWidgetAreas).forEach((Area) => { 
              if (((dragged._AllowedAreas & Qt.DockWidgetArea.LeftDockWidgetArea) == Qt.DockWidgetArea.LeftDockWidgetArea && Area == 'left') || ((dragged._AllowedAreas & Qt.DockWidgetArea.RightDockWidgetArea) == Qt.DockWidgetArea.RightDockWidgetArea && Area == 'right') || ((dragged._AllowedAreas & Qt.DockWidgetArea.TopDockWidgetArea) == Qt.DockWidgetArea.TopDockWidgetArea && Area == 'top') || ((dragged._AllowedAreas & Qt.DockWidgetArea.BottomDockWidgetArea) == Qt.DockWidgetArea.BottomDockWidgetArea && Area == 'bottom')) {
                this._DockWidgetAreas[Area].style.minWidth = "22px"; this._DockWidgetAreas[Area].style.minHeight = "22px";
              }
            },this);
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
        if (dragged && dragged.hasOwnProperty('_MetaObject') && dragged._MetaObject.includes('QToolBar') && main._acceptDrops == true) { 
          if (((dragged._AllowedAreas & Qt.ToolBarArea.LeftToolBarArea) == Qt.ToolBarArea.LeftToolBarArea && Area == 'left') || ((dragged._AllowedAreas & Qt.ToolBarArea.RightToolBarArea) == Qt.ToolBarArea.RightToolBarArea && Area == 'right') || ((dragged._AllowedAreas & Qt.ToolBarArea.TopToolBarArea) == Qt.ToolBarArea.TopToolBarArea && Area == 'top') || ((dragged._AllowedAreas & Qt.ToolBarArea.BottomToolBarArea) == Qt.ToolBarArea.BottomToolBarArea && Area == 'bottom')) {
            event.preventDefault(); 
          }
        } 
      }.bind(this._ToolBarAreas[area]), false);
      this._ToolBarAreas[area].addEventListener('drop',(event) => { 
        var dragged = document.querySelector('.Qt-CurrentDragWidget');
        if (dragged && dragged.hasOwnProperty('_MetaObject') && dragged._MetaObject.includes('QToolBar')) { 
          if (this._acceptDrops == true) { 
            event.preventDefault();
            if (event.target == event.currentTarget) { event.currentTarget.appendChild(dragged); dragged.setAttribute('draggable',false); } 
            else {
              var owner = event.target; 
              while(owner) {
                if (/^QToolBarArea/.test(owner.parentNode.className)) { event.currentTarget.insertBefore(dragged,((owner.previousSibling == null && owner.nextSibling == null) || (owner.nextSibling != dragged && owner.previousSibling != null) ? owner.nextSibling : owner)); dragged.setAttribute('draggable',false); break; } 
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
        if (dragged && dragged.hasOwnProperty('_MetaObject') && dragged._MetaObject.includes('QDockWidget') && main._acceptDrops == true) { 
          if (((dragged._AllowedAreas & Qt.DockWidgetArea.LeftDockWidgetArea) == Qt.DockWidgetArea.LeftDockWidgetArea && Area == 'left') || ((dragged._AllowedAreas & Qt.DockWidgetArea.RightDockWidgetArea) == Qt.DockWidgetArea.RightDockWidgetArea && Area == 'right') || ((dragged._AllowedAreas & Qt.DockWidgetArea.TopDockWidgetArea) == Qt.DockWidgetArea.TopDockWidgetArea && Area == 'top') || ((dragged._AllowedAreas & Qt.DockWidgetArea.BottomDockWidgetArea) == Qt.DockWidgetArea.BottomDockWidgetArea && Area == 'bottom')) {
            event.preventDefault(); 
          }
        }
      }.bind(this._DockWidgetAreas[area]), false);
      this._DockWidgetAreas[area].addEventListener('drop',(event) => { 
        var dragged = document.querySelector('.Qt-CurrentDragWidget');
        if (dragged && dragged.hasOwnProperty('_MetaObject') && dragged._MetaObject.includes('QDockWidget')) { 
          if (this._acceptDrops == true) { 
            event.preventDefault();
            if (event.target == event.currentTarget) { event.currentTarget.appendChild(dragged); dragged.setAttribute('draggable',false); } 
            else {
              var owner = event.target; 
              while(owner) {
                if (/^QDockWidgetArea/.test(owner.parentNode.className)) { event.currentTarget.insertBefore(dragged,((owner.previousSibling == null && owner.nextSibling == null) || (owner.nextSibling != dragged && owner.previousSibling != null) ? owner.nextSibling : owner)); dragged.setAttribute('draggable',false); break; } 
                else { owner = owner.parentNode; }
              } 
            }
          }
        }
      },false);
	  }
  }
  //connectedCallback() { super.connectedCallback(); }
  //disconnectedCallback() { super.disconnectedCallback(); }
  
  //Default Event Handler
  handleEvent(e) { super.handleEvent(e); }

  //Private Functions

  //Public Functions
  addDockWidget(area,dockwidget,orientation) {
    if (dockwidget._MetaObject.includes('QDockWidget')) {
      if ((area & Qt.DockWidgetArea.LeftDockWidgetArea) == Qt.DockWidgetArea.LeftDockWidgetArea) { var Area = 'left' }
      else if ((area & Qt.DockWidgetArea.RightDockWidgetArea) == Qt.DockWidgetArea.RightDockWidgetArea) { var Area = 'right' }
      else if ((area & Qt.DockWidgetArea.TopDockWidgetArea) == Qt.DockWidgetArea.TopDockWidgetArea) { var Area = 'top' }
      else if ((area & Qt.DockWidgetArea.BottomDockWidgetArea) == Qt.DockWidgetArea.BottomDockWidgetArea) { var Area = 'bottom' }
      if (Area) {
        //dockwidget._updateParent(this);
        this._DockWidgetAreas[Area].appendChild(dockwidget); 
      }
    }      
    return this;    
  } //Maybe use orientation later?
  addToolBar(area,toolbar) { 
    if (toolbar._MetaObject.includes('QToolBar')) {
      if ((area & Qt.ToolBarArea.LeftToolBarArea) == Qt.ToolBarArea.LeftToolBarArea) { var Area = 'left' }
      else if ((area & Qt.ToolBarArea.RightToolBarArea) == Qt.ToolBarArea.RightToolBarArea) { var Area = 'right' }
      else if ((area & Qt.ToolBarArea.TopToolBarArea) == Qt.ToolBarArea.TopToolBarArea) { var Area = 'top' }
      else if ((area & Qt.ToolBarArea.BottomToolBarArea) == Qt.ToolBarArea.BottomToolBarArea) { var Area = 'bottom' }
      if (Area) {
        //toolbar._updateParent(this);
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
    flags = (flags || Qt.WindowType.Window | Qt.WindowType.Dialog | Qt.WindowType.WindowTitleHint | Qt.WindowType.WindowMinMaxButtonsHint | Qt.WindowType.WindowCloseButtonHint);
    super(document.body,flags);

    // Private Properties
	  this._MetaObject.push("QDialog");
    this.classList.add("QDialog");

    //Signals
    /*==== Emitted Signals ====================================
    aboutToActivate()
    TODO: windowStateChanged(oldState,newState)
    =========================================================*/
    
    //Listen to Signals
    this.addEventListener('aboutToActivate',this);

    //Setup Event Listeners
    this.addEventListener('pointerdown',(e) => {
      if (this.parent() && this.parent() != document.body && this.parent()._MetaObject.includes('QMdiArea')) {
        if (this != this.parent().lastElementChild) { this.parentNode.setActiveSubWindow(this); } 
      }
    });  
  }
  //connectedCallback() { super.connectedCallback(); } 
  //disconnectedCallback() { super.disconnectedCallback(); }
  
  //Default Event Handler
  handleEvent(e) { 
    if (e.type == 'childEvent') {
      if (e.detail.QEvent == Qt.QEvent.Close) { 
        this.setVisible(false);
        //e.detail.target.parentNode.removeChild(e.detail.target); 
      }
    }
    super.handleEvent(e); 
  }
  
  //Public Functions
  //isShaded() { }
  setWidget(widget) { super.setCentralWidget(widget) }
}
customElements.define('q-dialog', QDialog);

/*===============================================================================
Qt Style Mdi Subwindow Constructor
===============================================================================*/

class QMdiSubWindow extends QMainWindow {
  constructor(parent,flags) {
    flags = (flags || Qt.WindowType.Window | Qt.WindowType.SubWindow | Qt.WindowType.WindowTitleHint | Qt.WindowType.WindowMinMaxButtonsHint | Qt.WindowType.WindowCloseButtonHint);
    super(parent,flags);

    // Private Properties
	  this._MetaObject.push("QMdiSubWindow");
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
      if (this.parent() && this.parent() != document.body && this.parent()._MetaObject.includes('QMdiArea')) {
        if (this != this.parent().lastElementChild) { this.parentNode.setActiveSubWindow(this); } 
      }
    });  
  }
  //connectedCallback() { super.connectedCallback(); } 
  //disconnectedCallback() { super.disconnectedCallback(); }
  
  //Default Event Handler
  handleEvent(e) { super.handleEvent(e); }
  
  //Public Functions
  //isShaded() { }
  mdiArea() { return this.parent(); }
  setWidget(widget) { super.setCentralWidget(widget) }
}
customElements.define('q-mdisubwindow', QMdiSubWindow);

/*===============================================================================
Qt Style Toolbar Constructor
===============================================================================*/

class QToolBar extends QWidget {
  constructor(title,parent) {
    super(parent);

	  //Private Properties
	  this._MetaObject.push("QToolBar");
    this.classList.add("QToolBar");
    this.style.userSelect = 'none';
    this._AllowedAreas = Qt.ToolBarArea.AllToolBarAreas;
    this._Floatable = false; //TODO: make floating work!

    //Build UI Components
    this._Handle = QuickElement('div',{class: "ToolBarHandle"},'',this);
	  this._CentralWidget = QuickElement('div',{class: "CentralWidget"},'',this);

    /*==== Catched Signals ====================================
    TODO: actionTriggered(action)    
    =========================================================*/  

    //Listen to Signals
    this.addEventListener('allowedAreasChanged',this);
    this.addEventListener('movableChanged',this);
    //TODO: iconSizeChanged(size)
    //TODO: orientationChanged(orientation)
    //TODO: toolButtonStyleChanged(toolButtonStyle)
    //TODO: topLevelChanged(bool topLevel) (when floated or docked)
    //TODO: visibilityChanged(visible)

    //Setup Event Listeners
    this.addEventListener('dragstart',(e) => { this.classList.toggle('Qt-CurrentDragWidget'); e.dataTransfer.setData('text/plain',null); });
    this._Handle.addEventListener('pointerover',(e) => { this.setAttribute('draggable',true); });
    this._Handle.addEventListener('pointerout',(e) => { this.setAttribute('draggable',false); });
  }
  //connectedCallback() { super.connectedCallback(); }
  //disconnectedCallback() { super.disconnectedCallback(); }
  
  //Default Event Handler
  handleEvent(e) { super.handleEvent(e); }

  //Private Functions

  //Public Functions
  addSeperator() { this.appendChild(new QAction().setSeparator()); }
  //addWidget(Widget) { }
  allowedAreas() { return this._AllowedAreas; }
  //clear() { }
  isMovable() { return (this._Handle.style.display == 'none' ? false : true); }
  insertSeperator(Before) { this.insertBefore(new QAction().setSeparator(),Before); } 
  //insertWidget(Before,Widget) { }
  isAreaAllowed(Area) { return ((this._AllowedAreas & Area) == Area); }
  //isFloatable() { }
  //isFloating() { }
  isMovable() { return (this._Handle.style.display == null); }
  //orientation() { }
  setAllowedAreas(Areas) { this._AllowedAreas = Areas; this._customEvent('allowedAreasChanged', { bubbles: false, detail: { allowedAreas: Area } }); return this; }
  setFloatable(bool) { this._Floatable = bool; }
  setMovable(bool) {
    if (bool) { this._Handle.style.display = null; }
    else { this._Handle.style.display = 'none'; }
    this._customEvent('movableChanged',{ bubbles: false, detail: { movable: bool } });
    return this;
  }
  //setOrientation() { }

  //Public Slots
}
customElements.define('q-toolbar', QToolBar);
