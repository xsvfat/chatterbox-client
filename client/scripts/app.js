// YOUR CODE HERE:

  window.app = {};

  app.init = function() {
    app.fetch(); 
    setInterval(app.updateMaster, 2000); 
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
        //app.fetch();
        //app.addMessage(message);
        //app.lastFetch = Date.parse(data.createdAt);
        //$('.messageContainer:first-child').remove(); 
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
        app.updateFriendMessages();
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
          if (Date.parse(messageArray[i].createdAt) > app.lastFetch) {
            app.addMessage(messageArray[i]); 
            app.removeMessage();
          }

          if (app.checkForNewChatRooms(messageArray[i])) {
            app.addRoom(messageArray[i].roomname);
          }
        }

        app.lastFetch = Date.parse(messageArray[0].createdAt);
       
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  }; 

  app.checkForNewChatRooms = function(obj) {
    if (app.roomList.indexOf(obj.roomname) === -1 & obj.roomname !== undefined) {
      //app.addRoom(obj.roomname);
      return true;
    }
    return false;
  };


  app.clearMessages = function () {
    $('#chats').children().remove(); 
  }; 

  app.addMessage = function (message) {
    debugger;
    var $messageContainer = $('<div class="messageContainer"></div>'); 
    var $username = $('<div class="username"></div>');
    var username = message.username.replace(/\s+/g, ''); 
    $username.addClass(username); 
    var $messageText = $('<div class="messageText"></div>');
    console.log(message.username); 
    //if (app.checkFriendList(message.username)) {
    //  $messageText.addClass('friendMessage'); 
    //}
    $username.append(document.createTextNode(message.username));
    $messageText.append(document.createTextNode(message.text));
    $messageContainer.append($username);
    $messageContainer.append($messageText);
    $messageContainer.append($('<div class="icon"></div>'));  
    $('#chats').append($messageContainer);    
  }; 

  app.removeMessage = function() {
    if (app.lastFetch > 0 && $('.messageContainer').length > 20) {
      $('.messageContainer:first-child').remove();
    } 
  };

  app.addRoom = function (roomName) {
    app.roomList.push(roomName);
    var $roomName = $('<a id="rooms"></a>');
    $roomName.append(document.createTextNode(roomName));
    $('.dropdown-content').append($roomName);
  };

  app.addFriend = function (friendName) {
    var $friendName = $('<div id='+ friendName +'></div>');
    $friendName.append(document.createTextNode(friendName));
    $('.friendsList').append($friendName);

  }; 

  app.handleSubmit = function (msgObj) {
    app.send(msgObj);
  }; 

  app.checkFriendList = function (username) {
    username = '#' + username; 
    if ($('.friendsList').has(username)) {
      return true; 
    }
  }; 

  app.updateFriendMessages = function() {
    var friendsList = $('.friendsList').children();
    if ( friendsList.length > 0) {
      friendsList.each( function(item, element) {
        //console.log(item); 
        console.log(element); 
        var id = $(element).attr('id'); 
        console.log(id); 
        $('#chats').children().children(".username" + "." + id + "").siblings().css({'font-weight':'bold'});
      });
    }
  };


  $(document).ready(function() {

    app.init();
    var savedUsername = location.search.length <= 9 ? location.search.slice(10) : 'Default Username';

    // $(window).keydown(function(event) {
    //   if (event.keyCode === 13) {
    //     event.preventDefault();
    //     return false;
    //   }
    // });
   
    $('body').on('click', '.username', function() { 
      //console.log('Clicked on a friend!'); 
      var friendName = $(this).text();
      friendName = friendName.replace(/\s+/g, ''); 
      console.log(friendName);
      //if (!$('.friendsList').children().('.')) {
      if (!(document.getElementById(friendName))) {
        app.addFriend(friendName);
      }
    }); 

    $('body').on('click', '.submit', function(e) {
      e.preventDefault();
      var messageText = $('#message').val();
      var messageObj = {
        username: savedUsername,
        text: messageText,
        roomname: app.currentRoom
      };

      app.handleSubmit(messageObj);
      $('#message').val(''); 
    });

    //Enter new room name from form field. Creates new room. 
    $('body').on('click', '.submitRoomName', function(e) {
      e.preventDefault();
      var roomName = $('#enteredRoomName').val();
      //if (roomName !== 'Enter your room name' && roomName !== app.currentRoom) {
      var messageObj = {
        username: savedUsername,
        text: " just created " + roomName,
        roomname: roomName
      };
      app.clearMessages();
      app.currentRoom = roomName;
      app.lastFetch = 0; 
      app.handleSubmit(messageObj); 
      //}
    });

    //Click to select room from dropdown list. Selects from pre-existing rooms. 
    $('body').on('click', '#rooms', function() {
      app.clearMessages();
      app.lastFetch = 0; 
      console.log('clicked');
      console.log(this);
      app.currentRoom = $(this).text();
    });
      // app.send(messageObj);
     
  }); 







