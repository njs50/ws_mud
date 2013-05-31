"use strict";angular.module("clientApp",["templates-main"]).config(["$routeProvider","$locationProvider",function(e,t){t.html5Mode(!1),e.when("/",{templateUrl:"views/main.html"}).when("/about",{templateUrl:"views/about.html"}).when("/contact",{templateUrl:"views/contact.html"}).otherwise({redirectTo:"/"})}]),angular.module("clientApp").controller("MainCtrl",["$scope","$rootScope","$window","telnet","$timeout",function(e,t,n,r,i){t.windowHeight=n.innerHeight,t.telnet=r,angular.element(n).bind("resize",function(){t.windowHeight!==n.innerHeight&&(t.windowHeight=n.innerHeight,i(function(){t.$apply("windowHeight")},0))});var o=8e3,a="vault-thirteen.net";"localhost"===$(location).attr("hostname")&&(o=7e3,r.$scope.$on(r.$scope.telnetEvents.parsePrompt,function(e,t){t.match(/Choice:/)?r.send("Tester"):t.match(/Password:/)?r.silentSend("TesterPassword"):t.match(/Press <return> to continue./)?r.send(""):t.match(/Disconnect previous link?/)&&r.send("y")})),r.connect(a,o)}]),angular.module("clientApp").controller("ScanCtrl",["$scope","autoscan","buttons","keypress","telnet",function(e,t,n,r,i){var o=function(e){switch(e){case"up":return"north";case"tilde":return"here";case"down":return"south";case"left":return"west";case"right":return"east";case"pageup":return"up";case"pagedown":return"down";case"tab":return"refresh";case"esc":return"reset"}return""};r.$scope.$on(r.events.keydown,function(t,n){var i=r.getEventKey(n),a=o(i);""!==a&&e.directionClick(a)}),t.$scope.$on(t.events.room_changed,function(){n.resetButtons()}),e.directionClick=function(e){"reset"===e?n.resetButtons():"refresh"===e?(n.resetButtons(),i.send("scan")):n.$scope.buttonSet!==e&&t.hasButtons(e)?n.$scope.buttonSet!==e&&n.setDirectionButtons(e):"here"!==e&&i.send(e)}}]),angular.module("clientApp").factory("telnet",["$rootScope","$timeout",function(e,t){var n=e.$new();n.outputBuffer="",n.bConnected=!1,n.maxScrollback=2e4,n.server="",n.port="",n.telnetEvents={parsePrompt:"TELNET_PARSE_PROMPT",parseBlock:"TELNET_PARSE_BLOCK",parseLine:"TELNET_PARSE_LINE",connect:"TELNET_CONNECT",disconnect:"TELNET_DISCONNECT",bufferUpdated:"TELNET_OUTPUT_BUFFER_UPDATE"};var r={};r.ECHO=1,r.LF=10,r.CR=13,r.ESC=27,r.WILL=251,r.WONT=252,r.DO=253,r.DONT=254,r.IAC=255;var i=new Websock,o=0,a="",s=1,u=0,c=!1,l=!1,f=/^(<[^>]*>|\s*Choice:|\s*Password:|--\s*MORE\s*--\s*<[^>]*>|\s*Press <return> to continue\.|\s*Disconnect previous link\?)\s*$/,p=function(e){l&&window.console&&console.log(e)},d=function(){for(var e="";u>0;)e+="</span>",u--;return e},h=function(e,t){return parseInt(e,10)-parseInt(t,10)},m=function(e){if(c?(n.outputBuffer+=e+d(),c=!1):n.outputBuffer+="<br />"+e+d(),n.outputBuffer.length>n.maxScrollback){var r=n.outputBuffer.indexOf("<br />",n.outputBuffer.length-n.maxScrollback+Math.ceil(.2*n.maxScrollback));r>0&&(n.outputBuffer=n.outputBuffer.substr(r+6))}l&&p("buffer: "+e),t(function(){n.$apply("outputBuffer"),n.$broadcast(n.telnetEvents.bufferUpdated)},0)},g=function(e){for(var t="",l="",g="",v=0;e.length>v;v++){var y=e[v];switch(o){case 0:y===r.IAC?o=1:y===r.ECHO?s=0===s?1:0:y===r.ESC?o=3:y===r.LF?(m(g),l.length>0&&(a+=l+"\n"),l="",g=""):y!==r.CR&&(l+=String.fromCharCode(y),g+=60===y?"&lt;":62===y?"&gt;":String.fromCharCode(y));break;case 1:o=y===r.DO?2:0;break;case 2:i.send([r.IAC,r.WONT,y]),o=0;break;case 3:if("["===String.fromCharCode(y)){t="",o=4;continue}"c"===String.fromCharCode(y)?(d(),n.outputBuffer="",n.$broadcast(n.telnetEvents.bufferUpdated)):"M"===String.fromCharCode(y)?p("[Scroll Up]"):"D"===String.fromCharCode(y)?p("[Scroll Down]"):"H"===String.fromCharCode(y)?p("[Set Tab]"):"8"===String.fromCharCode(y)?p("[Restore Cursor & Attrs]"):"7"===String.fromCharCode(y)?p("[Save Cursor & Attrs]"):")"===String.fromCharCode(y)?p("[Font Set G0]"):"("===String.fromCharCode(y)?p("[Font Set G1]"):p("[unknown escape code : "+y+"]"),o=0;break;case 4:if(y>=48&&57>=y||59===y)t+=String.fromCharCode(y);else if("m"===String.fromCharCode(y)){var $=0,b="",w=t.split(";");w.sort(h);for(var x=0;w.length>x;x++){var C=parseInt(w[x],10);0===C&&u>0&&(g+=d()),1===C&&($=8),(2===C||22===C)&&($=0),3===C&&(b+="italic "),4===C&&(b+="uline "),(5===C||6===C)&&(b+="blink "),7===C&&(b="fg8 bg1"),9===C&&(b+="strikethrough "),37>=C&&C>=30&&(b+="fg"+(C-29+$)),47>=C&&C>=40&&(b+="bg"+(C-39+$))}b.length>0&&(g+='<span class="'+b+'">',u++),o=0}else p("[ansi:"+t+String.fromCharCode(y)+"]"),o=0}}if(a.length>0){for(var T=a.split("\n"),E=0;T.length>E;E++)n.$broadcast(n.telnetEvents.parseLine,T[E]);n.$broadcast(n.telnetEvents.parseBlock,a),a=""}""!==g&&(m(g),null!==l.match(f)?(n.$broadcast(n.telnetEvents.parsePrompt,l),c=!1):c=!0)};return i.on("message",function(){g(i.rQshiftBytes(i.rQlen()))}),i.on("open",function(){n.bConnected=!0,c=!1,m('<span class="cmd">Connected to '+n.server+":"+n.port+"</span>"),n.$broadcast(n.telnetEvents.connect)}),i.on("close",function(){n.bConnected=!1,c=!1,m('<span class="cmd">Disconnected...</span>'),n.$broadcast(n.telnetEvents.disconnect)}),i.on("error",function(){c=!1,m('<span class="cmd">Connection error occured...</span>')}),{getScope:function(){return n},send:function(e){c=!0,i.send_string(e+"\n"),s&&m('<span class="cmd">'+e+"</span>"),l&&p("send: "+e)},silentSend:function(e){c=!0,i.send_string(e+"\n")},connect:function(e,t){"string"!=typeof e?(e=n.server,t=n.port):(n.server=e,n.port=t),t=t||n.port,i.open("ws://"+e+":"+t,["binary","base64"])},disconnect:function(){i.close()},setConsoleOutput:function(e){l=e===!0},$scope:n}}]),angular.module("clientApp").directive("scanDirection",["autoscan","buttons",function(e,t){var n=function(e){switch(e){case"north":return"arrow-up";case"up":return"caret-up";case"east":return"arrow-right";case"south":return"arrow-down";case"down":return"caret-down";case"west":return"arrow-left";case"here":return"bolt";case"refresh":return"refresh"}};return{restrict:"A",replace:!1,scope:!1,link:function(r,i,o){i.addClass("icon-"+n(o.scanDirection)),i.addClass("btn"),"refresh"!==o.scanDirection&&(e.$scope.$watch("adjacentRooms."+o.scanDirection,function(e){void 0!==e?(i.removeClass("disabled muted btn-danger btn-info"),"mobs"===e.type?i.addClass("btn-danger"):("locked"===e.type||"dark"===e.type)&&i.addClass("btn-info")):(i.removeClass("btn-danger btn-info"),i.addClass("disabled muted"))},!0),t.$scope.$watch("buttonSet",function(e){e===o.scanDirection?i.addClass("selected"):i.removeClass("selected")})),i.bind("click",function(){r.directionClick(o.scanDirection)})}}}]),angular.module("clientApp").directive("telnetSend",["telnet",function(e){return function(t,n,r){n.bind("click",function(){e.send(r.telnetSend)})}}]),angular.module("clientApp").directive("telnetStatus",["telnet",function(e){return{restrict:"A",replace:!1,link:function(t,n){e.$scope.$watch("bConnected",function(t){t?n.removeClass("disconnected").addClass("connected").text("online").off("click",e.connect).on("click",e.disconnect):n.removeClass("connected").addClass("disconnected").text("offline").off("click",e.disconnect).on("click",e.connect)})}}}]),angular.module("clientApp").directive("autoscroll",["telnet",function(e){return{restrict:"A",scope:!1,link:function(t,n){var r=!0,i=function(){return Math.max(n[0].scrollHeight,n[0].clientHeight)-n[0].clientHeight};e.$scope.$on(e.$scope.telnetEvents.bufferUpdated,function(){r&&(n[0].scrollTop=i())}),n.on("scroll",function(){r=i()!==n[0].scrollTop?!1:!0})}}}]),angular.module("clientApp").controller("CommandBarCtrl",["$scope","telnet","$timeout","keypress",function(e,t,n,r){e.command="",e.aCommands=[],e.commandPos=0,e.commandMaxLength=50;var i=function(){(0===e.commandPos||e.aCommands[e.aCommands.length-e.commandPos]!==e.command)&&e.aCommands.push(e.command),e.commandPos=0,e.aCommands.length>e.commandMaxLength&&(e.aCommands=e.aCommands.slice(1)),t.send(e.command),e.command="",n(function(){e.$apply("command")},0)},o=function(t){var r=t.which;e.commandPos=Math.max(0,e.commandPos+(39-r))%(e.aCommands.length+1),e.command=e.commandPos?e.aCommands[e.aCommands.length-e.commandPos]:"",n(function(){e.$apply("command")},0)};e.keyDown=function(t){var n=t.keyCode?t.keyCode:t.which;switch(n){case 13:t.preventDefault(),i(t);break;case 27:case 33:case 34:r.keyDown(t);break;case 38:case 40:t.shiftKey?(t.preventDefault(),o(t)):(t.preventDefault(),r.keyDown(t));break;case 9:t.preventDefault(),r.keyDown(t);break;default:""===e.command&&(n>=48&&57>=n||192===n||37===n||39===n)&&(t.preventDefault(),r.keyDown(t))}}}]),angular.module("clientApp").directive("commandBar",function(){return{template:'<input ng-controller="CommandBarCtrl" ng-model="command" type="text" class="pull-bottom" style="width:100%">',restrict:"E",replace:!0,link:function(e,t){t.off("keydown").bind("keydown",function(t){e.keyDown(t)}),t[0].focus();var n=!0;t.bind("blur",function(){n=!1}),t.bind("focus",function(){n=!0}),$(window).off("keydown").on("keydown",function(e){n||-1!==$.inArray(e.which,[0,16,17,18,91,93])||e.ctrlKey||e.metaKey||-1!==$.inArray(document.activeElement.tagName.toLowerCase(),["input","textarea"])||(t[0].focus(),t.trigger(e))})}}}),angular.module("clientApp").controller("CommandButtonsCtrl",["$scope","buttons","telnet","keypress",function(e,t,n,r){e.buttons=t,r.$scope.$on(r.events.keydown,function(t,n){var i=r.getEventKey(n);"number"==typeof i&&(i--,-1===i&&(i=9),e.clickButton(i))}),e.clickButton=function(e){t.$scope.aActiveButtons.length>e&&n.send(t.$scope.aActiveButtons[e].command),t.resetButtons()}}]),angular.module("clientApp").factory("autoscan",["$rootScope","telnet","$timeout",function(e,t,n){var r=e.$new();r.adjacentRooms={};var i=/^(\[Exits:|You see nothing in the vicinity\.)/,o=/,\s+(?=a|an|the|two|three|four|five|six|seven|eight|nine|ten|[A-Z]\S+)/,a=/^\s+(?=a|an|the|two|three|four|five|six|seven|eight|nine|ten|[A-Z]\S+)/,s={n:"north",e:"east",s:"south",w:"west",u:"up",d:"down"},u=!1,c=!1,l={},f="";t.$scope.$on(t.$scope.telnetEvents.parseLine,function(e,t){t.match(i)&&(u=!0,l={});var n=t.match(/^\s*\[?(Here|east|west|north|south|up|down)]?\s*:\s*(.*)$/);n?(u=!0,c=!0,f=n[1].toLowerCase(),l[f]=n[2]):t.match(a)?l[f]+=t:c=!1}),t.$scope.$on(t.$scope.telnetEvents.parsePrompt,function(e,t){if(u){for(var i in l)if("darkness"===l[i])l[i]={type:"dark",buttons:[{label:"refresh light",command:"refreshLight"}]};else{l[i]=l[i].replace(/^\s*/,"").split(o);for(var a=0;l[i].length>a;a++){var f={label:l[i][a].toLowerCase()},d=f.label.replace(/^\s*([^A-Z]\S*)?\s+/,"").replace(/(ves|ies|es|s)\b/g,"").replace(/\s+(the|\w|\w\w)(?=\s+)/g,"").replace(/[^a-zA-Z- ]+/g,"").split(" ").join(".");f.command=("here"!==i?i+" & ":"")+"kill "+d,l[i][a]=f}l[i]={type:"mobs",buttons:l[i]}}var h=t.match(/<.*\s([NESWUD]*)>/i);if(h)for(var m in h[1]){var g=h[1][m].toLowerCase(),v=s[g];l.hasOwnProperty(s[g])||(l[s[g]]=g!==h[1][m]?{type:"empty",buttons:[]}:{type:"locked",buttons:[{label:"open "+v,command:"open "+v+" & scan"},{label:"unlock "+v,command:"unlock "+v+" & scan"},{label:"knock "+v,command:"knock "+v+" & scan"},{label:"pull lever",command:"pull lever & scan"},{label:"pound gate",command:"pound gate & scan"},{label:"move rubble",command:"move rubble & scan"},{label:"open door",command:"open door & scan"},{label:"unlock door",command:"unlock door & scan"},{label:"knock door",command:"knock door & scan"}]})}r.adjacentRooms=l,l={},c=!1,u=!1,n(function(){r.$apply("adjacentRooms"),r.$broadcast(p.events.room_changed)},0)}});var p={events:{room_changed:"AUTOSCAN_ROOM_CHANGE_DETECTED"},directionExists:function(e){return r.adjacentRooms.hasOwnProperty(e)},hasButtons:function(e){return p.directionExists(e)&&r.adjacentRooms[e].buttons.length>0},getButtons:function(e){return p.directionExists(e)?r.adjacentRooms[e].buttons:[]},$scope:r};return p}]),angular.module("clientApp").factory("keypress",["$rootScope",function(e){var t=e.$new(),n={keydown:"UNHANDLED_KEY_DOWN"};return{keyDown:function(e){t.$broadcast(n.keydown,e)},getEventKey:function(e){var t=e.which;switch(t){case 9:return"tab";case 13:return"enter";case 27:return"esc";case 32:return"space";case 33:return"pageup";case 34:return"pagedown";case 37:return"left";case 38:return"up";case 39:return"right";case 40:return"down";case 192:return"tilde"}return t>=48&&57>=t?t-48:"unknown"},$scope:t,events:n}}]),angular.module("clientApp").factory("buttons",["$rootScope","autoscan","$timeout",function(e,t,n){var r=[{label:"fireball",command:"cast fireball"},{label:"lightning",command:"cast lightning bolt"},{label:"acid blast",command:"cast acid blast"},{label:"mists",command:"cast mists of sleep"},{label:"freeze",command:"cast freeze"}],i=e.$new();i.aActiveButtons=r,i.buttonSet="";var o=function(){n(function(){i.$apply("aActiveButtons")},0)},a={$scope:i,setDirectionButtons:function(e){var n=t.getButtons(e);n.length&&(i.aActiveButtons=n,i.buttonSet=e,o())},resetButtons:function(){""!==i.buttonSet&&(i.aActiveButtons=r,i.buttonSet="",o())}};return a}]);