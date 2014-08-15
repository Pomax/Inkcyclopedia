var fs = require("fs"),
    express = require("express")
    app = express(),
    routes = require("./routes"),
    bodyParser = require("body-parser");;

app.use(bodyParser.json({ limit: "5mb" }));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);	
app.use(express.static(__dirname + '/public'));


routes.setup(app);

var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});
