
const
    http            = require('http'),
    path            = require('path'),
    lib             = require('./library'),
    mongoose        = require('mongoose'),
    todosController = require('./controllers/todos');




mongoose.connect('mongodb+srv://pdulaca_user1:a7OdGl37bGDKMZ8W@cluster0.zmj3z2d.mongodb.net/db_biyaheroes?retryWrites=true&w=majority', {
    "useUnifiedTopology": true,
    "useNewUrlParser": true
}, () => {
    switch (mongoose.connection.readyState) {
        case 0:
            console.log('\x1b[36m', `Unsuccessful Database Connection.`);
            break;
        case 1:
            console.log('\x1b[36m', `Successfully Connected to Database`);
            break;
    }
})

const server = http.createServer(async (req, res) => {
    req.rawURL      = await lib.rawURL(req.url)
    req.body        = await lib.bodyParser(req);
    req.queryParams = await lib.queryParams(req.url);

    switch (req.method) {
        case 'GET':
            lib.clientFiles(req.rawURL, res);

            if (req.rawURL == '/api/getTodos') {
                const result = await todosController.getTodos();

                res.writeHead(result.code, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(result));
            }
            
            if (req.rawURL == '/api/checkTitleExists') {
                const result = await todosController.checkTitleExists(req);

                res.writeHead(result.code, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(result));
            }

            if (req.rawURL == '/api/checkReferenceExists') {
                const result = await todosController.checkReferenceExists(req);

                res.writeHead(result.code, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(result));
            }
            break;
        case 'POST':
            if (req.rawURL == '/api/saveTodo') {
                const result = await todosController.saveTodo(req);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(result));
            }

            if (req.rawURL == '/api/deleteTodo') {
                const result = await todosController.deleteTodo(req);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(result));
            }
            break;
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log('\x1b[36m', `Server is running on port ${PORT}`);
})

