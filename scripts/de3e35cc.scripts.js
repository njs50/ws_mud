"use strict";angular.module("clientApp",["templates-main"]).config(["$routeProvider","$locationProvider",function(e,t){t.html5Mode(!1),e.when("/",{templateUrl:"views/main.html"}).when("/about",{templateUrl:"views/about.html"}).when("/contact",{templateUrl:"views/contact.html"}).otherwise({redirectTo:"/"})}]),angular.module("clientApp").controller("MainCtrl",["$scope","$rootScope","$window","telnet","$timeout",function(e,t,n,r,i){t.windowHeight=n.innerHeight,t.telnet=r,angular.element(n).bind("resize",function(){t.windowHeight!==n.innerHeight&&(t.windowHeight=n.innerHeight,i(function(){t.$apply("windowHeight")},0))}),r.connect("vault-thirteen.net",8e3),r.$scope.$on(r.$scope.telnetEvents.parsePrompt,function(e,t){t.match(/Choice:/)?r.send("Tester"):t.match(/Password:/)?r.silentSend("TesterPassword"):t.match(/Press <return> to continue./)?r.send(""):t.match(/Disconnect previous link?/)&&r.send("y")})}]),angular.module("clientApp").controller("ScanCtrl",["$scope","autoscan","telnet","keypress",function(e,t,n,r){e.autoscan=t;var i=function(e){switch(e){case"up":return"north";case"tilde":return"here";case"down":return"south";case"left":return"west";case"right":return"east";case"pageup":return"up";case"pagedown":return"down";case"tab":return"refresh"}return""};r.$scope.$on(r.events.keydown,function(o,a){var s=r.getEventKey(a),u=i(s);if(""!==u)e.directionClick(u);else if(""!==t.$scope.selectedDirection&&"number"==typeof s&&(s--,u=t.$scope.selectedDirection,t.directionExists()&&t.$scope.adjacentRooms[u].buttons.length>s)){var c=t.$scope.adjacentRooms[u].buttons[s];n.send(c.command)}}),e.directionClick=function(e){"refresh"===e?(n.send("scan"),t.$scope.selectedDirection="",t.$scope.$apply("selectedDirection")):t.$scope.selectedDirection!==e&&t.hasButtons(e)?t.$scope.selectedDirection!==e&&(t.$scope.selectedDirection=e,t.$scope.$apply("selectedDirection")):"here"!==e&&n.send(e)}}]),angular.module("clientApp").factory("telnet",["$rootScope","$timeout",function(e,t){var n=e.$new();n.outputBuffer="",n.bConnected=!1,n.maxScrollback=2e4,n.server="",n.port="",n.telnetEvents={parsePrompt:"TELNET_PARSE_PROMPT",parseBlock:"TELNET_PARSE_BLOCK",parseLine:"TELNET_PARSE_LINE",connect:"TELNET_CONNECT",disconnect:"TELNET_DISCONNECT"};var r={};r.ECHO=1,r.LF=10,r.CR=13,r.ESC=27,r.WILL=251,r.WONT=252,r.DO=253,r.DONT=254,r.IAC=255;var i=new Websock,o=0,a="",s=1,u=0,c=!1,l=!1,f=/^(<[^>]*>|\s*Choice:|\s*Password:|--\s*MORE\s*--\s*<[^>]*>|\s*Press <return> to continue\.|\s*Disconnect previous link\?)\s*$/,p=function(e){l&&window.console&&console.log(e)},d=function(){for(var e="";u>0;)e+="</span>",u--;return e},h=function(e,t){return parseInt(e,10)-parseInt(t,10)},m=function(e){if(c?(n.outputBuffer+=e+d(),c=!1):n.outputBuffer+="<br />"+e+d(),n.outputBuffer.length>n.maxScrollback){var r=n.outputBuffer.indexOf("<br />",n.outputBuffer.length-n.maxScrollback+Math.ceil(.2*n.maxScrollback));r>0&&(n.outputBuffer=n.outputBuffer.substr(r+6))}l&&p("buffer: "+e),t(function(){n.$apply("outputBuffer")},0)},g=function(e){for(var t="",l="",g="",v=0;e.length>v;v++){var y=e[v];switch(o){case 0:y===r.IAC?o=1:y===r.ECHO?s=0===s?1:0:y===r.ESC?o=3:y===r.LF?(m(g),l.length>0&&(a+=l+"\n"),l="",g=""):y!==r.CR&&(l+=String.fromCharCode(y),g+=60===y?"&lt;":62===y?"&gt;":String.fromCharCode(y));break;case 1:o=y===r.DO?2:0;break;case 2:i.send([r.IAC,r.WONT,y]),o=0;break;case 3:if("["===String.fromCharCode(y)){t="",o=4;continue}"c"===String.fromCharCode(y)?(d(),n.outputBuffer=""):"M"===String.fromCharCode(y)?p("[Scroll Up]"):"D"===String.fromCharCode(y)?p("[Scroll Down]"):"H"===String.fromCharCode(y)?p("[Set Tab]"):"8"===String.fromCharCode(y)?p("[Restore Cursor & Attrs]"):"7"===String.fromCharCode(y)?p("[Save Cursor & Attrs]"):")"===String.fromCharCode(y)?p("[Font Set G0]"):"("===String.fromCharCode(y)?p("[Font Set G1]"):p("[unknown escape code : "+y+"]"),o=0;break;case 4:if(y>=48&&57>=y||59===y)t+=String.fromCharCode(y);else if("m"===String.fromCharCode(y)){var $=0,b="",w=t.split(";");w.sort(h);for(var x=0;w.length>x;x++){var C=parseInt(w[x],10);0===C&&u>0&&(g+=d()),1===C&&($=8),(2===C||22===C)&&($=0),3===C&&(b+="italic "),4===C&&(b+="uline "),(5===C||6===C)&&(b+="blink "),7===C&&(b="fg8 bg1"),9===C&&(b+="strikethrough "),37>=C&&C>=30&&(b+="fg"+(C-29+$)),47>=C&&C>=40&&(b+="bg"+(C-39+$))}b.length>0&&(g+='<span class="'+b+'">',u++),o=0}else p("[ansi:"+t+String.fromCharCode(y)+"]"),o=0}}if(a.length>0){for(var T=a.split("\n"),k=0;T.length>k;k++)n.$broadcast(n.telnetEvents.parseLine,T[k]);n.$broadcast(n.telnetEvents.parseBlock,a),a=""}""!==g&&(m(g),null!==l.match(f)?(n.$broadcast(n.telnetEvents.parsePrompt,l),c=!1):c=!0)};return i.on("message",function(){g(i.rQshiftBytes(i.rQlen()))}),i.on("open",function(){n.bConnected=!0,c=!1,m('<span class="cmd">Connected to '+n.server+":"+n.port+"</span>"),n.$broadcast(n.telnetEvents.connect)}),i.on("close",function(){n.bConnected=!1,c=!1,m('<span class="cmd">Disconnected...</span>'),n.$broadcast(n.telnetEvents.disconnect)}),i.on("error",function(){c=!1,m('<span class="cmd">Connection error occured...</span>')}),{getScope:function(){return n},send:function(e){c=!0,i.send_string(e+"\n"),s&&m('<span class="cmd">'+e+"</span>"),l&&p("send: "+e)},silentSend:function(e){c=!0,i.send_string(e+"\n")},connect:function(e,t){"string"!=typeof e?(e=n.server,t=n.port):(n.server=e,n.port=t),t=t||n.port,i.open("ws://"+e+":"+t,["binary","base64"])},disconnect:function(){i.close()},setConsoleOutput:function(e){l=e===!0},$scope:n}}]),angular.module("clientApp").directive("scanDirection",["autoscan",function(e){var t=function(e){switch(e){case"north":return"arrow-up";case"up":return"caret-up";case"east":return"arrow-right";case"south":return"arrow-down";case"down":return"caret-down";case"west":return"arrow-left";case"here":return"bolt";case"refresh":return"refresh"}};return{restrict:"A",replace:!1,scope:!1,link:function(n,r,i){r.addClass("icon-"+t(i.scanDirection)),r.addClass("btn"),"refresh"!==i.scanDirection&&e.$scope.$watch("adjacentRooms."+i.scanDirection,function(e){void 0!==e?(r.removeClass("disabled muted btn-danger btn-info"),"mobs"===e.type?r.addClass("btn-danger"):("locked"===e.type||"dark"===e.type)&&r.addClass("btn-info")):(r.removeClass("btn-danger btn-info"),r.addClass("disabled muted"))},!0),r.bind("click",function(){n.directionClick(i.scanDirection)})}}}]),angular.module("clientApp").directive("telnetSend",["telnet",function(e){return function(t,n,r){n.bind("click",function(){e.send(r.telnetSend)})}}]),angular.module("clientApp").directive("telnetStatus",["telnet",function(e){return{restrict:"A",replace:!1,link:function(t,n){e.$scope.$watch("bConnected",function(t){t?n.removeClass("disconnected").addClass("connected").text("online").off("click",e.connect).on("click",e.disconnect):n.removeClass("connected").addClass("disconnected").text("offline").off("click",e.disconnect).on("click",e.connect)})}}}]),angular.module("clientApp").directive("autoscroll",function(){return{restrict:"A",link:function(e,t){var n=!0,r=function(){return Math.max(t[0].scrollHeight,t[0].clientHeight)-t[0].clientHeight};e.$watch("telnet.$scope.outputBuffer",function(){n&&(t[0].scrollTop=r())}),t.on("scroll",function(){n=r()!==t[0].scrollTop?!1:!0})}}}),angular.module("clientApp").controller("CommandBarCtrl",["$scope","telnet","$timeout","keypress",function(e,t,n,r){e.command="",e.aCommands=[],e.commandPos=0,e.commandMaxLength=50;var i=function(){(0===e.commandPos||e.aCommands[e.aCommands.length-e.commandPos]!==e.command)&&e.aCommands.push(e.command),e.commandPos=0,e.aCommands.length>e.commandMaxLength&&(e.aCommands=e.aCommands.slice(1)),t.send(e.command),e.command="",n(function(){e.$apply("command")},0)},o=function(t){var r=t.keyCode?t.keyCode:t.which;e.commandPos=Math.max(0,e.commandPos+(39-r))%(e.aCommands.length+1),e.command=e.commandPos?e.aCommands[e.aCommands.length-e.commandPos]:"",n(function(){e.$apply("command")},0)};e.keyDown=function(t){var n=t.keyCode?t.keyCode:t.which;switch(n){case 13:t.preventDefault(),i(t);break;case 33:case 34:r.keyDown(t);break;case 38:case 40:t.shiftKey?(t.preventDefault(),o(t)):(t.preventDefault(),r.keyDown(t));break;case 9:t.preventDefault(),r.keyDown(t);break;default:""===e.command&&(n>=48&&57>=n||192===n||37===n||39===n)&&(t.preventDefault(),r.keyDown(t))}}}]),angular.module("clientApp").directive("commandBar",function(){return{template:'<input ng-controller="CommandBarCtrl" ng-model="command" type="text" class="pull-bottom" style="width:100%">',restrict:"E",replace:!0,link:function(e,t){t.off("keydown").bind("keydown",function(t){e.keyDown(t)}),t[0].focus();var n=!0;t.bind("blur",function(){n=!1}),t.bind("focus",function(){n=!0}),$(window).off("keydown").on("keydown",function(e){n||-1!==$.inArray(document.activeElement.tagName.toLowerCase(),["input","textarea"])||(t[0].focus(),t.trigger(e))})}}}),angular.module("clientApp").controller("CommandButtonsCtrl",["$scope","autoscan","keypress","telnet",function(e,t,n,r){e.aUserCommands=["cast fireball","cast lightning bolt","cast prismatic missile","cast acid blast","cast burning hands","cast mists of sleep","cast freeze","cast maelstrom","cast web","cast slow","cast proble","prep prismatic missile","prep maelstrom"],n.$scope.$on(n.events.keydown,function(i,o){if(""===t.$scope.selectedDirection){var a=n.getEventKey(o);"number"==typeof a&&(a--,-1===a&&(a=9),r.send(e.aUserCommands[a]))}})}]),angular.module("clientApp").factory("autoscan",["$rootScope","telnet","$timeout",function(e,t,n){var r=e.$new();r.selectedDirection="",r.adjacentRooms={};var i=/^(\[Exits:|You see nothing in the vicinity\.)/,o=/,\s+(?=a|an|the|two|three|four|five|six|seven|eight|nine|ten|[A-Z]\S+)/,a=/^\s+(?=a|an|the|two|three|four|five|six|seven|eight|nine|ten|[A-Z]\S+)/,s={n:"north",e:"east",s:"south",w:"west",u:"up",d:"down"},u=!1,c=!1,l={},f="";return t.$scope.$on(t.$scope.telnetEvents.parseLine,function(e,t){t.match(i)&&(u=!0,l={});var n=t.match(/^\s*\[?(Here|east|west|north|south|up|down)]?\s*:\s*(.*)$/);n?(u=!0,c=!0,f=n[1].toLowerCase(),l[f]=n[2]):t.match(a)?l[f]+=t:c=!1}),t.$scope.$on(t.$scope.telnetEvents.parsePrompt,function(e,t){if(u){for(var i in l)if("darkness"===l[i])l[i]={type:"dark",buttons:[{label:"refresh light",command:"refreshLight"}]};else{l[i]=l[i].replace(/^\s*/,"").split(o);for(var a=0;l[i].length>a;a++){var f={label:l[i][a].toLowerCase()},p=f.label.replace(/^\s*([^A-Z]\S*)?\s+/,"").replace(/(ves|ies|es|s)\b/g,"").replace(/\s+(the|\w|\w\w)(?=\s+)/g,"").replace(/[^a-zA-Z- ]+/g,"").split(" ").join(".");f.command=("here"!==i?i+" & ":"")+"kill "+p,l[i][a]=f}l[i]={type:"mobs",buttons:l[i]}}var d=t.match(/<.*\s([NESWUD]*)>/i);if(d)for(var h in d[1]){var m=d[1][h].toLowerCase(),g=s[m];l.hasOwnProperty(s[m])||(l[s[m]]=m!==d[1][h]?{type:"empty",buttons:[]}:{type:"locked",buttons:[{label:"open "+g,command:"open "+g+" & scan"},{label:"unlock "+g,command:"unlock "+g+" & scan"},{label:"knock "+g,command:"knock "+g+" & scan"},{label:"pull lever",command:"pull lever & scan"},{label:"pound gate",command:"pound gate & scan"},{label:"move rubble",command:"move rubble & scan"},{label:"open door",command:"open door & scan"},{label:"unlock door",command:"unlock door & scan"},{label:"knock door",command:"knock door & scan"}]})}r.selectedDirection="",r.adjacentRooms=l,l={},c=!1,u=!1,n(function(){r.$apply("adjacentRooms")},0)}}),{directionExists:function(e){return e=e||r.selectedDirection,r.adjacentRooms.hasOwnProperty(e)},hasButtons:function(e){return e=e||r.selectedDirection,r.adjacentRooms.hasOwnProperty(e)&&r.adjacentRooms[e].buttons.length>0},getScope:function(){return r},$scope:r}}]),angular.module("clientApp").factory("keypress",["$rootScope",function(e){var t=e.$new(),n={keydown:"UNHANDLED_KEY_DOWN"};return{keyDown:function(e){t.$broadcast(n.keydown,e)},getEventKey:function(e){var t=e.keyCode?e.keyCode:e.which;switch(t){case 8:return"backspace";case 9:return"tab";case 13:return"enter";case 27:return"esc";case 32:return"space";case 33:return"pageup";case 34:return"pagedown";case 35:return"end";case 36:return"home";case 37:return"left";case 38:return"up";case 39:return"right";case 40:return"down";case 45:return"insert";case 46:return"delete";case 192:return"tilde"}return t>=48&&57>=t?t-48:"unknown"},$scope:t,events:n}}]);