/**
 * lastfm_panel namespace.
 */
if ("undefined" == typeof(lastfm_panel)) {
  var lastfm_panel = {};
};

lastfm_panel.sibPref = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);

lastfm_panel.BrowserOverlay = {

  resizePanel: function(){ //resize the panel with the preference %.
    var panelWidth = lastfm_panel.sibPref.getIntPref("extensions.lastfm_panel.panelWidth")/100;
    var panelHeight = lastfm_panel.sibPref.getIntPref("extensions.lastfm_panel.panelHeight")/100;
    var panel = document.getElementById("lastfm-panel");
    panel.sizeTo(window.screen.availWidth*panelWidth,window.screen.availHeight*panelHeight);
  },
  
  setlastfmIframe: function(){ //set the iframe src.
    var mainWindow = window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
                     .getInterface(Components.interfaces.nsIWebNavigation)
                     .QueryInterface(Components.interfaces.nsIDocShellTreeItem)
                     .rootTreeItem
                     .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
                     .getInterface(Components.interfaces.nsIDOMWindow);

    var lastfmIframe = mainWindow.document.getElementById("lastfm-iframe");
    var lastfmMode = lastfm_panel.sibPref.getBoolPref("extensions.lastfm_panel.useTheGmailVersion");
    var lastfmURL = ("http://last.fm");
    lastfmIframe.webNavigation.loadURI(lastfmURL,Components.interfaces.nsIWebNavigation,null,null,null);
    
  },
  
  pinlastfmPanel: function (){
    var panel = document.getElementById("lastfm-panel");
    var noautohide = lastfm_panel.sibPref.getBoolPref("extensions.lastfm_panel.noautohide");
    panel.setAttribute("noautohide", noautohide);
    var pinButton = document.getElementById("lastfm-toolbarButton_pin");
    pinButton.checked = noautohide;
  },
  
  changePinMode: function (){
    pinMode = document.getElementById("lastfm-toolbarButton_pin").checked;
    lastfm_panel.sibPref.setBoolPref("extensions.lastfm_panel.noautohide", pinMode);
    lastfm_panel.BrowserOverlay.pinlastfmPanel();
    //Need to close and reopen the panel to make the change take effect.
    var panel = document.getElementById("lastfm-panel");
    panel.hidePopup();
    var button = document.getElementById("lastfm-toolbar-button");
    panel.openPopup(button, "", 0, 0, false, false);
  },
  
  autoHideToolbar: function (){
    var panelToolbar = document.getElementById("lastfm-panel-toolbar");
    var toolbarAutoHide = lastfm_panel.sibPref.getBoolPref("extensions.lastfm_panel.toolbarAutoHide");
    if(toolbarAutoHide){
      panelToolbar.classList.add("lastfm-toolbar-class-hide");
      panelToolbar.classList.remove("lastfm-toolbar-class-show");
    }else{
      panelToolbar.classList.add("lastfm-toolbar-class-show");
      panelToolbar.classList.remove("lastfm-toolbar-class-hide");
    };
    var autoHideButton = document.getElementById("lastfm-toolbarButton_autoHide");
    autoHideButton.checked = toolbarAutoHide;
  },
  
  changeAutoHideMode: function (){
    pinMode = document.getElementById("lastfm-toolbarButton_autoHide").checked;
    lastfm_panel.sibPref.setBoolPref("extensions.lastfm_panel.toolbarAutoHide", pinMode);
    lastfm_panel.BrowserOverlay.autoHideToolbar();
    //Need to close and reopen the panel to make the change take effect.
    var panel = document.getElementById("lastfm-panel");
    panel.hidePopup();
    var button = document.getElementById("lastfm-toolbar-button");
    panel.openPopup(button, "", 0, 0, false, false);
  },
  
  goBack: function (){
    var mainWindow = window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
                     .getInterface(Components.interfaces.nsIWebNavigation)
                     .QueryInterface(Components.interfaces.nsIDocShellTreeItem)
                     .rootTreeItem
                     .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
                     .getInterface(Components.interfaces.nsIDOMWindow);
    
    var lastfmIframe = mainWindow.document.getElementById("lastfm-iframe");
    if(lastfmIframe.webNavigation.canGoBack){
      lastfmIframe.webNavigation.goBack();
    }else{
      var lastfmStringsBundle = document.getElementById("lastfm-string-bundle");    
      var cantGoBack = lastfmStringsBundle.getString('cantGoBack');
      alert(cantGoBack);
    };
  },
  
  goForward: function (){
    var mainWindow = window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
                     .getInterface(Components.interfaces.nsIWebNavigation)
                     .QueryInterface(Components.interfaces.nsIDocShellTreeItem)
                     .rootTreeItem
                     .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
                     .getInterface(Components.interfaces.nsIDOMWindow);
    
    var lastfmIframe = mainWindow.document.getElementById("lastfm-iframe");
    if(lastfmIframe.webNavigation.canGoForward){
      lastfmIframe.webNavigation.goForward();
    }else{
      var lastfmStringsBundle = document.getElementById("lastfm-string-bundle");    
      var cantGoForward = lastfmStringsBundle.getString('cantGoForward');
      alert(cantGoForward);
    };
  },
  
  openlastfmPanel: function (){
    window.clearTimeout(delayFirstRunTimeOut);
  
    lastfm_panel.BrowserOverlay.resizePanel();
    lastfm_panel.BrowserOverlay.pinlastfmPanel();
    lastfm_panel.BrowserOverlay.autoHideToolbar();
    
    var mainWindow = window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
                     .getInterface(Components.interfaces.nsIWebNavigation)
                     .QueryInterface(Components.interfaces.nsIDocShellTreeItem)
                     .rootTreeItem
                     .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
                     .getInterface(Components.interfaces.nsIDOMWindow);

    var lastfmIframe = mainWindow.document.getElementById("lastfm-iframe");
    if(lastfmIframe.src == "chrome://lastfm_panel/content/lastfm-loading.xul"){ 
      //if the user opens the panel before it is loaded for the first time, I load it.
      //if it's loaded, I do nothing, because it's pretty annoying loading every time you open the panel because the load has a little delay. Also, you might lose information.
      lastfm_panel.BrowserOverlay.setlastfmIframe();
    };
    
  },
  
  installButton: function(toolbarId, id){
    if (!document.getElementById(id)){
        var toolbar = document.getElementById(toolbarId);
        var before = null;
        toolbar.insertItem(id, before);
        toolbar.setAttribute("currentset", toolbar.currentSet);
        document.persist(toolbar.id, "currentset");
    };
  },
  
  lastfmShortcut_cmd: function(){ //opens the panel with the shortcut.
    var panel = document.getElementById("lastfm-panel");
    var button = document.getElementById("lastfm-toolbar-button");
    if(panel.state == "closed"){
      panel.openPopup(button, "", 0, 0, false, false);
    }else{
      panel.hidePopup();
    };
  },
  
  initKeyset: function(){ //On Firefox loads sets the shortcut keys.
    var modifiers = lastfm_panel.sibPref.getCharPref("extensions.lastfm_panel.modfiers");
    var key = lastfm_panel.sibPref.getCharPref("extensions.lastfm_panel.key");
    var keyset = document.getElementById("lastfm-shortcut_cmd");
    keyset.setAttribute("modifiers",modifiers);
    keyset.setAttribute("key",key);
  },
  
  onFirefoxLoad: function(event){
    window.removeEventListener("load", function () { lastfm_panel.BrowserOverlay.onFirefoxLoad(); }, false);
    var isFirstRunPref = lastfm_panel.sibPref.getBoolPref("extensions.lastfm_panel.isFirstRun");
    if (isFirstRunPref){
      lastfm_panel.BrowserOverlay.installButton("nav-bar", "lastfm-toolbar-button");
      lastfm_panel.sibPref.setBoolPref("extensions.lastfm_panel.isFirstRun", false);
    };
    lastfm_panel.BrowserOverlay.initKeyset(); //initiate the button's keyboard shortcut.
  },

};

window.addEventListener("load", function () { lastfm_panel.BrowserOverlay.onFirefoxLoad(); }, false);

delayFirstRunTimeOut = setTimeout(function() {lastfm_panel.BrowserOverlay.setlastfmIframe(); }, 
           lastfm_panel.sibPref.getIntPref("extensions.lastfm_panel.delayFirstRun")*
           1000); //Delay the first iframe load.