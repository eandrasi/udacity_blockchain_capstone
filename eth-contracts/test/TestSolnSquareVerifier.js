const SolnSquareVerifier = artifacts.require('SolnSquareVerifier')
const verifier = artifacts.require('Verifier')
const truffleAssert = require('truffle-assertions')
const { proof, inputs } = require('../../zokrates/code/square/proof')


contract('SolnSquareVerifierTest', accounts => {


    describe('SolnSquareVerifier', function() {
        beforeEach(async function () {
            let verifierContract = await verifier.new({from: accounts[0]})
            this.contract = await SolnSquareVerifier.new(verifierContract.address, {from: accounts[0]})
        })
   
        // Test if a new solution can be added for contract - SolnSquareVerifier
        it("can add a new sollution to the SolnSquareVerifier", async function() {
            let addedSolution = await this.contract.addSolution(99, accounts[1])
            // console.log(addedSolution)
            truffleAssert.eventEmitted(addedSolution, "SolutionAdded")
        })

        // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
        it("can mint an ERC721 token for SolnSquareVerifier", async function() {
            truffleAssert.passes(
                await this.contract.mintNewNFT(accounts[1], 33,
                    proof.a,
                    proof.b,
                    proof.c,
                    inputs
                    )
            )
        })
    })
})