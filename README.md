Web-IRC
A feature-rich Websocket IRC client in JavaScript

• Multi-server support.<br>
• Multi-Document Interface allows viewing multiple windows at the same time<br>
• Useful Dockwidgets and toolbars, which are all sortable and/or movable.<br>
• Monitor panels are able to be tabified by dragging one ontop anothers titlebar.<br>
• Support for both ws:// and wss:// connections (See note below)<br>
• Auto-completion of nicknames, commands and channels. (tab-key)<br>
• Text formatting supported: Bold, Underline, Reverse, Color, Italic, Strikethru, HexColor(See Note) and Monospace<br>
• Inline media embedding (Images, Audio, Video and YouTube urls)<br>
• Somewhat Mobile-Friendly. See details below.<br>

HexColor Note: the control code to initialize hex-color is \x04, firefox replaces this with \ufffd BEFORE JS gets a chance to interact with the data, Chrome however does not. In order to maintain parsings for both browsers, I look for [\x04|\ufffd] for a temporary solution. This CAN and WILL break color parsing if there are legitimate \ufffd characters either by someone including it within their message or the NON-UTF8 replacement from the ircd according to IRCv3's websocket protocol.

Current IRCv3 Support:<br>
• account-notify<br>
• away-notify<br>
• batch (includes chathistory)<br>
• cap-notify<br>
• chghost<br>
• extended-join<br>
• message-tags<br>
• multi-prefix<br>
• setname<br>
• server-time (currently only used for chathistory)<br>
• userhost-in-names<br>
• echo-message (disabled by default, can be user enabled)<br>
• client-only tags (See Note below)

Currently only +typing is supported for client-only tags, and within IRC events and the special "TAGMSG". Up to three nicknames will be shown in a channels input element placeholder value, more than 3 results in "Multiple people are typing..."

There's absolutely no setup required. Pure HTML/CSS/JavaScript. Connect to any IRC server that allows websockets and the underlying websocket protocol 'text.ircv3.net'

NOTE: Chromium based and FireFox do NOT allow ws:// sockets to be opened over a https:// connection! If you want to offer the ability to connect to both ws:// and wss:// this page must be hosted via http://, not https://. Unfortunately ONLY http connections can open both insecure and secure websockets, where https forces only secure sockets.

While testing, this does work on mobile web-browsers, chrome, firefox, even stock samsung internet, albiet with a few quirks. Certain things aren't standardized and implemented for mobile clients such as CSS "resize: both", while the control is visible, it does nothing.
Other unique features requiring drag-n-drop have been forced with the usage of DragDropTouch.js

You can specify a "perform" query string which will execute a SINGLE command if this field is present. Useful for linking to your server and/or channels you wish people to join. 
Try out this <a href="https://chat.swiftirc.net/?perform=/server+-j+%23swiftirc,%23bullshit+wss://fiery.swiftirc.net:4443">Demo</a>. 

There are currently 5 default "Favorites" (SwiftIRC running UnrealIRCd, Libera.Chat running solanum, Ergo running Ergo/Oragono, Unreal and WRNet another UnrealIRCd) which can be found under the star icon of any status window. Just click on one of the networks to connect to them.

By using this project or its source code, for any purpose and in any shape or form, you grant your implicit agreement that:

"all your base are belong to us!"
    --Zero Wing
