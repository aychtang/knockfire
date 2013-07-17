     var fireBaseDataRef = new Firebase("chatclient.firebaseio.com");

      var displayChatMessage = function(name, text) {
        var messageNode = document.createElement("div");
        messageNode.innerHTML = '<h3>'+name+' says:</h3> <span>'+text+'</span>';
        document.getElementsByClassName('chat-display')[0].appendChild(messageNode);
      };

      fireBaseDataRef.on('child_added', function(data) {
        var message = data.val();
        if (message.name !== undefined && message.text !== undefined) {
          displayChatMessage(message.name, message.text);
        }
      });

      function AppViewModel() {
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
    }

    ko.applyBindings(new AppViewModel());