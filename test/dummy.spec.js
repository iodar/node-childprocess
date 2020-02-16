const { before } = require("mocha");
const { expect } = require("chai");

before(() => {
  // todo: 2020-02-16 iodar clean up docker containers and images
});

describe("should do sth", () => {
  it("sth", () => {
    expect(true).to.be.eq(true);
  });
});
