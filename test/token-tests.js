var EDC = artifacts.require('./EDC.sol');
var EDCCrowdSale = artifacts.require('./EDCCrowdSale.sol');

contract('EDC check', function(accounts){
    //coin info
    const name = "Edcoin";
    const decimals = 18;
    const totalSupply = 900000000;
    const symbol = "EDC";

    it('Check Initialization', function(){
        var tokenContract;
        var crowdSaleContract;

        return EDC.deployed().then(function(instance){
            tokenContract = instance;

            return EDCCrowdSale.deployed();            
        }).then(function(instance){
            crowdSaleContract = instance;

            return tokenContract.decimals.call();
        }).then(function(contractDecimals){
            assert.equal(contractDecimals, decimals, "Incorrect decimals");
            return tokenContract.name.call();
        }).then(function(contractName){
            assert.equal(contractName, name, "Incorrect name");
            return tokenContract.symbol.call();
        }).then(function(contractSymbol){
            assert.equal(contractSymbol, symbol, "Incorrect symbol");
            return tokenContract.totalSupply.call();
        }).then(function(contractTotalSupply){
            assert.equal(contractTotalSupply.toNumber(), totalSupply * Math.pow(10, 18), "Incorrect total supply");

            return tokenContract.distributionAddress.call();
        }).then(function(distributionAddress){
            assert.equal(distributionAddress, crowdSaleContract.address, "Incorrect distribution address");
        });
    });

    it("Check transfers", function(){
        // TODO
    });

    it("Check basic functions", function(){
        // TODO
    });
});