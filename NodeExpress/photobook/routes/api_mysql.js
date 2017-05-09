/**
 * Created by quangvu on 5/5/17.
 */
const express = require('express');
const router = express.Router();
var mysql = require('mysql');
const fs = require('fs');

var connection = mysql.createConnection({
    host: '192.168.100.11',
    user: 'root',
    password: 'root123',
    database: 'contactlist'
});

//const formidable = require('formidable'), http = require('http'), util = require('util');

router.get('/person', function(req, res) {
   connection.connect();

   connection.query('SELECT 1 + 1 AS solution', 'values', function(error, results, fields) {
       if (error) throw error;
       console.log('The solution is: ', results[0].solution);
   })

   connection.close();
});
//
// router.get('/person', function(req, res) {
//     pg.connect(conString, function (err, client, done) {
//         if (err) {
//             res.end('Error when connect to postgresql');
//             return;
//         }
//         client.query('SELECT id, name, phone, email, city FROM person;',
//             function (err, result) {
//                 done();
//                 if (err) {
//                     res.end('Error when querying');
//                     return;
//                 }
//                 res.json(result.rows);
//             });
//     });
// });
//
// // Add New
// router.post('/person', function(req, res) {
//     var obj = req.body;
//
//     pg.connect(conString, function (err, client, done) {
//         if (err) {
//             res.end('Error when connect to postgresql');
//             return;
//         }
//         client.query('INSERT INTO person (name, phone, email, city) VALUES' +
//             ' ($1, $2, $3, $4) RETURNING id',
//             [obj.name, obj.phone, obj.email, obj.city],
//             function(err, result){
//                 done();
//                 if (err) {
//                     res.end('Error when add new record');
//                     return;
//                 }
//                 console.log(obj.name, obj.phone, obj.email, obj.city);
//             });
//     });
//     res.end('Done');
// });
//
// // Update
// router.put('/person/:entityId', function(req, res) {
//     var params = req.params;
//     var entityId = params.entityId;
//     var obj = req.body;
//
//     if (entityId) {
//         pg.connect(conString, function (err, client, done) {
//             if (err) {
//                 res.end('Error when connect to postgresql');
//                 return;
//             }
//             client.query('UPDATE person SET name=$1, phone=$2, email=$3, city=$4 WHERE id = $5',
//                 [obj.name, obj.phone, obj.email, obj.city, obj.id],
//                 function(err, result){
//                     done();
//                     if (err) {
//                         res.end('Error when update record');
//                         return;
//                     }
//                 });
//         });
//         res.end('Done');
//     } else {
//         var error = { "message" : "Cannot PUT a whole collection" };
//         res.send(400, error);
//     }
// });
//
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