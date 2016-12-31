const LineByLineReader = require('line-by-line'),
    lr = new LineByLineReader('messages.txt'),
    fs = require('fs');

let messages = [];
let tmpMessage = {
	time: '',
	sender: '',
	message: ''
};
const regExTime = /\[(\d{1,2}:\d{1,2}\s(AM|PM),\s\d{1,2}\/\d{1,2}\/\d{4})\]/;
const regExMsg = /\[(\d{1,2}:\d{1,2}\s(AM|PM),\s\d{1,2}\/\d{1,2}\/\d{4})\]\s([+0-9\s]+|[a-zA-Z\s]+):(.*)/;

let buildHtml = function(messages) {
	let msgText = messages.map((m) => `<div class="panel panel-info">
			<div class="panel-heading"> 
				<h3 class="panel-title">${m.sender}</h3> 
			</div> 
			<div class="panel-body"> ${m.message} </div> 
		</div>`);

	msgText = msgText.join("");

	return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Whatsapp messages to HTML">
    <meta name="author" content="Rakesh Tembhurne">
    <title>Whatsapp Messages to </title>
    <!-- Bootstrap core CSS -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
  </head>
  <body>
    <div class="container">
    	${msgText}
		<footer class="footer">
			<p>Made with love by <a href="https://rakesh.tembhurne.com">Rakesh Tembhurne</a></p>
		</footer>
    </div> 
  </body>
</html>`;

};

lr.on('error', function (err) {
	console.warn("Oops, got some error:", err);
});

lr.on('line', function (line) {
	if (regExTime.test(line)) {
		let matches = line.match(regExMsg);
		tmpMessage = {
			time: matches[1],
			sender: matches[3],
			message: matches[4]
		};
		messages.push(tmpMessage);
		tmpMessage.time = '';
	} else {
		tmpMessage.message += `<br />${line}`;
	}
});

lr.on('end', function () {
	if (tmpMessage.time) messages.push(tmpMessage);
	let html = buildHtml(messages);

	fs.writeFile("output.html", html, function(err) {
	    if(err) {
	        return console.log(err);
	    }

	    console.log("The file was saved!");
	}); 

	// console.log(buildHtml(messages));
	// All lines are read, file is closed now.
});
