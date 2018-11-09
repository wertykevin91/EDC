const EDC = artifacts.require('./EDC.sol');
const EDCCrowdSale = artifacts.require('./EDCCrowdSale.sol');

contract("EDCCrowdSale Tests", async(accounts) => {
    it('Check distribution address balance', async() => {
        let tokenContract = await EDC.deployed();
        let crowdsaleContract = await EDCCrowdSale.deployed();
        let crowdsaleContractTokenInitial = 100000000 * Math.pow(10, 18);

        let distributionAddress = await tokenContract.distributionAddress.call();
        assert.equal(distributionAddress, crowdsaleContract.address, "Invalid contract address");

        //console.log(tokenContract);
        await tokenContract.distributeTokens(crowdsaleContract.address, crowdsaleContractTokenInitial);
        
        // verify contract has tokens

        let crowdsaleContractBalance = await tokenContract.balanceOf.call(crowdsaleContract.address);
        //console.log(crowdsaleContractBalance.toNumber());
        assert.equal(crowdsaleContractTokenInitial, crowdsaleContractBalance.toNumber(), "Invalid contract balance");
        console.log('asserted');
    });
    
    // buy tokens from contract

    it("Check whitelisting & purchase", async() =>{
        let tokenContract = await EDC.deployed();
        let crowdsaleContract = await EDCCrowdSale.deployed();

        let whitelistError = false;

        try{
            await web3.eth.sendTransaction({
                "from": accounts[5], 
                "to": crowdsaleContract.address, 
                "value" : Math.pow(10, 18), 
                "gasPrice": 50000000000
            });

            // verify contract actually gave me some tokens

            let buyerBalance = await tokenContract.balanceOf.call(accounts[5]);
            assert.equal(buyerBalance.toNumber() / Math.pow(10,18), 0, "Invalid buyer balance: has tokens");
        }catch(e){
            //console.log(e);
            whitelistError = e != null;
        }
        assert.equal(whitelistError, true, "Non-whitelisted user not bounced.");

        // add account into whitelist
        await crowdsaleContract.addToWhiteList([accounts[5]], [Math.pow(10,18)]);

        // reset variable
        whitelistError = false;

        try{
            await web3.eth.sendTransaction({
                "from": accounts[5], 
                "to": crowdsaleContract.address, 
                "value" : Math.pow(10, 18), 
                "gasPrice": 50000000000
            });

            // verify contract actually gave me some tokens

            let buyerBalance = await tokenContract.balanceOf.call(accounts[5]);
            assert.isAtLeast(buyerBalance.toNumber() / Math.pow(10, 18), 1034.9, "Invalid buyer balance: too little tokens");
            assert.isAtMost(buyerBalance.toNumber() / Math.pow(10, 18), 1035.1, "Invalid buyer balance: too much tokens");
        }catch(e){
            console.log(e);
            whitelistError = e != null;
        }
        assert.equal(whitelistError, false, "Whitelisted user is bounced for some reason.");
    });
});

