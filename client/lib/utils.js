/*globals _ GlobalSettings mpq OAuth google timezoneJS*/
var Utils={}; //Utils global namespace object

//some constants
Utils.MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
Utils.MONTHS_ABBR = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
Utils.DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
Utils.DAYS_ABBR = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
Utils.ONE_HOUR = 1000*60*60; //milliseconds
Utils.ONE_DAY = 1000*60*60*24; //milliseconds
Utils.ONE_WEEK = 1000*60*60*24*7; //milliseconds
Utils.HALF_YEAR = 1000*60*60*24*180; //milliseconds
Utils.ONE_YEAR = 1000*60*60*24*365; //milliseconds

Utils.posWord = function() {
  positive_words = [
    "Bingo",
    "Yahtzee",
    "Cool",
    "Shazam",
    "Bam",
    "Boom",
    "Kabam",
    "Kazam",
    "Yippee",
    "Sweet",
    "Awesome",
    "Gnarly",
    "Rad",
    "Fantastic",
    "Delightful",
    "Booyah",
    "Giddy Up",
    "Nice",
    "Woot",
    "Peachy",
    "Swell",
    "All right",
    "Eureka",
    "Great",
    "Marvelous",
    "Sensational",
    "Superb",
    "Outstanding",
    "Spectacular",
    "Glorious",
    "Neat",
    "Nifty",
    "Splendid",
    "Stupendous",
    "Dynamite",
    "Phenomenal",
    "Terrific",
    "Tremendous",
    "Wonderous",
    "Wonderful"];
    random_index = Math.floor(Math.random()*(positive_words.length + 1));
    return positive_words[random_index];
    
};

Utils.isToday = function(date){
  var date= new Date(date); 
  var today = new Date();
  
  if((date.getFullYear() === today.getFullYear()) &&
    (date.getMonth() === today.getMonth()) &&
    (date.getDate() === today.getDate())){
      return true;
  }else{
    return false;
  }
};

Utils.fromMHour = function(h){
  h = parseInt(h);
  if(h==0){
    return 12;
  }
  if(h>12){
    return h-12;
  }
  return h;
};

Utils.toMHour = function(h, am){
  h = parseInt(h);
  if(h==12 && am){
    return 0;
  }
  if(!am && h!=12){
    return h+12;
  }

  return h;
};

Utils.ago = function(t){
  var d = new Date() - t;
  if(d<Utils.ONE_HOUR){
    return Math.round(d/(1000*60))+'m ago';
  }else if(d<Utils.ONE_DAY){
    return Math.round(d/Utils.ONE_HOUR)+'h ago';
  }else{
    return Math.round(d/Utils.ONE_DAY)+'d ago';
  }
};

String.prototype.format = function() {
  var args = arguments;
  return this.replace(/\{(\d+)\}/g, function(match, number) {
    return typeof args[number] !== 'undefined'
      ? args[number]
      : match
    ;
  });
};

String.prototype.initialCap = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

Utils.digits = function(n, d){
  var ret = n.toString();
  var i;
  for(i=ret.length; i<d; i++){
    ret = "0"+ret;
  }
  return ret;
};
Utils.clearSelection = function() {
    if(document.selection && document.selection.empty) {
        document.selection.empty();
    } else if(window.getSelection) {
        var sel = window.getSelection();
        sel.removeAllRanges();
    }
};

Utils.genId = function(){
  return "id" + Math.floor(Math.random()*1000000000);
};

Utils.genInt = function(){
  return Math.floor(Math.random()*1000000000);
};

Utils.stringToDate = function(str){
  var dateItems = str.split(/-/);
  if(dateItems && dateItems.length===3){
//    return new timezoneJS.Date(dateItems[0], dateItems[1]-1, dateItems[2], GlobalSettings.userTimezone);
    return new Date(dateItems[0], dateItems[1]-1, dateItems[2]);
  }else{
    return null;
  }
};

Utils.slice = function(obj){
  var ret = {};
  for(var i=1; i<arguments.length; i++){
    if(arguments[i] in obj){
      ret[arguments[i]] = obj[arguments[i]];
    }
  }
  return ret;
};

Utils.aToO = function(k,v){
  var ret={};
  if(v===undefined) v=[];
  for(var i=0; i<k.length; i++){
    ret[k[i]] = v[i];
  }
  return ret;
};

//returns true if mobile useragent or cookie
Utils.mobile= function(){
  return Utils.mobile.isMobile();
};
Utils.mobile.COOKIESTR = "show_mobile";
//returns true if currently in a mobile browser
Utils.mobile.isMobileBrowser = function(){
  return (/iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase()));
};

Utils.mobile.isMobile = function(){
  var cookie = $.cookie(Utils.mobile.COOKIESTR);
  if(cookie){
    if(cookie === "true"){
      return true;
    }else if (cookie==="false"){
      return false;
    }
  }
  if(Utils.mobile.isMobileBrowser()){
    Utils.mobile.setMobile();
    return true;
  }
  Utils.mobile.clearMobile();
  return false;
};
Utils.mobile.setMobile = function(){
  $.cookie(Utils.mobile.COOKIESTR, "true", {path : "/", expires : 14});
};
Utils.mobile.clearMobile = function(){
  $.cookie(Utils.mobile.COOKIESTR, "false", {path : "/", expires : 14});
};


//returns a function that will execute f after delay, but resets the count every
//time the function is called.  Useful for loading on keyup events when you
//don't want to load during typing.  f can be a function or a string.  If it is
//a string we examine the context when the function is called for a member f
Utils.keyupTimeout = function(f, delay){
  var timeout;
  var ev;
  var self;
  var execAndClear = function(){
    timeout=null;
    f.call(self, ev);
  };
  return function(e){
    ev=e;
    self=this;
    if(_.isString(f)){  //look for it in the current context
      f = this[f];
    }
    if(timeout){
      clearTimeout(timeout);
    }
    timeout = setTimeout(execAndClear, delay);
  };
};

Utils.url_parse = function(url){
  if(url===undefined){
    url = document.location.href;
  }
  var m = url.match(/(\w+):\/\/([^\/]+)([^?#]+)(\?[^#]*)?#?(.*)/);
  var ret={};
  ret.url = m[0];
  ret.protocol = m[1];
  ret.domain_full = m[2];
  ret.path = m[3];
  ret.args_full = m[4];
  ret.anchor=decodeURIComponent(m[5]);

  var s = ret.domain_full.split(".");
  ret.tld=s[s.length-1];
  ret.domain = s.slice(s.length-2, s.length).join('.');
  if(s.length>2)
    ret.subdomain = s.slice(0,s.length-2).join('.');
  ret.args={};
  if(ret.args_full){
    var args = ret.args_full.slice(1,ret.args_full.length).split("&");
    args.forEach(function(e){
        var a = e.split("=");
        ret.args[decodeURIComponent(a[0])]=decodeURIComponent(a[1]);
    });
  }

  return ret;
};

//jquery plugin to turn urls into links in a DOM element
$.fn.linkify = function(options){
  options = options ||{};
  this.each(function(){
    var content, regex, m, output, accum, index, newstr, shortened, original, fixed;
    content = $(this).html();
    regex = /(((\w+):\/\/)?([^#\/\s("'<>]+@)?([a-zA-z0-9%\-]+\.)+([a-zA-z0-9%\-]+)([^\s"'<>]*[^.\s"'<>])?)/g;
    m = regex.exec(content);
    output = content;
    accum = 0;
    while(m){
      index = m.index+accum;
      original = m[0];
      //if the whole thing is surrounded by parens, ignore the last paren
      if((content[m.index-1]==="(") && (original[original.length-1]===")")){
        original = original.slice(0,original.length-1);
      }
      //if there is a protocol, leave it, otherwise if there is a user name@ it's an email, otherwise affix http://
      fixed = m[2] ? original : m[4] ? 'mailto:'+original : 'http://'+original;
      if(options.embedImages && fixed.match(/\.jpg$/)){ //TODO other image formats?
        shortened = '<img src="{0}">'.format(fixed);
      }else{
        shortened = m[2]?original.slice(m[2].length):original;  //get rid of protocol
        shortened = shortened.length>30?shortened.slice(0,27)+"...":shortened;
      }
      newstr = '<a href="{0}" target="_blank" title="{0}">{1}</a>'.format(fixed, shortened);
      output = output.slice(0,index)+newstr+output.slice(index+original.length);
      accum += newstr.length-original.length;
      m = regex.exec(content);
    }
    $(this).html(output);
    return this;
  });
  return this;
};


Utils.getArg = function(a, s){
  var args = a.split("&");
  for(var i=0; i<args.length; i++){
    var m = args[i].match(/([^=])=(.*)/);
    if(m){
      if(m[1]===s){
        return m[2];
      }
    }
  }
};

Utils.convDate = function(datestr, opts){
  var options = $.extend({prefix:false, dateOnly:false, timeOnly:false, abbreviate:true,dmd:false}, opts);
  var Days = options.abbreviate?Utils.DAYS_ABBR:Utils.DAYS;
  var Months = options.abbreviate?Utils.MONTHS_ABBR:Utils.MONTHS;

  var date=null;
  var today = new Date();
  var newdate = "";

  if(!datestr){
    return "";
  }
  //handle YYYY-MM-DD specially because the default conversion uses timezones in a dumb way
  if(_.isString(datestr)){
    var dateItems = datestr.split(/-/);
    if(dateItems.length===3){
      date = new Date(dateItems[0], dateItems[1]-1, dateItems[2]);
    }
  }
  if(!date){
    date = new Date(datestr);
  }
  var h = date.getHours();
  var m = date.getMinutes();
  var ampm = h>=12?"PM":"AM";
  if(h>12)
    h-=12;
  if(h===0)
    h=12;

  if(options.timeOnly ||
     ((date.getFullYear() === today.getFullYear()) &&
      (date.getMonth() === today.getMonth()) &&
      (date.getDate() === today.getDate()))){
    if(options.dateOnly){
      newdate = "Today";
      if(options.dmd){
        newdate = newdate + ", {0} {1}".format(Months[date.getMonth()], date.getDate());
      }
    }else{
      newdate = h+":"+(m<10?"0":"")+m+" "+ampm;
      if(options.showTime){
        newdate = "Today at " + newdate;
      }
    }
  }else if(Math.abs(today-date) < (Utils.ONE_DAY)){
    if(today<date){
      newdate = "Tomorrow";
    }else{
      newdate = "Yesterday";
    }
    if(options.dmd){
      newdate = newdate + ", {0} {1}".format(Months[date.getMonth()], date.getDate());
    }
    if(!options.dateOnly){
      newdate_time = h+":"+(m<10?"0":"")+m+" "+ampm;
      newdate += " at " + newdate_time;
    }
  }else if(Math.abs(today-date) < (Utils.ONE_DAY*6)){
    newdate = Days[date.getDay()];
    if(options.dmd){
      newdate = newdate + ", {0} {1}".format(Months[date.getMonth()], date.getDate());
    }
    if(options.sayWhen){ 
      if(today>date){
        newdate = "Last " + newdate;
      }else{
        newdate = "On " + newdate;
      }
    }
    if(!options.dateOnly){
      if(options.showTime){
        newdate+=" at "+h+":"+(m<10?"0":"")+m+" "+ampm;
      }else{
        newdate+=" at "+h+" "+ampm;
      }
    }
    if(options.prefix){
      newdate = "On " + newdate;
    }
  }else if(Math.abs(today-date) < Utils.ONE_YEAR){
    if(options.dmd){
      newdate = Days[date.getDay()] + ", " + Months[date.getMonth()]+" "+date.getDate();
    }else{
      newdate = Months[date.getMonth()]+" "+date.getDate();
    }
    if(options.prefix){
      newdate = "on " + newdate;
    }
    if(options.showTime){
      newdate+=" at "+h+":"+(m<10?"0":"")+m+" "+ampm;
    }
  }else{
    if(options.dmd){
      newdate = Days[date.getDay()] + ", " + Months[date.getMonth()]+" "+date.getDate()+", "+date.getFullYear();
    }else{
      newdate = Months[date.getMonth()]+" "+date.getDate()+", "+date.getFullYear();
    }
    if(options.prefix){
      newdate = "on " + newdate;
    }
  }
  return newdate;
};

//This stuff is defunct, there is a better linkify function below
Utils.is_link = function(text){
  var _linkExp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
  if(text.match(_linkExp)){
    return true;
  }else{
    return false;
  }
};
Utils.text_to_link = function(text) {
  var _linkExp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
  if(text){
    return text.replace(_linkExp,"<a href='$1' target='_top'>$1</a>");
  }else{
    return "";
  }
};

//given text will replace any text that looks like a link with html for a link
//also escapes html
Utils.linkify = function(t){
  return Utils.text_to_link(
    String(t).replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/'/g, "&#x27;")
    .replace(/"/g, "&quot;")
  );
};


//Singleton helper object
Utils.Singleton = function(){
};
Utils.Singleton.prototype = {
  _singletons:{},
  destroy:function(className){
    delete this._singletons[className];
  },

  create:function(className, obj){
    if(this._singletons[className]){
      throw className+" object already exists";
    }else{
      if(obj){
        this._singletons[className] = obj;
      }else{
        throw "Object must evaluate to true, got:" + obj;
      }
    }
  },

  get:function(className){
    return this._singletons[className];
  },
};

Utils.Mixtrack = function(trackevent, options){
  if(App.currentUser.signedIn()){
    options.user_state = "Logged_In";
    if(App.currentUser.id){
      options.distinct_id = App.currentUser.id;
    }
  }else{
    options.user_state = "Logged_Out";
  }
  
  if(Utils.mobile()){
    if(GlobalSettings.isApp){
      options.platform = "mobile_app";
    }
    else{
      options.platform = "mobile";
    }
  }else{
    options.platform = "non-mobile";
  }
  
  if(GlobalSettings.deployment==="live"){
    if(mpq && mpq.track){
      mpq.track(trackevent,options);
    }else{
      App.logger.log('error', 'mpq.track is not defined');
    }
  }else{
    App.logger.log('debug', 'Mixtrack (not sent): ' + trackevent);
    if(mpq && mpq.track){
      mpq.track(trackevent,options);
    }else{
      App.logger.log('error', 'mpq.track is not defined');
    }
  }
  
};


Utils.Logger = function(options){
  var defaults = {
    categories:{error:true, warning:true, info:true, debug:true}, //this is only for category initialization
    showAll:false,
  };
  this.options = $.extend({}, defaults, options);
  this.categories = $.extend({},this.options.categories); //copy
};

Utils.Logger.prototype = {
  log:function(category, item){
    if(this.options.showAll || this.options.categories[category]){
      console.log(item);
      var lb = $('#logbox');
      if(lb.length){
        lb.val(lb.val()+'\n'+item);
      }
    }
  },
  setOptions:function(options){
    $.extend(this.options,options);
  },
  enable:function(category){
    if(category){
      this.categories[category] = true;
    }else{
      this.options.showAll = true;
    }
  },
  disable:function(category){
    if(category){
      this.categories[category] = false;
    }else{
      this.options.showAll = false;
    }
  },
};

//Android 2 has some fairly stupid quirks but is very common, so we have a special function to detect it
//returns true if detected
Utils.detectAndroid2 = function(){
  if(navigator.userAgent.match(/Android\s*2/)){
    return true;
  }
  return false;
};

Utils.isAndroid = function(){
  if(navigator.userAgent.match(/Android/)){
    return true;
  }
  return false;
};

Utils.isIphone = function(){
  if(navigator.userAgent.match(/iPhone/)){
    return true;
  }
  return false;
};

Utils.isIpad = function(){
  if(navigator.userAgent.match(/iPad/)){
    return true;
  }
  return false;
};

Utils.isIos = function(){
  return Utils.isIphone() || Utils.isIpad();
};

Utils.uploadSupported = function(){
  return !Utils.isIos();
};

Utils.captureImageSupported = function(){
  return navigator && navigator.device && navigator.device.capture && navigator.device.capture.captureImage;
};
Utils.getPictureSupported = function(){
  return navigator && navigator.camera && navigator.camera.getPicture;
};
Utils.touchStartEvent = function(){
  if(Utils.isIphone()){
    return 'touchstart';
  }else{
    return 'click';
  }
};

Utils.Index = function(options){
  var defaults = {
    getIndex:function(){return [this];},
    getSearchTerm:function(){return this;}
  };
  this.options = _.extend({}, defaults, options);
  this._index = [];
  for(var i=0; i<26; i++){
    this._index[i] = [];
  }
};

_.extend(Utils.Index.prototype, {
  add:function(items){
    if(!_.isArray(items)){
      items = [items];
    }
    for(var i=0; i<items.length; i++){
      var indices = this.options.getIndex.call(items[i]);
      var codes = [];
      for(var j=0; j<indices.length; j++){
        var code = this._getCode(indices[j]);
        //don't push multiple times
        if($.inArray(code, codes)<0){
          codes.push(code);
          this._index[code].push(items[i]);
        }
      }
    }
  },
  search:function(q){
    var code = this._getCode(q);
    var ret = [];
    var list = this._index[code];
    var l = list.length;
    q = q.toUpperCase();
    for(var i=0; i<l; i++){
      if(this.options.getSearchTerm.call(list[i]).toUpperCase().indexOf(q)>=0){
        ret.push(list[i]);
      }
//      var indices = this.options.getIndex.call(list[i]);
//      for(var j=0; j<indices.length; j++){
//        if(indices[j].toUpperCase().indexOf(q)===0){
//          ret.push(list[i]);
//          break;
//        }
//      }
    }
    return ret;
  },

  _getCode:function(word){
    var code = word[0].toUpperCase().charCodeAt(0)-65;
    if(code<0){
      code=23; //x
    }
    if(code>=26){
      code=25;  //z
    }
    return code;
  },
});

$.fn.autoGrow = function(options){
  options = options || {};
  var $self = this;
  $self.css({'overflow':'hidden', 'resize':'none'});
  var resize = function(){
    $self.height(0);
    $self.height($self[0].scrollHeight);
  };
  var delayResize = function(){
    setTimeout(resize, 0);
  };
  var handleKey = function(e){
    //enter submit, ctrl/shift+enter = enter
    if(e.keyCode===13 && !e.ctrlKey && !e.shiftKey){
      $(e.currentTarget).parents('form').submit();
      return false;
    }
    return true;
  };
    
  $self.on('keydown cut paste drop', delayResize);
  $self.on('change', resize);
  if(options.captureReturn){
    $self.on('keypress', handleKey);
  }
  resize.call(this);
};

jQuery.fn.visible = function() {
    return this.css('visibility', 'visible');
};

jQuery.fn.invisible = function() {
    return this.css('visibility', 'hidden');
};
