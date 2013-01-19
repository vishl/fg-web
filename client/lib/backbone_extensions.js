/*Copyright 2012 Vishal Parikh*/
/*global Backbone _ Utils App*/
////////////////////////////////// Backbone Extensions /////////////////////////
//This overrides the toJSON function to always insert the authenticity token
//Backbone.Model.prototype.toJSON = function() {
//  return _(_.clone(this.attributes)).extend({
//      'authenticity_token' : $('meta[name="csrf-token"]').attr('content')
//  });
//};

//inject server data as if we just finished a 'fetch' operation
//useful if the server sends additional data with another object
//(e.g. Retriving a post also sends comments for that post)
Backbone.Model.prototype.inject = function(resp, xhr, options){
  if(!this.set(this.parse(resp, xhr), options)){
    return false;
  }
  if(_.isFunction(this.afterParse)){
    this.afterParse();
  }
  return true;
};

//If we get ajax errors, prompt the user to retry the save
Backbone.Model.prototype.saveRetry = function(attrs, options){
  var self=this;
  options = options || {};
  var autoreload = new App.Utils.Autoreload(options.autoReloadOptions);
  autoreload.errorFn = options.error;
  options.error = autoreload.error;
  autoreload.fn = function(){
    self.save(attrs, options);
  };
  autoreload.run();
};

//If we get ajax errors, prompt the user to retry the fetch
Backbone.Model.prototype.fetchRetry = function(options){
  var self=this;
  var autoreload = new App.Utils.Autoreload(options.autoReloadOptions);
  autoreload.errorFn = options.error;
  options.error = autoreload.error;
  autoreload.fn = function(){
    self.fetch(options);
  };
  autoreload.run();
};

Backbone.Model.prototype.setInfo = function(attrs, options){
  options = options || {};
  if(!_.isObject(this.attributes.info)){
    this.set({info:{}}, {silent:true});
  }
  $.extend(this.attributes.info, attrs);
  if(!options.silent){
    this.trigger("change:info");
  }
};
Backbone.Model.prototype.getInfo = function(key){
  if(_.isObject(this.attributes.info)){
    return this.attributes.info[key];
  }
  return null;
};


//models should be Backbone.Model objects or an attributes (post parse) object
Backbone.Collection.prototype.merge = function(models, options){
  var u = [];  //unique
  var n = [];  //non-unique
  var self=this;
  options = options || {};
  if(models){
    models.forEach(function(m){
      var exist = (m.id!==undefined)? self.get(m.id):null;
      if(exist){
        n.push(m);
        //merge values into existing model
        if(options.parse){
          exist.inject(m, null, options); //TODO modify set to take the parse option
        }else{
          exist.set(m, options);
        }
      }else{
        u.push(m);
      }
    });
    self.add(u, options);//add the new stuff
  }
  return {added:u, merged:n};
};


Backbone.Collection.prototype.getState = function(){
  return this.map(function(m){
      if (m.getState instanceof Function){
        return m.getState();
      }
  });
};

Backbone.View.prototype.close = function () {
    if (this.beforeClose) {
        this.beforeClose();
    }
    this.remove();
    this.unbind();
};

Backbone.FormView = Backbone.View.extend({
    __postDisable:false,
    events:{
      "submit form":"__post"
    },
    /*to add events in your child class, do it like this:
     events: _.extend({
         "dblclick": "dblclick"
     }, Backbone.FormView.prototype.events),
     */
    

    __post: function(e){
      e.preventDefault();
      var self=this;
      if(!self._postDisable){  //prevent multiple submissions
        console.log("submit formview");
        var url = "";
        var attrs = {};
        var target = $(e.currentTarget);
        var inputs = target.find('input').add('textarea');
        var exclude=[];
        var only=[];
        inputs.each(function(i){
          var item = $(inputs[i]);
          var k = item.attr('id');
          if(item.data("novalidate")){
            exclude.push(k);
          }
          if(item.attr("type")==="checkbox"){
            if(item.is(":checked")){
              if(item.data("true-value")){
                attrs[k] = item.data("true-value");
              }else{
                attrs[k] = true;
              }
            }else{
              if(item.data("false-value")){
                attrs[k] = item.data("false-value");
              }else{
                attrs[k] = false;
              }
            }
          //TODO radio buttons
          }else if(item.attr("type")==="radio"){
            if(item.is(":checked")){
              attrs[item.attr("name")]=item.val();
            }
          }else{
            attrs[k]=item.val();
          }
        });

        url = target.attr("action");

        //additional validation
        if(self.beforePost){
          var err={};
          if(!self.beforePost(attrs, err)){  
            self.$el.displayModelErrors(err);
            return;
          }
        }

        var errorFn = function(model, errors){
          console.log("error");
          console.log(errors);
          var response;
          if(errors.responseText){  //this is what a response from the server looks like
            response = errors;
            try{
              errors=JSON.parse(errors.responseText);
            }catch(err){
              //json parse error, do nothing
            }
          }
          self.$el.removeClass('loading');
          self._postDisable=false;
          self.$el.displayModelErrors(errors);
          //setTimeout(function(){self.$el.removeModelErrors();}, 2000);
          if(self.onError)self.onError(model, errors, response);
        };
        var successFn = function(model, resp){
          console.log("success");
          console.log(resp);
          self.$el.removeClass('loading');
          self.$el.addClass('loaded');
          self._postDisable=false;
          if(self.afterSave)self.afterSave(model, resp);
          if(!(self.options && self.options.noSave)){ //if we didn't actually sync, don't trigger
            model.trigger("sync", model, resp);
          }
          self.trigger("posted", model);
        };

        //POST
        self.$el.removeModelErrors();
        self.$el.addClass('loading');
        self.$el.removeClass('loaded');
        self._postDisable=true;

        exclude.push.apply(exclude, this.options.exclude);
        only=_.keys(attrs);
        exclude.forEach(function(k){
          only.splice(only.indexOf(k), 1);
        });

        if(self.options.noSave){
          if(self.model.set(attrs,{error:errorFn, only:only})){
            successFn.call(self, self.model,null);
          }
        }else{
          var autoreload = new App.Utils.Autoreload();
          var saveOpts = {
                success:successFn,
                error:errorFn,
                only:only
              };
          if(url && url.length){
            saveOpts.url = url;
          }
          $.extend(saveOpts, this.saveOpts);

          self.model.saveRetry(
            attrs,
            saveOpts
          );
        }
      }
    },
});

/*
 * Input
 * v = Validator(
    { name:{presence:true},
      text:{presence:true,
            presence_message:"Please enter text",
            format:/[A-Za-z ]/,
            format_message:"Please only characters and spaces",
            message:"This message will be used in the absence of a specific *_message"
          },
    }
   )
   Output 
    { name:["name is blank"],
      text:["Please enter text", "Please only characters and spaces"]
    }
    Call as v({a:'val', b:'dont val'}, {a:true}) //second argument is optional
*/

Utils.Validator = function(validations){
  return function(attrs, options){
    var errors={
      __count:0,
      __add : function(k, m){
        if(k in this)
          this[k].push(m);
        else
          this[k] = [m];
        this.__count++;
      }
    };
    var it = validations;
    if(options && options.only) it = Utils.aToO(options.only,options.only);
    for(var k in it){
      var val = validations[k];
      vals: //this is a loop label
      for(var trait in val){
        switch (trait){
          case 'presence':
            if(_.isEmpty(attrs[k])){
              errors.__add(k, val['presence_message'] || val['message'] || (k+ " must be present"));
              break vals; //if it's not there, we don't need the other errors
            }
            break;
          case 'format':
            var fmt = val[trait];
            if(fmt==="email") fmt=/^[\w+\-]+(\.[\w+\-]+)*@([\w\-]+\.)+\w+$/i;
            if(fmt==="phone") fmt=/^\+?1?\D*(\d\D*){10}$/i;
            if(!String(attrs[k]).match(fmt)){
              errors.__add(k, val['format_message'] || val['message'] || (k+ " is formatted incorrectly"));
            }
            break;
          case 'length':
            var min=val[trait][0];
            var max=val[trait][1];
            if(!(attrs[k] && attrs[k].length>=min && (max===undefined || (attrs[k].length<=max)))){
              errors.__add(k, val['length_message'] || val['message'] || (k+ " has an invalid length"));
            }
            break;
          

          //TODO more validators
        }
      }
    }
    if(errors.__count) return errors;
  };
};

$.fn.displayModelErrors = function (errors, options){
  var $this = $(this);
  for(var id in errors){
    var $inp = $this.find('#'+id);
    if($inp.length){
      $inp.tooltip({title:errors[id].join(), trigger:'manual'});
      $inp.tooltip('show');
      $inp.addClass('model-error');
    }
  }
  return this;
};

$.fn.removeModelErrors = function(){
  $(this).find('.model-error').each(function(){
      $(this).removeClass('model-error')
             .tooltip('hide')
             .data('tooltip', null);
  });
};

Backbone.sync = function(method, model, options) {
  //why they didn't expose this function, i don't know
  var getValue = function(object, prop) {
    if (!(object && object[prop])) return null;
    return _.isFunction(object[prop]) ? object[prop]() : object[prop];
  };
  var urlError = function() {
    throw new Error('A "url" property or function must be specified');
  };
  var methodMap = {
    'create': 'POST',
    'update': 'PUT',
    'delete': 'DELETE',
    'read':   'GET'
  };


  var type = methodMap[method];

  // Default JSON-request options.
  var params = {type: type, dataType: 'json'};

  // Ensure that we have a URL.
  if (!options.url) {
    params.url = getValue(model, 'url') || urlError();
  }

  // Ensure that we have the appropriate request data.
  if (!options.data && model && (method == 'create' || method == 'update')) {
    params.contentType = 'application/json';
    //allow additional data that is not part of model --vp
    params.data = JSON.stringify(_.extend(model.toJSON(), options.additionalData));
  }

  // For older servers, emulate JSON by encoding the request into an HTML-form.
  if (Backbone.emulateJSON) {
    params.contentType = 'application/x-www-form-urlencoded';
    params.data = params.data ? {model: params.data} : {};
  }

  // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
  // And an `X-HTTP-Method-Override` header.
  if (Backbone.emulateHTTP) {
    if (type === 'PUT' || type === 'DELETE') {
      if (Backbone.emulateJSON) params.data._method = type;
      params.type = 'POST';
      params.beforeSend = function(xhr) {
        xhr.setRequestHeader('X-HTTP-Method-Override', type);
      };
    }
  }

  //added authentication --vp
  if(model.authenticateWith){
    var auth = model.authenticateWith();
    if(auth){
      var authCode =  "Basic " + auth;
      params.beforeSend = function(req) {
        req.setRequestHeader('Authorization', authCode);
      };
    }
  }


  // Don't process data on a non-GET request.
  if (params.type !== 'GET' && !Backbone.emulateJSON) {
    params.processData = false;
  }

  // Make the request, allowing the user to override any Ajax options.
  return $.ajax(_.extend(params, options));
};
