
var compileTemplate = function() {
  var source = document.getElementById('message-template').innerHTML;
  return Handlebars.compile(source);
};

var messageTemplate = compileTemplate();

var displayChatMessage = function(name, text, score, refId) {
  var html = messageTemplate({
    'name': name,
    'text': text,
    'score': score,
    'ref-id': refId
  });

  var newNode = document.getElementsByClassName('chat-display')[0].innerHTML += html;
};

var fireBaseDataRef = new Firebase("chatclient.firebaseio.com");

fireBaseDataRef.on('child_added', function(data) {
  var message = data.val();
  var refId = data.ref().name();

  if (message.name !== undefined && message.text !== undefined) {
    displayChatMessage(message.name, message.text, message.score, refId);
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
      fireBaseDataRef.push({name: that.fullName(), text: messageInput.value, score: 0});
      messageInput.value = '';
    }
  });
};

ko.applyBindings(new AppViewModel());

var setEventListener = function() {
  document.getElementsByClassName('chat-display')[0].addEventListener('click', function(e) {
    if (e.srcElement.className === 'post') {
      e.srcElement.dataset.score = parseInt(e.srcElement.dataset.score) + 1;
      fireBaseDataRef.child(e.srcElement.dataset.refId).update({score: e.srcElement.dataset.score});
    }
  });
};

setEventListener();
