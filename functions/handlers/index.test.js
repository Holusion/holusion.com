'use strict';
const handlers = require(".")
const supertest = require('supertest');

const {warn:warnMock, error: errorMock} = require("firebase-functions/lib/logger");

const expect = global.expect;


describe("redirect / to best language", ()=>{
  let request, server;
  beforeAll(async ()=>{
    warnMock.mockReset();
    errorMock.mockReset();
    //Reset firestore emulator
    server = await new Promise(r=>{
      let s = handlers.listen(()=> r(s));
    });
    request = supertest.agent(server);
  });

  afterAll((done)=>{
    server.close(done);
  });
  test(`default redirect / to /fr/`, async ()=>{
    await request.get("/")
    .expect(302)
    .expect('Location', "/fr/");
  });

  [
    ["fr", "/fr/"],
    ["fr,fr-FR;q=0.8,en-US;q=0.5,en;q=0.3", "/fr/"],
    ["fr-CH, fr;q=0.9, en;q=0.8, de;q=0.7, *;q=0.5", "/fr/"],
    ["en", "/en/"],
    ["en-US,en;q=0.5", "/en/"],
  ].forEach(([lang, resValue])=>{
    test(`${lang} to ${resValue}`, async ()=>{
      await request.get("/")
      .set("Accept-Language", lang)
      .expect(302)
      .expect('Location', resValue);
    })
  })
})