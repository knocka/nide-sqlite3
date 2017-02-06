//var sqlite3 = require('..');
var assert = require('assert');
var fs = require('fs');
var helper = require('./support/helper');
var sqlite3 = require('sqlite3').verbose();

describe('my test', function () {
    var db;
    before(function (done) {
        db = new sqlite3.Database(':memory:');
        db.run("CREATE TABLE lorem (info TEXT)", done);
    });

    var inserted = 0;
    var retrived = 0;
    it('should insert', function (done1) {
        db.serialize(function () {
            var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
            for (var i = 0; i < 10; i++) {
                stmt.run("Ipsum " + i);
                console.log("Ipsum " + i);
                inserted++;
            }
            stmt.finalize();
            db.wait(function () {
                assert.equal(inserted, 10);
                done1();
            });
        });
    });

    it('should retrive', function (done2) {
        db.each("SELECT rowid AS id, info FROM lorem", function (err, row) {
            console.log(row.id + ": " + row.info);
            retrived++;
        });
        db.wait(function () {
            assert.equal(retrived, 10);
            done2();
        });
        db.close();
    });
});






