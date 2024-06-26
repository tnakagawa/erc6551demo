const { ethers } = require("hardhat");
const { loadFixture } = require("./loadFixture");

async function main() {
    const { provider, chainId, ERC6551Account, ERC6551Registry, ERC20Demo, ERC721Demo, signer1, signer2 } = await loadFixture();
    const implementation = ERC6551Account.target;
    const salt = "0x0000000000000000000000000000000000000000000000000000000000000000";
    const tokenContract = ERC721Demo.target;
    const tokenId = 1;
    const account = await ERC6551Registry.account(implementation, salt, chainId, tokenContract, tokenId);
    const code = await provider.getCode(account);
    let create = true;
    if (code == "0x") {
        create = false;
    }
    const erc721balance = await ERC721Demo.balanceOf(signer2.address);
    const balance1 = await ERC20Demo.balanceOf(signer1.address);
    const balance2 = await ERC20Demo.balanceOf(signer2.address);
    const erc20balance = await ERC20Demo.balanceOf(account);
    console.log("        | address                                    | ERC20");
    console.log("signer1", "|", signer1.address, "|", ethers.formatEther(balance1));
    console.log("signer2", "|", signer2.address, "|", ethers.formatEther(balance2));
    console.log("account", "|", account, "|", ethers.formatEther(erc20balance));
    console.log("".padStart(70, "-"));
    console.log("Create ", "|", create);
    console.log("ERC721 ", "|", signer2.address, erc721balance);
}

main().then(() => {
    process.exit();
}).catch((error) => {
    console.error(error);
    process.exitCode = 1;
    process.exit();
});