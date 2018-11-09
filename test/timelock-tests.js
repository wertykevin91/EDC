const EDC = artifacts.require('./EDC.sol');
const EDCTimelock = artifacts.require('./EDCTimelock.sol');

contract('EDC Timelock tests', async(accounts, b, c) => {

    it('Test transfer to timelock', async()=> {
        let tokenContract = await EDC.deployed();
        let timelockContract = await EDCTimelock.deployed();
        let timelockBalance = await tokenContract.balanceOf(timelockContract.address);

        const totalSupply = 900000000;
        const tokenToLock = 200 * Math.pow(10, 18);

        // Enable transfers

        await tokenContract.enableTransfers();

        // Prepare timelock contract

        await tokenContract.transfer(timelockContract.address, tokenToLock);
        let ntimelockBalance = await tokenContract.balanceOf(timelockContract.address);
        assert.equal(ntimelockBalance.toNumber(), tokenToLock + timelockBalance.toNumber());
    });

    it('Test timelock contract', async()=> {
        let tokenContract = await EDC.deployed();
        let timelockContract = await EDCTimelock.deployed();
        let timelockBalance = await tokenContract.balanceOf(timelockContract.address);

        const totalSupply = 900000000;
        const tokenToLock = 200 * Math.pow(10, 18);

        const today = Math.round(Date.now() / 1000);

        const minutes1 = today + (1 * 60);

        var hasError = false;

        await tokenContract.transfer(timelockContract.address, tokenToLock);
        try{
            await timelockContract.release();
        }catch(e){
            hasError = true;
        }
        assert.equal(hasError, true, "No error even though not release time.");

        let ntimelockBalance = await tokenContract.balanceOf(timelockContract.address);
        assert.equal(ntimelockBalance.toNumber(), tokenToLock + timelockBalance.toNumber());

        // only applicable for local testnet
        // RPC call to move timestamp forward
        
        if(web3.currentProvider.host.indexOf("localhost") !== -1 || web3.currentProvider.host.indexOf("127.0.0.1") !== -1){
            var rpcCall = await web3.currentProvider.send({
                jsonrpc: "2.0", 
                method: "evm_increaseTime", 
                params: [minutes1 + 1], id: 0
            });
            //console.log(rpcCall);
    
            hasError = false;
            try{
                await timelockContract.release();
            }catch(e){
                hasError = true;
            }
            assert.equal(hasError, false, "Error even though release time.");
            
            ntimelockBalance = await tokenContract.balanceOf(timelockContract.address);
            assert.equal(ntimelockBalance.toNumber(), 0, "Balance not invalid.");
    
            let ownerBalance = await tokenContract.balanceOf(accounts[0]);
            assert.equal(ownerBalance.toNumber(), totalSupply * Math.pow(10, 18), "Owner balance invalid.");
        }
    });
});

// contract('COSTokenTimelockContract', function(accounts){
//     var tokenContract;
//     var timelockContract;
//     var totalSupply = 300000000;
//     var tokenToLock = 200 * Math.pow(10, 18);

//     it('test time lock', function(){
//         return COSToken.deployed().then(function(instance){
//             tokenContract = instance;
//             return COSTokenTimelockContract.deployed();
//         }).then(function(instance){
//             timelockContract = instance;
//             return tokenContract.enableTransfers();
//         }).then(function(){
//             return tokenContract.transfer(timelockContract.address, tokenToLock);
//         }).then(function(){
//             return tokenContract.balanceOf(timelockContract.address);
//         }).then(function(lockBalance){
//             assert.equal(tokenToLock, lockBalance);
//             setTimeout(function(){
//                 return timelockContract.release();
//             }, 60000)
//         }).then(function(){
//             return tokenContract.balanceOf(timelockContract.address);
//         }).then(function(tlCBalance){
//             console.log(tlCBalance);
//             assert.equal(tlCBalance, 0);
//             return tokenContract.balanceOf(accounts[0]);
//         }).then(function(ownerBalance){
//             assert.equal(ownerBalance, totalSupply * Math.pow(10, 18));
//             return;
//         });
//     });
// });