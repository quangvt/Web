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

router.get('/person', function(req, res) {
    pg.connect(conString, function (err, client, done) {
        if (err) {
            res.end('Error when connect to postgresql');
            return;
        }
        client.query('SELECT id, name, phone, email, city FROM person;',
            function (err, result) {
                done();
                if (err) {
                    res.end('Error when querying');
                    return;
                }
                res.json(result.rows);
            });
    });
});

// Add New
router.post('/person', function(req, res) {
    var obj = req.body;

    pg.connect(conString, function (err, client, done) {
        if (err) {
            res.end('Error when connect to postgresql');
            return;
        }
        client.query('INSERT INTO person (name, phone, email, city) VALUES' +
            ' ($1, $2, $3, $4) RETURNING id',
            [obj.name, obj.phone, obj.email, obj.city],
            function(err, result){
                done();
                if (err) {
                    res.end('Error when add new record');
                    return;
                }
                console.log(obj.name, obj.phone, obj.email, obj.city);
            });
    });
    res.end('Done');
});

// Update
router.put('/person/:entityId', function(req, res) {
    var params = req.params;
    var entityId = params.entityId;
    var obj = req.body;

    if (entityId) {
        pg.connect(conString, function (err, client, done) {
            if (err) {
                res.end('Error when connect to postgresql');
                return;
            }
            client.query('UPDATE person SET name=$1, phone=$2, email=$3, city=$4 WHERE id = $5',
                [obj.name, obj.phone, obj.email, obj.city, obj.id],
                function(err, result){
                    done();
                    if (err) {
                        res.end('Error when update record');
                        return;
                    }
                });
        });
        res.end('Done');
    } else {
        var error = { "message" : "Cannot PUT a whole collection" };
        res.send(400, error);
    }
});

// Delete
router.delete('/person/:entityId', function(req, res) {
    var params = req.params;
    var entityId = params.entityId;
    //var obj = req.body;

    if (entityId) {
        pg.connect(conString, function (err, client, done) {
            if (err) {
                res.end('Error when connect to postgresql');
                return;
            }
            client.query('DELETE FROM person WHERE id = $1',
                [parseInt(entityId)],
                function(err, result){
                    done();
                    if (err) {
                        res.end('Error when delete record');
                        return;
                    }
                    console.log(entityId);
                });
        });
        res.end('Done');
    } else {
        var error = { "message" : "Cannot DELETE a whole collection" };
        res.send(400, error);
    }
});

module.exports = router;