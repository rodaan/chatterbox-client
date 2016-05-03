var app = {
  init: () => {
  },
  server: 'https://api.parse.com/1/classes/messages',
  // Keeps all the messages
  storage: {},
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
  fetch: () => {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: app.server,
      type: 'GET',
      contentType: 'application/json',
      success: (data) => {
        console.log('chatterbox: Message received');
        //app.storage = data.results;

        //Sorts all messages into chat rooms
        for (var i = 0; i < data.results.length; i++) {
          if (app.storage[data.results[i].roomname] === undefined) {
            app.storage[data.results[i].roomname] = [data.results[i]];
            // $('#roomSelect').append('<option value='+data.results[i].roomname + '>' + data.results[i].roomname + '</option>');
          } else {
            app.storage[data.results[i].roomname].push(data.results[i]);
          }
        }

        //Creates chatroom options on roomselect
        for (var key in app.storage) {
          $('#roomSelect').append('<option value='+key+ '>' + key + '</option>');
        }

      },
      error: (data) => {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to get message', data);
      }
    });
  },
  clearMessages: () => {
    $('#chats').children().remove();
  },
  addMessage: message => {
    app.send(message);
    app.clearMessages();
    app.fetch();
    app.populateChat($('#roomSelect').val());
  },
  populateChat: room =>{
    app.clearMessages();
    app.fetch();
    var messages = app.storage[room];
    console.log(messages);
    for (var i = 0; i < messages.length; i++) {
      $('#chats').append('<div class= "message"><div class="username">' + messages[i].username + ':</div><div class="text">' + messages[i].text + '</div></div>');  
    }
  },
  addRoom: room => {
    //if(_.contains($('#roomSelect').children(), room) === false){
    $('#roomSelect').append('<option value=' + room + '>' + room + '</option>');
    //}
  },
  addFriend: name => {
    return true;
  },
  createMessage: () =>{
    var message = {
      username: 'woot',
      text: $('.input').val(),
      roomname: $('#roomSelect').val()
    };
    $('.input').val('');
    app.addMessage(message);
  }
};

$(document).ready(function() {
  app.fetch();
  for (var key in app.storage) {
    for (var i = 0; i < app.storage[key]; i++) {
      $('#chats').append('<div class= "message"><div class="username">' + app.storage[key][i].username + '</div><div class="text">' + app.storage[key][i].text + '</div></div>');  
    }
  }

  $('chatSubmit').submit();
});

// setInterval(function(){
//   app.fetch();
//   app.addMessage();
// }, 5000)