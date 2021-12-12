const { assert } = require("chai");

const Pokemon = artifacts.require("./contracts/Pokemon.sol");

require("chai")
    .use(require("chai-as-promised"))
    .should();

contract("Pokemon NFT", (accounts) => {

    let contract;
    const ContractName = "Pokemon";
    const ContractSymbol = "PKM";

    describe("deployment", async () => {
        it("deploys successfully", async () => {
            
            contract = await Pokemon.deployed();

            const address = contract.address;

            assert.notEqual(address, 0x0);
            assert.notEqual(address, "");
            assert.notEqual(address, null);
            assert.notEqual(address, undefined);

        });

        it("has a name", async () => {
            const name = await contract.name();
            assert.equal(name, ContractName);
        });

        it("has a symbol", async () => {
            const symbol = await contract.symbol();
            assert.equal(symbol, ContractSymbol);
        });
    });

    describe("token distribution", async () => {
        it("mints token", async () => {

            const defaultURI = "https://www.token-uri.com/nft";

            await contract.mint(accounts[0], defaultURI);

            const totalSupply = await contract.totalSupply();
            assert.equal(totalSupply.toString(), "1", "total supply is correct");

            let balance = await contract.balanceOf(accounts[0]);
            assert.equal(balance.toString(), "1", "balanceOf is correct");

            let owner = await contract.ownerOf("0");
            assert.equal(owner.toString(), accounts[0].toString(), "ownerOf is correct");
            owner = await contract.tokenOfOwnerByIndex(accounts[0], 0);

            balance = await contract.balanceOf(accounts[0]);
            let nfts = [];
            for(let i = 0; i < balance; i++) {
                let id = await contract.tokenOfOwnerByIndex(accounts[0], i);
                nfts.push(id);
            }
            let expected = ["0"]
            assert.equal(nfts.toString(), expected.toString(), "nfts is correct");

            const tokenURI = await contract.tokenURI("0");
            assert.equal(tokenURI, defaultURI);
        });
    });

});