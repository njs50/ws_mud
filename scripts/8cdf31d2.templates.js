angular.module("templates-main",["templates/movementButtons.tpl.html"]),angular.module("templates/movementButtons.tpl.html",[]).run(["$templateCache",function(t){t.put("templates/movementButtons.tpl.html",'<table ng-controller="ScanCtrl">\n  <tbody>\n    <tr>\n      <td><button scan-direction="up"></button></td>\n      <td></td>\n      <td><button scan-direction="north"></button></td>\n      <td></td>\n      <td><button scan-direction="refresh"></button></td>\n    </tr>\n    <tr>\n      <td></td>\n      <td><button scan-direction="west"></button></td>\n      <td></td>\n      <td><button scan-direction="east"></button></td>\n      <td></td>\n    </tr>\n    <tr>\n      <td><button scan-direction="down"></button></td>\n      <td></td>\n      <td><button scan-direction="south"></button></td>\n      <td></td>\n      <td><button scan-direction="here"></button></td>\n    </tr>\n  </tbody>\n</table>\n')}]);