/**
 * Created by quangvu on 5/5/17.
 */
const express = require('express');
const router = express.Router();
const fs = require('fs');

var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : '192.168.100.11',
    user     : 'root',
    password : 'root123',
    database : 'contactlist'
});

//const formidable = require('formidable'), http = require('http'), util = require('util');

router.get('/person', function(req, res) {

    connection.connect();

    connection.query('SELECT id, name, phone, city, email FROM person;', function (err, results, fields) {
        if (err) {
            res.end('Error when connect to MySQL');
            return;
        }

        res.end(JSON.stringify(results));
    });

    connection.end();
});

// Add New
router.post('/person', function(req, res) {
    var obj = req.body;

    connection.connect();
    connection.query('INSERT INTO person (name, phone, city, email) VALUES (?, ?, ?, ?);',
        [obj.name, obj.phone, obj.city, obj.email], function (error, results, fields) {
        if (error) {
            error.end('Error when add new record');
            return;
        }
    });
    connection.end();

    //res.end('Done'); => DO NOT ADD THIS LINE!!!
});

// Update
router.put('/person/:entityId', function(req, res) {
    var params = req.params;
    var entityId = params.entityId;
    var obj = req.body;
    console.log(obj);

    if (entityId) {
        connection.connect();
        //connection.query('UPDATE person SET name=:name, phone=:phone, city=:city, email=:email WHERE id =:id;',
        connection.query('UPDATE person SET name=?, phone=?, city=?, email=? WHERE id =?;',
            //{id: obj.id, name: obj.name, phone: obj.phone, city: obj.city, email: obj.email},
            [obj.name, obj.phone, obj.city, obj.email, obj.id],
            function (error, results, fields) {
                if (error) {
                    error.end('Error when add new record');
                    return;
                }
            });
        connection.end();
    } else {
        var error = { "message" : "Cannot PUT a whole collection" };
        res.send(400, error);
    }
});

// // Delete
// router.delete('/person/:entityId', function(req, res) {
//     var params = req.params;
//     var entityId = params.entityId;
//     //var obj = req.body;
//
//     if (entityId) {
//         pg.connect(conString, function (err, client, done) {
//             if (err) {
//                 res.end('Error when connect to postgresql');
//                 return;
//             }
//             client.query('DELETE FROM person WHERE id = $1',
//                 [parseInt(entityId)],
//                 function(err, result){
//                     done();
//                     if (err) {
//                         res.end('Error when delete record');
//                         return;
//                     }
//                     console.log(entityId);
//                 });
//         });
//         res.end('Done');
//     } else {
//         var error = { "message" : "Cannot DELETE a whole collection" };
//         res.send(400, error);
//     }
// });

module.exports = router;