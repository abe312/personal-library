/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *
 */

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);
var __id;
// setting the __id
chai
  .request(server)
  .post('/api/books')
  .send({ title: 'sample title' })
  .end(function(err, res) {
    __id = res.body._id;
  });

suite('Functional Tests', function() {
  /*
   * ----[EXAMPLE TEST]----
   * Each test should completely test the response of the API end-point including response status code!
   */

  suite('Routing tests', function() {
    test('#example Test GET /api/books', function(done) {
      chai
        .request(server)
        .get('/api/books')
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body, 'response should be an array');
          assert.property(
            res.body[0],
            'commentcount',
            'Books in array should contain commentcount'
          );
          assert.property(
            res.body[0],
            'title',
            'Books in array should contain title'
          );
          assert.property(
            res.body[0],
            '_id',
            'Books in array should contain _id'
          );
          done();
        });
    });
    /*
     * ----[END of EXAMPLE TEST]----
     */

    suite(
      'POST /api/books with title => create book object/expect book object',
      function() {
        test('Test POST /api/books with title', function(done) {
          chai
            .request(server)
            .post('/api/books')
            .send({ title: 'sample title' })
            .end(function(err, res) {
              assert.equal(res.status, 200);
              assert.property(res.body, '_id');
              assert.equal(res.body.title, 'sample title');
              assert.isArray(res.body.comments);
            });
          done();
        });

        test('Test POST /api/books with no title given', function(done) {
          chai
            .request(server)
            .post('/api/books')
            .send({})
            .end(function(err, res) {
              assert.equal(res.status, 400);
              assert.equal(res.text, 'no title provided');
            });
          done();
        });
      }
    );

    suite('GET /api/books => array of books', function() {
      test('Test GET /api/books', function(done) {
        chai
          .request(server)
          .get('/api/books')

          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.property(res.body[0], 'title');
            assert.property(res.body[0], '_id');
            assert.property(res.body[0], 'commentcount');
          });
        done();
      });
    });

    suite('GET /api/books/[id] => book object with [id]', function() {
      test('Test GET /api/books/[id] with id not in db', function(done) {
        chai
          .request(server)
          .get('/api/books/' + 12345)

          .end(function(err, res) {
            assert.equal(res.status, 400);
            assert.equal(res.text, 'no book by given id');
          });
        done();
      });

      test('Test GET /api/books/[id] with valid id in db', function(done) {
        chai
          .request(server)
          .get('/api/books/' + __id)
          .send()
          .end(function(err, res) {
            // console.log('id', __id);
            // console.log(res.body)
            assert.equal(res.status, 200);
            assert.equal(res.body[0]._id, __id);
            assert.property(res.body[0], 'title');
          });
        done();
      });
    });

    suite(
      'POST /api/books/[id] => add comment/expect book object with id',
      function() {
        test('Test POST /api/books/[id] with comment', function(done) {
          chai
            .request(server)
            .post('/api/books/' + __id)
            .send({
              comment: 'test comment #1',
            })
            .end(function(err, res) {
              assert.equal(res.status, 200);
              assert.isArray(res.body.comments);
              assert.equal(res.body._id, __id);
              assert.property(res.body, 'title');
              assert.equal(res.body.comments[0], 'test comment #1');
            });
          done();
        });
      }
    );

    suite('DELETE /api/books/[id] => delete book with id', function() {
      test('Test DELETE /api/books/[id]', function(done) {
        chai
          .request(server)
          .delete('/api/books/' + __id)

          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'delete successful');
          });
        done();
      });
    });
  });
});
