const chai = require("chai")
const chaiHttp = require("chai-http");
const app = require("./server")
const expect = chai.expect;
chai.use(chaiHttp);

describe('API Endpoints', () => {
      let noteId,accessToken;

      it("should return access token upon login",(done) => {
        chai
          .request(app)
          .post("/login")
          .send({ email: "admin1@gmail.com", password: "123456" })
          .end((err,res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property("status").to.be.true;
            expect(res.body).to.have.property("access_token").to.be.a("string");
            accessToken = res.body.access_token

            done()
          })
      })

      it("should create a new note", (done) => {
        chai
          .request(app)
          .post("/notes")
          .set("Authorization", `Bearer ${accessToken}`)
          .send({ title: "Title-1", content: "Test note-1" })
          .end((err, res) => {
            expect(res).to.have.status(201);
            expect(res.body).to.have.property("status").to.be.true;
            expect(res.body).to.have.property("content");
            expect(res.body.content).to.have.property("data");
            noteId = res.body.content.data._id; // Save the ID for future tests
            done();
          });
      });

      it('should retrieve all notes', (done) => {
        chai
          .request(app)
          .get("/notes")
          .set("Authorization", `Bearer ${accessToken}`)
          .end((err,res) => {
              expect(res).to.have.status(200);
              expect(res.body).to.have.property("status").to.be.true;
              expect(res.body).to.have.property("content");
              expect(res.body.content).to.have.property("meta");
              expect(res.body.content.meta).to.have.property("total");
              expect(res.body.content.meta).to.have.property("pages");
              expect(res.body.content.meta).to.have.property("page");
              expect(res.body.content).to.have.property("data");
              done()
          })
      })


      it('should retrieve note',(done) => {
         chai
           .request(app)
           .get(`/notes/${noteId}`)
           .set("Authorization", `Bearer ${accessToken}`)
           .end((err,res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property("status").to.be.true;
            expect(res.body).to.have.property("content");
            expect(res.body.content).to.have.property("data");
            const retrievedNote = res.body.content.data;
            expect(retrievedNote).to.have.property("_id").equal(noteId);
            done();
          })
      })

      it('should update an existing note',(done) => {
        chai
          .request(app)
          .patch(`/notes/${noteId}`)
          .set("Authorization", `Bearer ${accessToken}`)
          .send({ title: "New Title-1", content: "This is Updated Note-1" })
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property("status").to.be.true;
            expect(res.body).to.have.property("content");
            expect(res.body.content).to.have.property("data");
            const updatedNote = res.body.content.data;
            expect(updatedNote).to.have.property("_id").equal(noteId);
            expect(updatedNote).to.have.property("title").equal("New Title-1");
            expect(updatedNote).to.have.property("content").equal("This is Updated Note-1");

            done()
          });
      })
      
      it('should delete an existing note',(done) => {
        chai
          .request(app)
          .delete(`/notes/${noteId}`)
          .set("Authorization", `Bearer ${accessToken}`)
          .end((err,res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property("status").to.be.true;

            done();
          })
      })

})