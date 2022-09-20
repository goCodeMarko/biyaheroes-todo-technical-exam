const
    path       = require('path'),
    base       = path.basename(__filename, '.js'),
    mongoose   = require('mongoose');
let $global    = { results: [] };

Todos = mongoose.model(base, mongoose.Schema({
    todoReference:      { type: String, required: true },
    todoTitle:          { type: String, default: 0, required: true },
    todoDescription:    { type: String, required: true },
    todoDatetimestamp:  { type: Date, default: new Date() },
    // isdeleted:          { type: Boolean, default: false }
}));




module.exports.getTodos = async (req, cb) => {
    try {
        const todos = await Todos.find();
        
        $global.results = todos;
    } catch (error) {
        console.error('Models::todos:getTodos()', error);
    } finally {
        cb($global);
    }
}

module.exports.saveTodo = async (req, cb) => {
    try {

        const data = {
            todoReference: req.body.todoReference,
            todoTitle: req.body.todoTitle,
            todoDescription: req.body.todoDescription,
        }

        const newTodos = new Todos(data);
        const insert = await newTodos.save();

        $global.results = insert;
    } catch (error) {
        console.error('Models::todos:saveTodo()', error);
    } finally {
        cb($global);
    }
}

module.exports.deleteTodo = async (req, cb) => {
    try {
        const id = req.body.id;
        /*
        const result = await Todos.updateOne(
            { _id: id },
            { $set: { isdeleted: true } }
        )
        */
        const result = await Todos.deleteOne({'_id': id });

        $global.results = result;
    } catch (error) {
        console.error('Models::todos:deleteTodo()', error);
    } finally {
        cb($global);
    }
}

module.exports.checkTitleExists = async (req, cb) => {
    try {
        const title = req.queryParams.title;
        const result = await Todos.find({ 'todoTitle': title });

        $global.results = result.length;
    } catch (error) {
        console.error('Models::todos:checkTitleExists()', error);
    } finally {
        cb($global);
    }
}

module.exports.checkReferenceExists = async (req, cb) => {
    try {
        const reference = req.queryParams.reference;
        const result = await Todos.find({ 'todoReference': reference });

        $global.results = result.length;
    } catch (error) {
        console.error('Models::todos:checkReferenceExists()', error);
    } finally {
        cb($global);
    }
}