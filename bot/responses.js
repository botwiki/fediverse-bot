/*
  Here you can modify how the bot responds to messages it receives.
*/

module.exports = function(data, callback_function) {
/*
  At the end of this function we need to pass an error message and a response text.
  Let's set up some default values.
*/  
  
  var error = null,
      response = 'Hello 👋';

/*
  The data object this function receives looks like this:

  data = {
    payload: 'The original data object.',
    message_body: 'The content of the message sent to the bot.',
    message_from: 'The URL of the message sender.'
  }

  message_body and message_from come from the payload object, so we can access them more conveniently. If we need more details, we can get those from the payload object itself.

*/  

  console.log(`new message from ${data.message_from}:`)
  console.log(data.message_body);

/*  
  We can modify the response text.
*/  
  
  if (data.message_body.toLowerCase().indexOf('hello') > -1){
    response = 'Hi 👋';
  }

  /*
    Finally, we pass the error and reply message to the callback function that sends it to the author of the message that the bot received and saves it to the post database.
  */
  
  callback_function(error, response);
};
