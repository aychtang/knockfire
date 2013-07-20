
var compileTemplate = function() {
  var source = document.getElementById('message-template').innerHTML;
  return Handlebars.compile(source);
};

var messageTemplate = compileTemplate();

var displayChatMessage = function(name, text) {
  var html = messageTemplate({
    'name': name,
    'text': text
  });
  
  document.getElementsByClassName('chat-display')[0].innerHTML += html;
};

var fireBaseDataRef = new Firebase("chatclient.firebaseio.com");

fireBaseDataRef.on('child_added', function(data) {
  var message = data.val();
  if (message.name !== undefined && message.text !== undefined) {
    displayChatMessage(message.name, message.text);
  }
});

var AppViewModel = function() {
  var that = this;
  this.firstName = ko.observable("Howard");
  this.lastName = ko.observable("Tang");

  this.fullName = ko.computed(function() {
      return this.firstName() + " " + this.lastName();
  }, this);

  var messageInput = document.getElementsByClassName('message-input')[0];
  messageInput.addEventListener('keypress', function(event) {
    if (event.keyCode === 13) {
      fireBaseDataRef.push({name: that.fullName(), text: messageInput.value});
      messageInput.value = '';
    }
  });
};

ko.applyBindings(new AppViewModel());