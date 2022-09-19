const
    path = require('path'),
    base = path.basename(__filename, '.js'),
    mongoose = require('mongoose');
let $global = { results: [] };

Todos = mongoose.model(base, mongoose.Schema({
    todoReference:      { type: String, required: true },
    todoTitle:          { type: String, default: 0, required: true },
    todoDescription:    { type: String, required: true },
    todoDatetimestamp:  { type: Date, default: new Date() },
    // isdeleted:          { type: Boolean, default: false }
}));




module.exports.getTodos = async (req, cb) => {
    try {
        const todos = await Todos.aggregate([
            { $match: { isdeleted: false } }
        ]);
        
        $global.results = todos;
    } catch (error) {
        console.error('Models::todos:getTodos()', error);
    } finally {
        cb($global);
    }
}

module.exports.saveTodo = async (req, cb) => {
    try {
        const data = req.body;
        const newTodos = new Todos(data);
        const insert = await newTodos.save();

        $global.queryResult = insert;
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

        $global.queryResult = result;
    } catch (error) {
        console.error('Models::todos:deleteTodo()', error);
    } finally {
        cb($global);
    }
}