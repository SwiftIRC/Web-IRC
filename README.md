Web-IRC
A feature-rich Websocket IRC client in JavaScript

• Multi-server support.<br>
• Multi-Document Interface allows viewing multiple windows at the same time<br>
• Support for both ws:// and wss:// connections (See note below)<br>
• Auto-completion of nicknames, commands and channels. (tab-key)<br>
• Text formatting supported: Bold, Underline, Reverse, Color, Italic, Strikethru, HexColor and Monospace<br>
• Inline media embedding (Images, Audio, Video and YouTube urls)<br>

There's absolutely no setup required. Pure HTML/CSS/JavaScript. Connect to any IRC server that allows websockets and the underlying websocket protocol 'text.ircv3.net'

NOTE: Chromium based and FireFox do NOT allow ws:// sockets to be opened over a https:// connection! If you want to offer the ability to connect to both ws:// and wss:// this page must be hosted via http://, not https://. Unfortunately ONLY http connections can open both insecure and secure websockets, where https forces only secure sockets.

Try out this <a href="https://chat.swiftirc.net/">Demo</a>

By using this project or its source code, for any purpose and in any shape or form, you grant your implicit agreement that:

"all your base are belong to us!"
    --Zero Wing
