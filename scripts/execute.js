const { ethers } = require("hardhat");
const { loadFixture } = require("./loadFixture");


const EXECUTE_ABI = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            },
            {
                "internalType": "bytes",
                "name": "data",
                "type": "bytes"
            },
            {
                "internalType": "uint8",
                "name": "operation",
                "type": "uint8"
            }
        ],
        "name": "execute",
        "outputs": [
            {
                "internalType": "bytes",
                "name": "",
                "type": "bytes"
            }
        ],
        "stateMutability": "payable",
        "type": "function"
    },
];

const TRANSFER_ABI = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
];

async function main() {
    const { provider, chainId, ERC6551Account, ERC6551Registry, ERC20Demo, ERC721Demo, signer1, signer2 } = await loadFixture();
    const implementation = ERC6551Account.target;
    const salt = "0x0000000000000000000000000000000000000000000000000000000000000000";
    const tokenContract = ERC721Demo.target;
    const tokenId = 1;
    const account = await ERC6551Registry.account(implementation, salt, chainId, tokenContract, tokenId);
    const Account = new ethers.Contract(account, EXECUTE_ABI, signer2);
    const to = ERC20Demo.target;
    const value = 0;
    const iface = new ethers.Interface(TRANSFER_ABI);
    const data = iface.encodeFunctionData("transfer", [signer1.address, ethers.parseEther("1.0")]);
    const operation = 0;
    const tx = await Account.execute(to, value, data, operation);
    const receipt = await tx.wait();
}

main().then(() => {
    process.exit();
}).catch((error) => {
    console.error(error);
    process.exitCode = 1;
    process.exit();
});