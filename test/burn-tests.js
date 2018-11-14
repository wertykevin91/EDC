const EDC = artifacts.require('./EDC.sol');

contract('EDC check', function(accounts){
    //coin info
    const name = "Edcoin";
    const decimals = 18;
    const totalSupply = 900000000;
    const symbol = "EDC";

    it("Check basic functions", function(){
        // Burn

        var tokenContract;
        var startingTotalSupply;
        const burnAmount = 500 * Math.pow(10, 18);
        
        return EDC.deployed().then((instance)=>{
            tokenContract = instance;
            return tokenContract.totalSupply();
        }).then((totalSupply)=>{
            startingTotalSupply = totalSupply.toNumber(); 
            // token does not need to be transferrable to be burnable
            return tokenContract.burnSent(burnAmount);
        }).then(()=>{
            return tokenContract.totalSupply();
        }).then((totalSupply)=>{
            assert.strictEqual(totalSupply.toNumber(), startingTotalSupply - burnAmount, "Invalid total supply after burning.")
        });
    });
});