var cosToken = artifacts.require('./EDC.sol');
var safeMath = artifacts.require('./SafeMath.sol');
var crowdSalesContract = artifacts.require('./EDCCrowdSale.sol');
var tokenTimelockContract = artifacts.require('./EDCTimelock.sol');

module.exports = function(deployer, network, accounts){
    var tokenInstance;
    var crowdSalesInstance;
    var today = Math.round(Date.now() / 1000);
    var days30 = today + (30 * 24 * 60 * 60);
    var days365 = today + (365 * 24 * 60 * 60);

    var minutes1 = today + (1 * 60);
    
    var ethPriceUSD = 207;
    var raiseAmount = 25000000;
    var raiseAmountEth = Math.round(raiseAmount / ethPriceUSD);

    deployer.deploy(safeMath);
    deployer.link(safeMath, cosToken);

    deployer.deploy(cosToken).then(function(instance){
        tokenInstance = instance;
        return deployer.deploy(
            crowdSalesContract,
            cosToken.address, 
            accounts[0], 
            raiseAmountEth, 
            today, days30);
    }).then(function(instance){
        crowdSalesInstance = instance;
        return tokenInstance.setDistributionAddress(crowdSalesContract.address, {"from": accounts[0]});
    }).then(function(){
        return deployer.deploy(tokenTimelockContract, cosToken.address, accounts[0], minutes1);
    });
    
}