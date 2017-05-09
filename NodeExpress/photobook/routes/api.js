/**
 * Created by quangvu on 5/5/17.
 */
const express = require('express');
const router = express.Router();
const fs = require('fs');
var mysql      = require('mysql');

// // Connection is used for one by one connection
// //   mean: re-create after close
// var connection = mysql.createConnection({
//     //host     : '192.168.100.11',
//     host     : '127.0.0.1',
//     user     : 'root',
//     //password : 'root123',
//     password: 'root',
//     database : 'demo'
// });

// Do not need to re-create connection
var pool  = mysql.createPool({
    connectionLimit : 100,
    //host     : '192.168.100.11',
    host     : '127.0.0.1',
    user     : 'root',
    //password : 'root123',
    password: 'root',
    database : 'demo'
});

//const formidable = require('formidable'), http = require('http'), util = require('util');

router.get('/person', function(req, res) {

    pool.getConnection(function(err, connection) {
        if (err) throw err;

        // Use the connection
        connection.query('SELECT id, name, phone, city, email FROM person;',
            function(error, results, fields) {
            // And done with the connection
            connection.release();
            // connection.destroy();

            // Handle error after the release
            if (error) throw error;

            res.end(JSON.stringify(results));

            // Don't use the connection here, it has been returned to the pool.
        });
    });

    // connection.connect(function(err) {
    //     if (err) throw err;
    //     console.log('You are now connected...');
    //
    //     connection.query('SELECT id, name, phone, city, email FROM person;',
    // function (err, results, fields) {
    //         if (err) {
    //             res.end('Error when connect to MySQL');
    //             return;
    //         }
    //
    //         res.end(JSON.stringify(results));
    //     });
    // });
});

// Add New
router.post('/person', function(req, res) {
    var obj = req.body;

    pool.getConnection(function(err, connection) {
        if (err) throw err;

        // Use the connection
        connection.query(
            // Solution 1
            // 'INSERT INTO person (name, phone, city, email) VALUES (?, ?, ?, ?);',
            // [obj.name, obj.phone, obj.city, obj.email],

            // Solution 2
            'INSERT INTO person SET ?', obj,
            function (error, results, fields) {
                // And done with the connection
                connection.release();
                // connection.destroy();

                // Handle error after the release
                if (error) throw error;

                // id of the inserted row
                console.log(results.insertId);

                // Response to client browser
                res.end('Done');

                // Don't use the connection here, it has been returned to the pool.
            });
    });
});

// Update
router.put('/person/:entityId', function(req, res) {
    var params = req.params;
    var entityId = params.entityId;
    var obj = req.body;

    if (entityId) {
        pool.getConnection(function(err, connection) {
            if (err) throw err;

            // Use the connection
            connection.query(
                'UPDATE person SET name=?, phone=?, city=?, email=?  WHERE id =?;',
                [obj.name, obj.phone, obj.city, obj.email, obj.id],

                // TODO: Error
                // 'UPDATE person SET name=:name, phone=:phone, city=:city, email=:email ' +
                // ' WHERE id =:id;',
                // {name: obj.name, phone: obj.phone, city: obj.city, email: obj.email, id: obj.id},

                function (error, results, fields) {
                    // And done with the connection
                    connection.release();
                    // connection.destroy();

                    // Handle error after the release
                    if (error) throw error;

                    // The number of changed rows
                    console.log('update ' + results.affectedRows + ' rows');

                    // Response to client browser
                    res.end('Done');

                    // Don't use the connection here, it has been returned to the pool.
                });
        });
    } else {
        var error = { "message" : "Cannot PUT a whole collection" };
        res.send(400, error);
    }


});

// Delete
router.delete('/person/:entityId', function(req, res) {
    var params = req.params;
    var entityId = params.entityId;

    if (entityId) {
        pool.getConnection(function(err, connection) {
            if (err) throw err;

            // Use the connection
            connection.query(
                'DELETE FROM person WHERE id = ?;',
                [parseInt(entityId)],
                function (error, results, fields) {
                    // And done with the connection
                    connection.release();
                    // connection.destroy();

                    // Handle error after the release
                    if (error) throw error;

                    // The number of changed rows
                    console.log('delete ' + results.affectedRows + ' rows');

                    // Response to client browser
                    res.end('Done');

                    // Don't use the connection here, it has been returned to the pool.
                });
        });
    } else {
        var error = { "message" : "Cannot DELETE a whole collection" };
        res.send(400, error);
    }
});

module.exports = router;