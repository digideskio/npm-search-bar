// Main renderer code
// https://github.com/kevinsawicki/tray-example for ideas...

var request = require('request')
  , $ = require('jquery')
  , ejs = require('ejs')
  , shell = require('electron').shell
  , path = require('path')
  , ipcRenderer = require('electron').ipcRenderer
  , remote = require('electron').remote
  , contextMenu
  ;

// Attach listeners
ipcRenderer.on('focus-search-box', focusSearchBoxListener)

// Send query to npm and fire cb
function querynpm(query, cb){
  /*

  { "results":[
      {"name":["redux-form"],"rating":[10],"description":["A higher order component decorator for forms using Redux and React"]},
      {"name":["marko"],"rating":[10],"description":["Marko is an extensible, streaming, asynchronous, high performance, HTML-based templating language that can be used in Node.js or in the browser."]},
      {"name":["grunt-typescript"],"rating":[10],"description":["compile typescript to javascript"]}
    ],
    "total":17381,
    "size":3,
    "from":0}

  */

  // Only returns top 10
  var searchUrl = 'http://npmsearch.com/query?q={query}&fields=name,description,rating'+
                  '&rows=100&sort=rating:desc'

  var url = searchUrl.replace('{query}', encodeURI(query))

  console.log('querying npm with the url: ' + url)

  request(url, function(err,response,data){
    if(err) {
      return cb(err)
    }
    cb(null, data)
  })

}

function ipcSendKill(){
  ipcRenderer.send('quit-app', true)
}

function ipcSendRunAtStartup(){
  // check the checkbox for its value
  console.log(contextMenu.items[0].checked + " is checked after click")
  var isChecked = ( contextMenu.items[0].checked ? true : false) 
  ipcRenderer.send('run-at-startup', isChecked)
}

// Let's go...
$(function(){

  var Menu = remote.Menu

  // show context menu
  contextMenu = Menu.buildFromTemplate([
    {label: 'Run at Startup', type: 'checkbox', checked: false, click: ipcSendRunAtStartup},
    {type: 'separator'},
    {label: 'Quit', type: 'normal', click: ipcSendKill },
    ])

  $('#settings').on('click', function(e){
    contextMenu.popup(remote.getCurrentWindow())
    e.preventDefault()
  })

  $('#reset').on('click', function(e){
    clearResults()
    e.preventDefault()
  })
  
  $('#search').on('click', function(e){

    var q = $('#query').val()

    if(q){
      querynpm(q, function(err,data){
        if(err) console.error(err)
        else {
          var parsedData = JSON.parse(data)
          $('#results').children().remove()
          renderResults(parsedData)
        }
      }) // end querynpm
    }
    e.preventDefault()
    return false

  }) // end on click search

  // Open links in external browser
  document.addEventListener('click', function(event){
    if (event.target.href) {
      // Open links in external browser
      shell.openExternal(event.target.href)
      event.preventDefault()
    }
  })

}) // end DOM Ready

// Reset...
function clearResults(){ 
  $('#results').children().remove()
  $('#query').val('') 
}

// utility for determining float number
function isFloat(n){
    return Number(n) === n && n % 1 !== 0;
}

// Basic EJS template for the results.
function renderResults(data){

  // Make rating more precise
  data.results.forEach(function(el){
    if( isFloat(el.rating[0]) ){
      el.rating[0] = (el.rating[0]).toFixed(2)
    }
  })

  var filename = path.resolve(__dirname, "templates", "results.ejs")
  
  return ejs.renderFile(filename, data, null, function(err, str){
    $('#results').append(str)
  })

}

// Apply focus to search box
function focusSearchBoxListener(){ $('#query').val('').focus() }


