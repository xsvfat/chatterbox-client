// YOUR CODE HERE:

  window.app = {};

  app.init = function() {
    app.fetch(); 
  };


  app.server = 'https://api.parse.com/1/classes/messages'; 


  app.send = function(message) {
    $.ajax({
    // This is the url you should use to communicate with the parse API server.

      url: app.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
        app.addMessage(message);
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  };


  app.fetch = function () {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: app.server,
      type: 'GET',
      dataType: 'json',
      contentType: 'application/json',
      success: function (data, status, xhr) {
        for (var i = data.results.length - 1; i > data.results.length - 20; i--) {
          console.log(data.results[i]); 
          //check to see if the date is more up to date than our last fetched, if so , add
          //keep track of how many added, and remove old
          //run this every three seconds?
          app.addMessage(data.results[i]); 
        }
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  }; 


  app.clearMessages = function () {
    $('#chats').children().remove(); 
  }; 

  app.addMessage = function (message) {

    var $messageContainer = $('<div class="messageContainer"></div>'); 
    var $username = $('<div class="username"></div>');
    var $messageText = $('<div class="messageText"></div>');
    $username.append(document.createTextNode(message.username));
    $messageText.append(document.createTextNode(message.text));
    $messageContainer.append($username);
    $messageContainer.append($messageText); 
    $('#chats').append($messageContainer); 
  }; 

  app.addRoom = function (roomName) {
    var $newRoom = $('<div></div>'); 
    $newRoom.text(roomName);
    $('#roomSelect').append($newRoom); 
  };

  app.addFriend = function () {
    return 0; 
  }; 

  app.handleSubmit = function (msgObj) {
    app.send(msgObj);
  }; 


  $(document).ready(function() {

    app.init();
    var savedUsername = location.search.length > 10 ? location.search.slice(10) : "Default Username";
   
    $('body').on('click', '.username', function() { 
      app.addFriend();
    }); 

    $('body').on('click', '.submit', function(e) {
      e.preventDefault();
      var messageText = $('#message').val();
      var messageObj = {
        username: savedUsername,
        text: messageText
        // roomName: "The Dungeon"
      };
      // app.send(messageObj);
      app.handleSubmit(messageObj); 
       //e.preventDefault();
    });
  }); 







