const { ethers } = require("hardhat");
const { loadFixture } = require("./loadFixture");

async function main() {
    const { provider, chainId, ERC6551Account, ERC6551Registry, ERC20Demo, ERC721Demo, signer1, signer2 } = await loadFixture();
    const implementation = ERC6551Account.target;
    const salt = "0x0000000000000000000000000000000000000000000000000000000000000000";
    const tokenContract = ERC721Demo.target;
    const tokenId = 1;
    const account = await ERC6551Registry.account(implementation, salt, chainId, tokenContract, tokenId);
    let balance = await ERC20Demo.balanceOf(account);
    if (balance == 0) {
        const value = ethers.parseEther("100");
        const tx = await ERC20Demo.mint(account, value);
        const receipt = await tx.wait();
        console.log("mint", account, ethers.formatEther(value), await ERC20Demo.symbol());
    }
    balance = await ERC20Demo.balanceOf(account);
    console.log("ERC20Demo#balanceOf", account, ethers.formatEther(balance), await ERC20Demo.symbol());
}

main().then(() => {
    process.exit();
}).catch((error) => {
    console.error(error);
    process.exitCode = 1;
    process.exit();
});