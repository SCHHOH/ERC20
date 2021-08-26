require('dotenv').config();

const should = require('should');
const Token = artifacts.require("MyToken");

//Importing Payable Contract as a Javascript class

contract("MyToken", (accounts) => {
    let token, admin, user, exchange;

     [admin, user, exchange] = [accounts[0], accounts[1], accounts[2]];

    // REVERT_MSG = "Returned error: VM Exception while processing transaction: revert";
    const REVERT_MINTER_MSG = "Returned error: VM Exception while processing transaction: revert onlySupplyController -- Reason given: onlySupplyController."

    //This before runs before each it statement.
    before(async () => {
      token = await Token.deployed();
    });

    console.log(admin, user, exchange);

    describe("verifying contract", async () => {

            it(`total supply should be zero`, async () => {
              let _supply = await token.totalSupply();

              assert.equal(0, _supply, "Supply is zero");
            });

            it(`values`, async () => {
              let _name = await token.name();
              let _symbol = await token.symbol();
              assert.equal("Token", _name, "Name is Token");
              assert.equal("TKN", _symbol, "Symbol is TKN");
            });


            it(`Mint token to users account`, async () => {
              let _amount = 1;
              await token.increaseSupply(_amount, {from: admin});
              await token.transfer(user, _amount, {from: admin});
              let _balance = await token.balanceOf(user);
              assert.equal(_amount, _balance, "Amount has been deposited into user's account");
            });
            it("User shouldn't be able to mint", async () => {
              let _amount = 1;
              await token.increaseSupply(_amount, {from: user}).should.be.rejectedWith(REVERT_MINTER_MSG);
            });

            it("User can transfer", async () => {
              let _amount = 1;
              await token.increaseSupply(_amount, {from: admin});
              await token.transfer(user, _amount, {from: admin});
              await token.transfer(admin, _amount, {from: user});
              let _balance = await token.balanceOf(admin);
              assert.equal(_amount, _balance, "Transfer mechanism");
            });

            it("Increase Allowance of exchange", async () => {
              let _amount = 2;
              let _send = 1;
              await token.increaseSupply(_amount, {from: admin});
              await token.transfer(user, _amount, {from: admin});
              await token.approve(exchange, _send, {from: user});
              let _balance = await token.allowance(user, exchange, {from: admin});
              assert.equal(_send, _balance, "Exchange can spend");
            });

            it("Increase Allowance of exchange", async () => {
              let _amount = 2;
              let _send = 1;
              await token.increaseSupply(_amount, {from: admin});
              await token.transfer(user, _amount, {from: admin});
              await token.approve(exchange, _send, {from: user});
              let _balance = await token.allowance(user, exchange, {from: user});
              assert.equal(_send, _balance, "Exchange can spend (user checks)");
            });
    });
    describe("verifying contract", async () => {

            it("Transfer through and exchange", async () => {
              const _amount = 2;
              const _send = 1;
              await token.increaseSupply(_amount, {from: admin});
              await token.transfer(user, _amount, {from: admin});
              await token.approve(exchange, _send, {from: user});
              await token.transferFrom(user, admin, _send, {from: exchange});
              let _balance = await token.balanceOf(admin);
              await console.log(_balance)

              assert.equal(2, _balance, "Exchange can spend (user checks)");
            });
    });

});
