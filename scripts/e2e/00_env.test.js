const { expect } = require("chai");

describe("env setup tests", function(){
  it("has target set up", function(){
    expect(href).to.be.ok;
    expect(()=>URL.parse(href)).not.to.throw;
  })
  it("run extended tests", function(){
    if(!is_extended){
      this.skip()
    }
  });

  describe("has proper devices", ()=>{
    it("Devices length", ()=>{
      expect(target_devices).to.have.property("length").above(0);
    });
    
    target_devices.forEach(dev=>{
      it(`${dev.name || "<unknown>"} is a valid device`, ()=>{
        expect(dev).to.have.property("name").to.be.a("string");
        expect(dev).to.have.property("viewport").to.be.a("object");
        expect(dev.viewport).to.have.property("width").to.be.a("number");
        expect(dev.viewport).to.have.property("height").to.be.a("number");
        expect(dev).to.have.property("userAgent").to.be.a("string");
      })
    })
  })
});