/**
 * Created by quangvu on 5/5/17.
 */
const express = require('express');
const router = express.Router();
const fs = require('fs');
var mysql      = require('mysql');
const formidable = require('formidable'), http = require('http'), util = require('util');

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
    //host     : '127.0.0.1',
    host     : '192.168.100.4',
    user     : 'root',
    //password : 'root123',
    password: 'root',
    database : 'demo'
});

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

router.get('/meal', function(req, res) {

    pool.getConnection(function(err, connection) {
        if (err) throw err;

        // Use the connection
        connection.query('SELECT `id`, `name`, `desc`, `rating` FROM `MEAL`;',
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

router.post('/meal', function(req, res) {
    var form = new formidable.IncomingForm();
    res.writeHead(200, {'content-type': 'text/plain'});
    var postLastPath = __dirname.lastIndexOf('/');
    var rootDir = __dirname.substring(0, postLastPath);
    form.uploadDir = rootDir + "/public/photos/";

    form.keepExtensions = true;
    form.parse(req, function(err, fields, files) {
        //res.writeHead(200, {'content-type': 'text/plain'});
        //res.write('received upload:\n\n');
        //res.end(util.inspect({fields: fields, files: files}));

        pool.getConnection(function(err, connection) {
            if (err) throw err;
            // Use the connection
            connection.query(
                // Solution 1
                // 'INSERT INTO person (name, phone, city, email) VALUES (?, ?, ?, ?);',
                // [obj.name, obj.phone, obj.city, obj.email],
                // Solution 2
                'INSERT INTO MEAL (`name`, `rating`, `desc`) VALUES (?, ?, ?)',
                //[fields.name, 1, "_" + files.photo.name],
                [fields.name, fields.rating, "_" + files.file.name],
                function (error, results, fields) {
                    // And done with the connection
                    connection.release();
                    // connection.destroy();

                    console.log(files.file.path);
                    //var newPath = form.uploadDir + results.insertId + "_" + files.photo.name;
                    var newPath = form.uploadDir + results.insertId + "_" + files.file.name;
                    //fs.rename(files.photo.path, newPath, function(err) {
                    fs.rename(files.file.path, newPath, function(err) {
                        if (err) {
                            //res.end('cannot rename file ' + files.photo.path);
                            res.end('cannot rename file ' + files.file.path);
                        }
                    });

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





});

module.exports = router;