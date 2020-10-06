'use strict';
const fetch = require("node-fetch");
const handlers = require(".")
const supertest = require('supertest');

const ft = require("firebase-admin");
const {warn:warnMock, error: errorMock} = require("firebase-functions/lib/logger");
const expect = global.expect;
const path = `/api/v1/sendmail`;
const projectId =  "handlers-"+__filename.split("/").pop().slice(".")[0];

function* AddrGenerator(){
  for (let x=0; x<254; x++){
    for (let y=1; y <254; y ++){
      yield `192.168.${x}.${y}`;
    }
  }
  throw new Error("getAddr() has run out of IP addresses");
}

let _addr = AddrGenerator();
function getAddr(){
  return _addr.next().value;
}
describe("sendmail", ()=>{
  let server, request, app;
  beforeAll(()=>{
    app = ft.initializeApp({
      projectId,
    });
  });
  
  afterAll(async ()=>{
    await app.delete();
  });
  
  beforeEach(async ()=>{
    warnMock.mockReset();
    errorMock.mockReset();
    //Reset firestore emulator
    await fetch(`http://localhost:8080/emulator/v1/projects/${projectId}/databases/(default)/documents`, {method: "DELETE"} );
    server = await new Promise(r=>{
      let s = handlers.listen(()=> r(s));
    });
    request = supertest.agent(server);
  })
  afterEach((done)=>{
    server.close(done);
  })
  describe("Basic functions", ()=>{
    let testData = {
      fname: "Jean",
      lname: "Dupont",
      email: "j.dupont@lafrance.fr",
      comments: "Bonjour, le monde. Je suis Jean Dupont!"
    };

    test(`getAddr() generator`, ()=>{
      expect(getAddr()).toMatch(/192\.168\.\d+\.\d+/);
      expect(getAddr()).not.toEqual(getAddr());
    })
    test(`simple sendmail call`, async ()=>{
      const res = await request.post(path)
      .set('Content-Type', "application/json")
      .set('X-Forwarded-For', getAddr())
      .send(testData);
      expect(res).toHaveProperty("statusCode", 200);
      expect(res.get("Content-Type")).toMatch(/text\/plain/);
      expect(errorMock).not.toHaveBeenCalled();
      expect(warnMock).not.toHaveBeenCalled();
      let mails = await app.firestore().collection("mail").get();
      expect(mails).toHaveProperty("size", 1);
      expect(mails.docs[0].data()).toMatchSnapshot();
    });
    test("Implements rate-limit", async()=>{
      let addr = getAddr();
      for(let c=0; c< 2; c++){
        const res = await request.post(path)
        .set('Content-Type', "application/json")
        .set('X-Forwarded-For', addr)
        .send(testData);
        expect(res).toHaveProperty("statusCode", 200);
      }
      for(let c=0; c< 2; c++){
        const res = await request.post(path)
        .set('Content-Type', "application/json")
        .set('X-Forwarded-For', addr)
        .send(testData);
        expect(res).toHaveProperty("statusCode", 429);
        expect(res.text).toEqual("Too many requests, please try again later.");
      }
    });
  });
  describe("localized errors", ()=>{
    [
      ["fr", "Adresse mail"], 
      ["fr,fr-FR;q=0.8,en-US;q=0.5,en;q=0.3", "Adresse mail"], 
      ["en", "The Email Address"], 
      ["es", "The Email Address"]/*uses default lang*/
    ].forEach(([lang, errString])=>{
      test(`rejects missing email (${lang})`, async ()=>{
        const res = await request.post(path)
        .set('Content-Type', "application/json")
        .set('X-Forwarded-For', getAddr())
        .set("Accept-Language", lang)
        .send({
          fname: "Jean",
          lname: "Dupont",
          comments: "Bonjour, le monde. Je suis Jean Dupont!"
        });
        expect(res).toHaveProperty("statusCode", 400);
        expect(res.get("Content-Type")).toMatch(/text\/plain/);
        expect(res.text).toMatch(errString);
        expect(errorMock).not.toHaveBeenCalled();
        expect(warnMock).not.toHaveBeenCalled();
        let mails = await app.firestore().collection("mail").get();
        expect(mails).toHaveProperty("size", 0);
      });
    });
  })

})
