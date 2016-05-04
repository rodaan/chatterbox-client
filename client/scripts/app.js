var app = {
  init: () => {
    app.fetch();
  },
  server: 'https://api.parse.com/1/classes/messages',
  // Keeps all the messages
  storage: {},
  msgIds: [],
  friends: [],
  // Sends messages
  send: message => {
    console.log(message);
    var result = $.ajax({
    // This is the url you should use to communicate with the parse API server.
      url: 'https://api.parse.com/1/classes/messages',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: (data) => {
        console.log('chatterbox: Message sent');
        console.log(data);
      },
      error: (data) => {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  },
  // Fetches messages
  fetch: search => {
    search = search || {};
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: app.server,
      type: 'GET',
      contentType: 'application/json',
      data: search,
      success: (data) => {
        console.log('chatterbox: Message received');
        console.log('Data is:', data);
        var messages = data.results;

        //Sorts all messages into chat rooms
        for (var i = 0; i < messages.length; i++) {
          if (app.storage[messages[i].roomname] === undefined && messages[i].roomname !== undefined) {
            app.storage[messages[i].roomname] = {};
            var option = $('<option></option>');
            option.val(messages[i].roomname);
            option.text(messages[i].roomname);
            $('#roomSelect').append(option);
            //$('#roomSelect').prepend('<option value='+messages[i].roomname+ '>' + messages[i].roomname + '</option>');
          }
          app.storage[messages[i].roomname][messages[i].objectId] = messages[i];
        }

        //Creates chatroom options on roomselect
        // for (var key in app.storage) {
        //   $('#roomSelect').append('<option value='+key+ '>' + key + '</option>');
        // }

      },
      error: (data) => {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to get message', data);
      }
    });
  },
  //Removes messages from screen
  clearMessages: () => {
    $('#chats').children().remove();
  },
  //Adds a message on screen
  addMessage: message => {
    console.log(message);
    app.send(message);
    var box = $('<div class="message"></div>');
    var a = $('<a href="#"></a>');
    var username = $('<div class="username" onclick="app.usernameClick(this)">');
    username.attr('data-username', message.username);
    username.text(message.username);
    var text = $('<div class="text"></div>');
    text.text(message.text);
    a.append(username);
    box.append(a);
    box.append(text);
    $('#chats').prepend(box);
    //$('#chats').prepend('<div class= "message"><a href="#"><div class="username">' + message.username + ':</div></a><div class="text">' + message.text + '</div></div>');  
  },
  //Adds all messages with the room on screen
  populateChat: room => {
    app.fetch('where= {"roomname": "' + room + '"}');
    var messages = app.storage[room];
    for (var key in messages) {
      var message = $('<div class="message"></div>');
      message.attr('id', messages[key].objectId);
      var a = $('<a href="#"></a>');
      var username = $('<div class="username" onclick="app.usernameClick(this)"></div>');
      username.attr('data-username', messages[key].username);
      username.text( messages[key].username + ':');
      var text = $('<div class="text"></div>');
      text.text(messages[key].text);
      if (app.friends.indexOf(messages[key].username) !== -1) {
        message.addClass('friend');
        //username.addClass('friend');
      } 
      a.append(username);
      message.append(a);
      message.append(text);
      $('#chats').prepend(message);

      // $('#chats').prepend('<div class= "message" id='+ messages[key].objectId +'><a href="#"><div class="username">' + messages[key].username + ':</div></a><div class="text">' + messages[key].text + '</div></div>');  
    }
  },
  //On room change, clears messages 
  roomChange: () => {
    app.clearMessages();
    var selection = $('#roomSelect').val();
    if (selection === 'newRoom') {
      $('#newRoomInput').show();
    } else {
      $('#newRoomInput').hide();
      app.populateChat(selection);
    }
  },
  //Adds a new room
  addRoom: room => {
    var option = $('<option></option>');
    option.val(room);
    option.text(room);
    $('#roomSelect').append(option);
  },
  addFriend: name => {
    app.friends.push(name);
  },
  //Determines if a message was added to a new room, if so, creates new room and adds message on screen
  handleSubmit: () => {
    var roomname;
    if ($('#roomSelect').val() === 'newRoom') {
      roomname = $('#newRoomInput').val();
      $('#newRoomInput').val('');
      app.addRoom(roomname);
    } else {
      roomname = $('#roomSelect').val();
    }
    var message = {
      username: $('#username').val(),
      text: $('.input').val(),
      roomname: roomname
    };
    $('.input').val('');
    app.addMessage(message);
  },
  usernameClick: (arg) => {
    var username = arg.getAttribute('data-username');
    if (app.friends.indexOf(username) === -1) {
      app.addFriend(username);
    }
    app.roomChange();
  }
};
$(document).ready(function(){
  app.init();
});