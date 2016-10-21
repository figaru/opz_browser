// In renderer process (web page).
const {ipcRenderer} = require('electron');
let browserView; 
let tabView;

const tabs = [];
tabs.push = function() { Array.prototype.push.apply(this, arguments);  tabEvent();};


window.onresize = doLayout;
var isLoading = false;

onload = function() {
  //const webview = document.querySelector('webview');
  browserView = document.querySelector("#browser-webview");
  tabView = document.querySelector("#tab-view");
  //doLayout();

  newWebview("http://github.com");

  document.querySelector("#tab-add").addEventListener('click',function(){
    addTab("http://github.com");
  },false);


  document.querySelector("#frame-close").addEventListener('click',function(){
    ipcRenderer.send('frame-action', 'close');
  },false);
  document.querySelector("#frame-min").addEventListener('click',function(){
    ipcRenderer.send('frame-action', 'min');
  },false);
  document.querySelector("#frame-max").addEventListener('click',function(){
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

  document.querySelector('#location-form').onsubmit = function(e) {
    e.preventDefault();
    navigateTo(document.querySelector('#location').value);
  };

};

function navigateTo(url) {
  document.querySelector('webview').src = url;
}

function doLayout() {
  var webview = document.querySelector('webview');
  var controlsHeight = document.querySelector('#browser-actions').offsetHeight;
  var windowWidth = document.documentElement.clientWidth;
  var windowHeight = document.documentElement.clientHeight;
  var webviewWidth = windowWidth;
  var webviewHeight = windowHeight - controlsHeight - controlsHeight;

  webview.style.width = webviewWidth + 'px';
  webview.style.height = webviewHeight + 'px';

}

/*---------------------- handle tab events ----------------*/
addTab = () => {
  newWebview();
}

tabEvent = () => {
  console.log("tab changed");
  // ... this will be called on each .push
  updateTabView();
}

updateTab = (arg) =>{
  for(i = 0; i < tabs.length; i++){
    if(tabs[i].id == arg.target.id){
      let tab = document.querySelector(".view" + i);
      let title = tab.querySelector('.title');

      title.innerHTML = event.title;
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
    let exist = document.querySelector(".view" + i);
    if(!exist){
      let tab = document.createElement("div");
      tab.setAttribute("id", "tab" + i);
      tab.setAttribute("class", "tab view" + i);
      let icon = document.createElement("div");
      icon.setAttribute("class", "icon");
      let img = document.createElement("img");
      img.setAttribute("src", "https://assets-cdn.github.com/favicon.ico");
      let title = document.createElement("div");
      title.setAttribute("class", "title");

      //title.innerHTML = tabs[i].getTitle();
      icon.appendChild(img);


      tab.appendChild(icon);
      tab.appendChild(title);

      //console.log(tabs[i].getTitle());

      tabView.appendChild(tab);
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

/*---------------------- Handle webview events ------------*/
newWebview = (url) =>{
  let webview = document.createElement("webview");
  webview.setAttribute("id", "view" + tabs.length);
   webview.setAttribute("src", url);

  browserView.appendChild(webview); 

  updateTabListener(webview);
  tabs.push(webview);
}


function handleExit(event){
  console.log(event);
}
function handleLoadStart(event){
  console.log(event);
}
function handleLoadStop(event){
  console.log(event);
}
function handleLoadAbort(event){
  console.log(event);
  document.querySelector("#" + event.target.id).src = "https://google.com/";
}
function handleLoadFavicon(event){
  console.log(event);
}
function handleLoadTitle(event){
  updateTab(event);
}
function handleLoadCommit(event) {
  console.log(event);
  var webview = document.querySelector("#" + event.target.id);
  //document.querySelector('#location').value = webview.getURL();
}

function handleLoadRedirect(event) {
  console.log(event);
  document.querySelector('#location').value = event.newUrl;
}
