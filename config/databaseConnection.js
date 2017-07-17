var mysql = require('mysql');
var dbconfig = require('./../config/database');
var connection = mysql.createConnection(dbconfig.connection);
connection.query('USE ' + dbconfig.database);

module.exports = {

    //export a function
    executeQuery: function(queryString, values, callback) {
        connection.query(queryString,values, callback);
    },

    //export a property
    // myProperty: {

    // }
};