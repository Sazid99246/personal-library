/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const expect = chai.expect;

chai.use(chaiHttp);

let id1 //for use later when we need a valid id.

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  // test('#example Test GET /api/books', function(done){
  //    chai.request(server)
  //     .get('/api/books')
  //     .end(function(err, res){
  //       assert.equal(res.status, 200);
  //       assert.isArray(res.body, 'response should be an array');
  //       assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
  //       assert.property(res.body[0], 'title', 'Books in array should contain title');
  //       assert.property(res.body[0], '_id', 'Books in array should contain _id');
  //       done();
  //     });
  // });
  // /*
  // * ----[END of EXAMPLE TEST]----
  // */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
            .post('/api/books')
            .send({
              title: 'testbook onerino',
              commentcount: 0,
              comments: []
            })
            .end(function(err, res) {
              assert.equal(res.status, 200)
              assert.equal(res.body.title, 'testbook onerino')
              assert.equal(res.body.commentcount, 0)
              assert.isArray(res.body.comments)
              id1 = res.body._id
              console.log('\tid1 set to ' + id1)
              done()
            })
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
            .post('/api/books')
            .send({
              commentcount: 0,
              comments: []
            })
            .end(function(err, res) {
              assert.equal(res.body, 'missing required field title');
              done()
            })
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
            .get('/api/books')
            .end(function(err, res){
              assert.equal(res.status, 200);
              assert.isArray(res.body, 'response should be an array');
              assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
              assert.property(res.body[0], 'title', 'Books in array should contain title');
              assert.property(res.body[0], '_id', 'Books in array should contain _id');
              done();
        });
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        let invalid_id = '22389fshdsfsd35757202'
        chai.request(server)
            .get(`/api/books/${invalid_id}`)
            .end(function(err, res){
              assert.equal(res.body, 'no book exists')
              done()
            })
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
            .get(`/api/books/${id1}`)
            .end(function(err, res){
              assert.equal(res.status, 200)
              assert.equal(res.body._id, id1)
              assert.equal(res.body.title, 'testbook onerino')
              assert.isArray(res.body.comments)
              done()
            })
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
            .post(`/api/books/${id1}`)
            .send({ comment: 'inputting a test comment here' })
            .end(function(err,res) {
              //console.log(res.body)
              assert.equal(res.status, 200)
              assert.equal(res.body.title, 'testbook onerino')
              //we need to make a deep copy to compare arrays and objects in full (different mem reference will not match)
              //note how the expect syntax is different in format
              expect(res.body.comments).deep.to.equal([ 'inputting a test comment here' ])
              done();
            })
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        chai.request(server)
        .post(`/api/books/${id1}`)
        .send({ })
        .end(function(err,res) {
          assert.equal(res.body, 'missing required field comment')
          done();
        })
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        let invalid_id = '22389fshdsfsd35757202'
        chai.request(server)
            .post(`/api/books/${invalid_id}}`)
            .send({ comment: 'inputting a test comment here' })
            .end(function(err,res) {
              assert.equal(res.body, 'no book exists')
              done();
            })
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai.request(server)
            .delete(`/api/books/${id1}`)
            .end(function(err, res){
              assert.equal(res.body, 'delete successful')
            })
        done();
      });

      test('Test DELETE /api/books/[id] with id not in db', function(done){
        let invalid_id = '22389fshdsfsd35757202'
        chai.request(server)
            .delete(`/api/books/${invalid_id}`)
            .end(function(err, res){
              assert.equal(res.body, 'no book exists')
            })
        done();
      });

    });

  });

});