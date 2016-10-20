// In renderer process (web page).
const {ipcRenderer} = require('electron');

const tab = [];


window.onresize = doLayout;
var isLoading = false;

onload = function() {
  const webview = document.querySelector('webview');
  //doLayout();

  tab.push(webview);

  console.log(tab[0]);

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
    webview.goBack();
  };

  document.querySelector('#url-forward').onclick = function() {
    webview.goForward();
  };

  document.querySelector('#url-home').onclick = function() {
    navigateTo('http://www.github.com/');
  };

  document.querySelector('#url-reload').onclick = function() {
    if (isLoading) {
      webview.stop();
    } else {
      webview.reload();
    }
  };
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

  webview.addEventListener('close', handleExit);
  webview.addEventListener('did-start-loading', handleLoadStart);
  webview.addEventListener('did-stop-loading', handleLoadStop);
  webview.addEventListener('did-fail-load', handleLoadAbort);
  webview.addEventListener('did-get-redirect-request', handleLoadRedirect);
  webview.addEventListener('did-finish-load', handleLoadCommit);
  webview.addEventListener('page-favicon-updated', handleLoadFavicon);

};

function navigateTo(url) {
  resetExitedState();
  document.querySelector('webview').src = url;
}

function doLayout() {
  var webview = document.querySelector('webview');
  var controls = document.querySelector('#browser-actions');
  var controlsHeight = controls.offsetHeight;
  var windowWidth = document.documentElement.clientWidth;
  var windowHeight = document.documentElement.clientHeight;
  var webviewWidth = windowWidth;
  var webviewHeight = windowHeight - controlsHeight - controlsHeight;

  webview.style.width = webviewWidth + 'px';
  webview.style.height = webviewHeight + 'px';

}

/*---------------------- Handle webview events ------------*/
function handleExit(){}
function handleLoadStart(){}
function handleLoadStop(){}
function handleLoadAbort(){}
function handleLoadFavicon(event){
  console.log(event);
}
function handleLoadCommit() {
  var webview = document.querySelector('webview');
  document.querySelector('#location').value = webview.getURL();
}

function handleLoadRedirect(event) {
  document.querySelector('#location').value = event.newUrl;
}
