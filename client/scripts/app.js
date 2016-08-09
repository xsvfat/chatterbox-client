// YOUR CODE HERE:

  window.app = {};

  app.init = function() {
    app.fetch(); 
    setInterval(app.updateMaster, 5000); 
  };

  app.lastFetch = 0; 

  app.server = 'https://api.parse.com/1/classes/messages'; 
  app.roomList = [];
  app.currentRoom = undefined;

  app.updateMaster = function() {
    if (app.currentRoom === undefined) {
      app.fetch();
    } else {
      app.fetch(app.currentRoom);
    }
  };

 

  app.send = function(message) {
    $.ajax({
    // This is the url you should use to communicate with the parse API server.

      url: app.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
        //app.addMessage(message);
        $('.messageContainer:first-child').remove(); 
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  };


  app.fetch = function (selectedRoom) {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: app.server,
      type: 'GET',
      dataType: 'json',
      contentType: 'application/json',
      success: function (data, status, xhr) {
        if (selectedRoom !== undefined) {
          var messageArray = data.results.filter(function(messageData) {
            if (messageData.roomname === selectedRoom) {
              return messageData; 
            }
          }); 
        }
        var messageArray = messageArray || data.results; 
        var ending = Math.min(messageArray.length, 20);

        for (var i = 0; i < ending; i++) {
         // console.log(data.results[i].roomname);
          
          if (Date.parse(messageArray[i].createdAt) > app.lastFetch) {
            app.addMessage(messageArray[i]); 
            app.lastFetch > 0 ? $('.messageContainer:first-child').remove() : 0;
          }
          app.updateChatRooms(messageArray[i]);
         
        }
        app.lastFetch = Date.parse(messageArray[0].createdAt);
       
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  }; 

  app.updateChatRooms = function(obj) {
    if (app.roomList.indexOf(obj.roomname) === -1 & obj.roomname !== undefined) {
      app.roomList.push(obj.roomname);
      var $roomName = $('<a id="rooms"></a>');
      $roomName.append(document.createTextNode(obj.roomname));
      $('.dropdown-content').append($roomName);
    }
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
    var savedUsername = location.search.length <= 9 ? location.search.slice(10) : 'Default Username';
   
    $('body').on('click', '.username', function() { 
      app.addFriend();
    }); 

    $('body').on('click', '.submit', function(e) {
      e.preventDefault();
      var messageText = $('#message').val();
      var messageObj = {
        username: savedUsername,
        text: messageText,
        roomname: 'The Dungeon'
      };

      app.handleSubmit(messageObj); 
       //e.preventDefault();
    });

    $('body').on('click', '#rooms', function() {
      app.clearMessages();
      app.lastFetch = 0; 
      console.log('clicked');
      console.log(this);
      app.currentRoom = $(this).text();
    });
      // app.send(messageObj);
     
  }); 







