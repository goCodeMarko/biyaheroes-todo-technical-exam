
const
    http = require('http'),
    path = require('path'),
    fs = require('fs'),
    lib = require('./library'),
    mongoose = require('mongoose'),
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
    req.rawURL = await lib.rawURL(req.url)
    req.body = await lib.bodyParser(req);
    req.queryParams = await lib.queryParams(req.url);

    if (req.rawURL == '/') {
        const file = path.join(__dirname, '..', 'client', 'index.html');

        fs.readFile(file, (err, data) => {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        })

    }
    if (req.rawURL == '/style.css') {
        const file = path.join(__dirname, '..', 'client', 'style.css');

        fs.readFile(file, (err, data) => {
            res.writeHead(200, { 'Content-Type': 'text/css' });
            res.end(data);
        })

    }
    if (req.rawURL == '/script.js') {
        const file = path.join(__dirname, '..', 'client', 'script.js');

        fs.readFile(file, (err, data) => {
            res.writeHead(200, { 'Content-Type': 'text/javascript' });
            res.end(data);
        })

    }

    console.log('req.rawURL', req.rawURL);
    console.log('req.queryParams', req.queryParams);
    console.log('req.body', req.body);
    console.log('req.method', req.method);
    switch (req.method) {
        case 'GET':
            if (req.rawURL == '/getTodos') {
                const result = await todosController.getTodos();

                res.writeHead(result.code, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(result));
            }
            break;
        case 'POST':
            if (req.rawURL == '/saveTodo') {
                const result = await todosController.saveTodo(req);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(result));
            }

            if (req.rawURL == '/deleteTodo') {
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

