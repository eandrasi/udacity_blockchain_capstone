pragma solidity >=0.4.21 <0.6.0;

import "./ERC721Mintable.sol";

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
import "./verifier.sol";
contract verifier is Verifier{}

// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is EACustomERC721Token {

    verifier verifierContract;

    constructor(address verifierAddress) public {
        verifierContract = verifier(verifierAddress);
    }

    // TODO define a solutions struct that can hold an index & an address
    struct Solution {
        uint _index;
        address _solAddress;
    }

    // TODO define an array of the above struct
    Solution[] solutions;

    // TODO define a mapping to store unique solutions submitted
    mapping(bytes32 => address) uniqueSolutions;


    // TODO Create an event to emit when a solution is added
    event SolutionAdded(address solutioner);

    // TODO Create a function to add the solutions to the array and emit the event
    function addSolution(uint index, address solutioner) public {
        solutions.push(Solution(index, solutioner));
        emit SolutionAdded(solutioner);
    }



    // TODO Create a function to mint new NFT only after the solution has been verified
    //  - make sure the solution is unique (has not been used before)
    //  - make sure you handle metadata as well as tokenSuplly

    // function mintNewNFT(address Address, uint256 Id,
    //         uint[2] memory a,
    //         uint[2] memory a_p,
    //         uint[2][2] memory b,
    //         uint[2] memory b_p,
    //         uint[2] memory c,
    //         uint[2] memory c_p,
    //         uint[2] memory h,
    //         uint[2] memory k,
    //         uint[2] memory input
    //     ) public returns (bool) {
        
    //     require(verifierContract.verifyTx(a, a_p,b, b_p, c, c_p, h, k, input), "solution is not valid");

    //     bytes32 solutionHash = keccak256(abi.encodePacked(a, a_p,b, b_p, c, c_p, h, k, input));
    //     require(uniqueSolutions[solutionHash] == address(0), "The solution was previously used.");
    //     uniqueSolutions[solutionHash] = Address;
    //     addSolution(Id, Address);
    //     return mint(Address, Id, "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/");
    // }

    function mintNewNFT(address Address, uint256 Id,
            uint[2] memory a,
            uint[2][2] memory b,
            uint[2] memory c,
            uint[2] memory input
        ) public returns (bool) {

        require(verifierContract.verifyTx(a, b, c, input), "solution is not valid");

        bytes32 solutionHash = keccak256(abi.encodePacked(a, b, c, input));
        require(uniqueSolutions[solutionHash] == address(0), "The solution was previously used.");
        uniqueSolutions[solutionHash] = Address;
        addSolution(Id, Address);
        return mint(Address, Id, "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/");
    }

}