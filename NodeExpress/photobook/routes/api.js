/**
 * Created by quangvu on 5/5/17.
 */
const express = require('express');
const router = express.Router();
const pg = require('pg');
const fs = require('fs');

const conString = "postgres://tom:123@127.0.0.1/photobook";
const formidable = require('formidable'), http = require('http'), util = require('util');

router.get('/photo', function(req, res) {
   pg.connect(conString, function (err, client, done) {
       if (err) {
           res.end('Error when connect to postgresql');
           return;
       }
       client.query('SELECT id, title, path FROM photo;', function (err, result) {
           done();
           if (err) {
               res.end('Error when querying');
               return;
           }
           res.json(result.rows);
       });
   });
});

router.post('/photo', function(req, res) {
    var form = new formidable.IncomingForm();
    res.writeHead(200, {'content-type': 'text/plain'});
    //form.uploadDir = "/Users/quangvu/Storage/Working/Github/web_dev/NodeExpress/photobook/public/photos";
    var postLastPath = __dirname.lastIndexOf('/');
    var rootDir = __dirname.substring(0, postLastPath);
    form.uploadDir = rootDir + "/public/photos/";

    form.keepExtensions = true;
    form.parse(req, function(err, fields, files) {
        //res.writeHead(200, {'content-type': 'text/plain'});
        //res.write('received upload:\n\n');
        //res.end(util.inspect({fields: fields, files: files}));

        pg.connect(conString, function (err, client, done) {
            if (err) {
                res.end('Error when connect to postgresql');
                return;
            }
            client.query('INSERT INTO photo (title, path) VALUES ($1, $2) RETURNING id',
                [fields.title, "/photos/_" + files.photo.name],
            function(err, result){
                done();
                if (err) {
                    res.end('Error when add new record');
                    return;
                }
                //console.log(result.rows[0].id)
                var newPath = form.uploadDir + result.rows[0].id + "_" + files.photo.name;
                fs.rename(files.photo.path, newPath, function(err) {
                   if (err) {
                       res.end('cannot rename file ' + files.photo.path);
                   }
                });
                //res.end('done');
            });
        });
        res.end('Done');
    });

});



module.exports = router;