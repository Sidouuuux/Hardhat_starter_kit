const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Token contract", function () {
  let Token;
  let token;
  let owner
  let addr1
  let addr2
  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners()

    Token = await ethers.getContractFactory("Token");
    token = await Token.deploy();
    await token.deployed();
  });

  it("should have correct name, symbol, and decimals", async function () {
    expect(await token.name()).to.equal("Token");
    expect(await token.symbol()).to.equal("TKN");
    expect(await token.decimals()).to.equal(18);
  });

  it("should mint tokens when the mint function is called", async function () {

    const initialBalance = await token.balanceOf(await addr2.address);
    const amount = ethers.utils.parseEther("100");

    await token.connect(addr2).mint(amount);

    expect(await token.balanceOf(await addr2.address)).to.equal(initialBalance.add(amount));
  });
});
