// In renderer process (web page).
const {ipcRenderer} = require('electron');
let browserView;
let currentTab;


const tabs = [];
tabs.push = function() { Array.prototype.push.apply(this, arguments);  tabEvent();};


window.onresize = doLayout;
var isLoading = false;

onload = function() {
  //const webview = document.querySelector('webview');
  browserView = document.querySelector("#browser-webview");
  //doLayout();

  newWebview("http://github.com");

  $("#tab-add")[0].addEventListener('click',function(){
    addTab("http://github.com");
  },false);

  $("#frame-close")[0].addEventListener('click',function(){
    ipcRenderer.send('frame-action', 'close');
  },false);
  $("#frame-min")[0].addEventListener('click',function(){
    ipcRenderer.send('frame-action', 'min');
  },false);
  $("#frame-max")[0].addEventListener('click',function(){
    ipcRenderer.send('frame-action', 'max');
  },false);


  document.querySelector('#url-back').onclick = function() {
    //webview.goBack();
  };

  document.querySelector('#url-forward').onclick = function() {
    //webview.goForward();
  };

  document.querySelector('#url-home').onclick = function() {
    navigateTo('http://www.github.com/');
  };

  /*document.querySelector('#url-reload').onclick = function() {
    if (isLoading) {
      webview.stop();
    } else {
      webview.reload();
    }
  };*/
  document.querySelector('#url-reload').addEventListener(
    'webkitAnimationIteration',
    function() {
      if (!isLoading) {
        document.body.classList.remove('loading');
      }
    });

  $('#location-form').on("submit", function(e) {
    e.preventDefault();
    let query = $('#location').val();
    parseUrl(query);
  });

};

function parseUrl(url){
  let query = require('url').parse(url);
  //console.log(query);

  if (query.protocol) {
    if(query.hostname.indexOf('.') > -1){
      navigateTo(query.href);
    }else{
      navigateTo("https://www.google.de/search?q=" + url);
    }
  }else{
    query.href = "http://" + query.href;
    parseUrl(query.href);
  }
}

function navigateTo(url) {
  $(currentTab).attr("src", url);
}

function doLayout(webview) {
  //var view = getWebview(currentTab.id);
  var webview = getWebview(currentTab.id);
  var controlsHeight = document.querySelector('#browser-actions').offsetHeight;
  var windowWidth = document.documentElement.clientWidth;
  var windowHeight = document.documentElement.clientHeight;
  var webviewWidth = windowWidth;
  var webviewHeight = windowHeight - controlsHeight - controlsHeight;

  //$(view).css({"width": webviewWidth + 'px', "height": webviewHeight + 'px'});
  webview.style.width = webviewWidth + 'px';
  webview.style.height = webviewHeight + 'px';

}

/*---------------------- handle tab events ----------------*/
addTab = (url) => {
  newWebview(url);
}

tabEvent = () => {
  // ... this will be called on each .push
  updateTabView();
}


updateTab = (arg) =>{
  for(i = 0; i < tabs.length; i++){
    console.log(arg);
    if(tabs[i][0].id == arg.target.id){
      $(".view" + i, $(".title")).html(arg.title)
    }
  }
}

removeTab = (arg) =>{
  for(i = 0; i < tabs.length; i++){
    if(tabs[i].id == arg.target.id){
      tabs.splice(i, 1);
    }
  }
}

updateTabView = () =>{
  for (i = 0; i < tabs.length; i++) {
    if(!$(".tab#" + i).length){
      $('<div>', {'class':'tab', 'id': i})
        .append($('<div>', {'class':'icon'}).append('<img>', {'src': 'https://assets-cdn.github.com/favicon.ico'}).append($('<div>', {'class':'tab-loader'})) )
        .append($('<div>', {'class': 'title'}))
        .appendTo($("#tab-view"))
        .click(tabListener).trigger('click');
    }
  }
}

tabListener = (event) =>{
  setActiveTab(event.currentTarget);
}

setActiveTab = (target) =>{
  $(".tab").removeClass("active");
  $(target).addClass("active");
  $("webview").removeClass("hide");

  for(let view of $("webview")){
    if(view.id == target.id){
      setCurrentTab(view);
      $(view).removeClass("hide");
    }else{
      $(view).addClass("hide");
    }
  }
}

updateTabListener = (view) =>{
  view.addEventListener('close', handleExit);
  view.addEventListener('did-start-loading', handleLoadStart);
  view.addEventListener('did-stop-loading', handleLoadStop);
  view.addEventListener('did-fail-load', handleLoadAbort);
  view.addEventListener('did-get-redirect-request', handleLoadRedirect);
  view.addEventListener('did-finish-load', handleLoadCommit);
  view.addEventListener('page-favicon-updated', handleLoadFavicon);
  view.addEventListener('page-title-updated', handleLoadTitle);
}


setCurrentTab = (view) =>{
  currentTab = view;
}

/*---------------------- Handle webview events ------------*/
getWebview = (id) =>{
  for(let view of $("webview")){
    if(view.id == id){
      return view;
    }
  }
}

newWebview = (url) =>{
  let webview = $('<webview>', { 'class': 'view', 'id': tabs.length})
    .attr("src", url)
    .appendTo($("#browser-webview"));

  setCurrentTab(webview[0]);

  updateTabListener(webview[0]);
  tabs.push(webview[0]);
}


function handleExit(event){
  console.log(event);
}
function handleLoadStart(){
  $(".tab#" + event.target.id).addClass("loading");
}
function handleLoadStop(){
  $(".tab#" + event.target.id).removeClass("loading");
}
function handleLoadAbort(event){
  currentTab.attr("src", "https://google.com/");
}
function handleLoadFavicon(){
  $(".tab#" + event.target.id).children(".icon").children("img").attr("src", event.favicons[0]);
}
function handleLoadTitle(){
  //console.log(  $(".tab", $("#" + event.target.id)) );
  $(".tab#" + event.target.id).children(".title").text(event.title);
}
function handleLoadCommit() {
  //var webview = $('.view#' + event.target.id);
  $('#location').val( currentTab.getURL() );
}

function handleLoadRedirect() {
  $('#location').val(event.newUrl);
}
