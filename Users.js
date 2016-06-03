var sql     = require('seriate');
var when    = require('when');

var getAllUsers = function(date, search) {
     return sql.execute({
        query: sql.fromFile('../sql/users/getAllUsers.sql'),
        params: {
            date: {
                type: sql.DATE,
                val: date
            },
            search: {
                type: sql.VARCHAR,
                val: search
            }
        }
    });
}


module.exports = {
    getAllUsers: getAllUsers
};
