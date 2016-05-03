var app = {
  init: () => {
  },
  server: 'https://api.parse.com/1/classes/messages',
  // Keeps all the messages
  storage: {},
  send: message => {
    var result = $.ajax({
    // This is the url you should use to communicate with the parse API server.
      url: 'https://api.parse.com/1/classes/messages',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: (data) => {
        console.log('chatterbox: Message sent');
        console.log(data);
        console.log(this);
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
        app.storage = data.results;
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
  addMessage: () => {
    var messages = app.storage;
    for(var i = 0; i < messages.length; i++){
      $('#chats').append('<div class= "message"><div class="username">' + messages[i].username + '</div><div class="text">' + messages[i].text + '</div></div>');
    }
  },
  addRoom: room => {
    //if(_.contains($('#roomSelect').children(), room) === false){
    $('#roomSelect').append('<option value=' + room + '>' + room + '</option>');
    //}
  },
  addFriend: name => {
    return true;
  }
};