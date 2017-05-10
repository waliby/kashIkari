/**
 * Created by waliby on 28.10.2015.
 * 0.36.8 
 */
var $btnPlus = $("#btnAddPret");

var fs = require('fs');
const remote = require('remote');
const app = remote.require('app');

//const BrowserWindow = remote.BrowserWindow;
console.log(fs);
console.log(process);
console.log(app.getAppPath() + "/../../");
console.log(app.getAppPath());
console.log(app.getName());
console.log(app.getPath("appData"));
console.log(app.getPath("userData"));

//remote.getCurrentWindow.appendFile("test.txt", "salut \n");
fs.readdir(app.getAppPath() + "/../", function(err, file){
  console.log(file)
});
