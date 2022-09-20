const
    path     = require('path'),
    base     = path.basename(__filename, '.js'),
    model    = require(`./../models/${base}`);
let $global  = { success: true, data: [], message: '', code: 200 };




module.exports.getTodos = async (req) => {
    try {
        await model.getTodos(req, (results) => {
            $global.data = results;
        });
    } catch (error) {
        console.error('Controller::Todos::getTodos()', error);
    } finally {
        return $global;
    }
};

module.exports.saveTodo = async (req) => {
    try {
        await model.saveTodo(req, (results) => {
            $global.data = results;
        });
    } catch (error) {
        console.error('Controller::Todos::saveTodo()', error);
    } finally {
        return $global;
    }
};

module.exports.deleteTodo = async (req) => {
    try {
        await model.deleteTodo(req, (results) => {
            $global.data = results;
        });
    } catch (error) {
        console.error('Controller::Todos::deleteTodo()', error);
    } finally {
        return $global;
    }
};

module.exports.checkTitleExists = async (req) => {
    try {
        await model.checkTitleExists(req, (results) => {
            $global.data = results;
        });
    } catch (error) {
        console.error('Controller::Todos::checkTitleExists()', error);
    } finally {
        return $global;
    }
};

module.exports.checkReferenceExists = async (req) => {
    try {
        await model.checkReferenceExists(req, (results) => {
            $global.data = results;
        });
    } catch (error) {
        console.error('Controller::Todos::checkReferenceExists()', error);
    } finally {
        return $global;
    }
};
