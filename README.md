Web-IRC
A feature-rich Websocket IRC client in JavaScript

• Multi-server support.<br>
• Multi-Document Interface allows viewing multiple windows at the same time<br>
• Useful Dockwidgets and toolbars, which are all sortable and/or movable.<br>
• Monitor panels are able to be tabified by dragging one ontop anothers titlebar.<br>
• Support for both ws:// and wss:// connections (See note below)<br>
• Auto-completion of nicknames, commands and channels. (tab-key)<br>
• Text formatting supported: Bold, Underline, Reverse, Color, Italic, Strikethru, HexColor and Monospace<br>
• Inline media embedding (Images, Audio, Video and YouTube urls)<br>
• Somewhat Mobile-Friendly. See details below.<br>

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

Try out this <a href="https://chat.swiftirc.net/">Demo</a>. There are currently 4 default "Favorites" (SwiftIRC running UnrealIRCd, Libera.Chat running solanum, Ergo running Ergo/Oragono, and WRNet another UnrealIRCd) which can be found under the star icon of any status window. Just click on one of the networks to connect to them.

By using this project or its source code, for any purpose and in any shape or form, you grant your implicit agreement that:

"all your base are belong to us!"
    --Zero Wing
