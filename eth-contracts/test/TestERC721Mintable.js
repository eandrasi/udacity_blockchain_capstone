var ERC721MintableComplete = artifacts.require('EACustomERC721Token');
const truffleAssert = require('truffle-assertions')

contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    let tokenCount = 0;
    const URI = "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/"

    describe('match erc721 spec', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new({from: account_one});

            // TODO: mint multiple tokens
            for (let accIndex = 10; accIndex < 15; accIndex++) {
                for (let tokenIndex = 1; tokenIndex <= 5; tokenIndex++) {
                    let tokenId = accIndex * 10 + tokenIndex
                    await this.contract.mint(accounts[accIndex], tokenId, URI)
                    tokenCount += 1
                }
            }
        })

        it('should return total supply', async function () { 
            let supply = await this.contract.totalSupply();
            assert.equal(supply, tokenCount, `supply: ${supply}| tokenCount:${tokenCount}`)
        })

        it('should get token balance', async function () { 
            for (let accIndex = 10; accIndex < 15; accIndex++) {
                let tokenBalance = await this.contract.balanceOf(accounts[accIndex])
                assert.equal(tokenBalance, 5, `the balance is:${tokenBalance} instead of 5`)
            }
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 
            let uri = await this.contract.tokenURI(101)
            assert.equal(uri, URI+"101", `tokenURI:${uri}| not ${URI}101`)
        })

        it('should transfer token from one owner to another', async function () { 
            let transfer101 = await this.contract.transferFrom(accounts[10], accounts[9], 101, {from: accounts[10]})
            // truffleAssert.prettyPrintEmittedEvents(transfer101, 2)
            truffleAssert.eventEmitted(transfer101, "Transfer")
            
            let newOwner = await this.contract.ownerOf(101)
            assert.equal(newOwner, accounts[9], "Owner should be accounts 9")
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new({from: account_one});
        })

        it('should fail when minting when address is not contract owner', async function () { 
            await truffleAssert.fails(
                this.contract.mint(accounts[8], 102, URI, {from: accounts[2]}),
                truffleAssert.ErrorType.REVERT,
                "Only Owner can call this!"
                )
        })

        it('should return contract owner', async function () { 
            let owner = await this.contract.getOwner.call()
            assert.equal(owner, accounts[0], "Contract owner should be accounts[0]")
        })

    });
})