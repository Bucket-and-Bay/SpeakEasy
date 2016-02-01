var expect = require('chai').expect;
var server = require('../server/server.js');
var Analysis = require('../server/models/analysis.model.js');
var User = require('../server/models/user.model.js');
var request = require('supertest');

describe('', function () {

  beforeEach(function () {

  });

  describe('--Server Tests->', function () {

    // Route Tests
    describe('Route Testing->', function () {
      it('Responds to /', function testSlash(done) {
        request(server)
          .get('/')
          .expect(200, done);
      });

      it('404 everything else', function testPath(done) {
        request(server)
          .get('/foo/bar')
          .expect(404, done);
      });

      it('Should only access analyze if it has no currentUser', function (done) {
        request(server)
          .get('/api/analyze')
          .expect(404)
          .end(function (err, res) {
            if (err) {
              throw err;
            }
            done();
          });
      });

      it('Can access fetchAnalyses', function (done) {
        request(server)
          .get('/api/fetchAnalyses')
          .expect(200)
          .end(function (err, res) {
            if (err) {
              throw err;
            }
            expect(res.body).to.deep.equal({});
            done();
          });
      });

      it('Should only access getAnalysisById if it has an ID', function (done) {
        request(server)
          .get('/api/getAnalysisById')
          .expect(404)
          .end(function (err, res) {
            if (err) {
              throw err;
            }
            done();
          });
      });

      it('Should only access speechToText if it has videoURL', function (done) {
        request(server)
          .get('/api/speechToText')
          .expect(404)
          .end(function (err, res) {
            if (err) {
              throw err;
            }
            done();
          });
      });
    });


    // User login/logout/create Tests
    describe('Create/Login/Logout User tests->', function () {
      it('Inputs user into database', function (done) {
        User.remove({username : 'Jason'}).exec();

        var user = {
          username: 'Jason',
          password: 'jpass',
          phoneNumber: '8013453845'
        };
        request(server)
          .post('/user/signup')
          .send(user)
          .expect(201)
          .end(function (err, res) {
            if (err) {
              throw err;
            }
            done();
          });
      });

      it('Doesn\'t allow for users with the same username', function (done) {
        var user = {
          username: 'Jason',
          password: 'jpass',
          phoneNumber: '8013453845'
        };
        request(server)
          .post('/user/signup')
          .send(user)
          .expect(409)
          .end(function (err, res) {
            if (err) {
              throw err;
            }
            done();
          });
      });

      it('Logs out user', function (done) {
        var user = {
          username: 'Jason',
          password: 'jpass'
        };
        request(server)
          .get('/user/logout')
          .send(user)
          .expect(200)
          .end(function (err, res) {
            if (err) {
              throw err;
            }
            done();
          });
      });

      it('Logs in user if they exist in the database', function (done) {
        var user = {
          username: 'Jason',
          password: 'jpass'
        };
        request(server)
          .post('/user/login')
          .send(user)
          .expect(200)
          .end(function (err, res) {
            if (err) {
              throw err;
            }
            done();
          });
      });

      it('Doesn\'t allow user to login if they don\'t exist in the database', function (done) {
        var user = {
          username: 'Kylo',
          password: 'knightOfRen'
        };
        request(server)
          .post('/user/login')
          .send(user)
          .expect(401)
          .end(function (err, res) {
            if (err) {
              throw err;
            }
            done();
          });
      });

    });

  });

});


