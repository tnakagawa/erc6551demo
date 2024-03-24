const { ethers, network, config } = require("hardhat");
const path = require("path");
const fs = require("fs");

async function loadFixture() {
    const provider = new ethers.JsonRpcProvider(network.config.url);
    const chainId = (await provider.getNetwork()).chainId;
    const filePath = path.join(config.paths.ignition, "deployments", "chain-" + chainId, "deployed_addresses.json");
    const data = fs.readFileSync(filePath, "utf8");
    const json = JSON.parse(data);
    const [signer1, signer2] = await ethers.getSigners();
    const ERC6551Account = await ethers.getContractAt("ERC6551Account", json["ERC6551Demo#ERC6551Account"], signer1);
    const ERC6551Registry = await ethers.getContractAt("ERC6551Registry", json["ERC6551Demo#ERC6551Registry"], signer1);
    const ERC20Demo = await ethers.getContractAt("ERC20Demo", json["ERC6551Demo#ERC20Demo"], signer1);
    const ERC721Demo = await ethers.getContractAt("ERC721Demo", json["ERC6551Demo#ERC721Demo"], signer1);
    return { provider, chainId, ERC6551Account, ERC6551Registry, ERC20Demo, ERC721Demo, signer1, signer2 };
}

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
    console.log("signer1:", signer1.address);
    console.log("signer2:", signer2.address);
    console.log("account:", account);
    console.log("Create :", create);
    console.log("ERC721 :", signer2.address, erc721balance);
    const balance1 = await ERC20Demo.balanceOf(signer1.address);
    console.log("ERC20  :", signer1.address, ethers.formatEther(balance1));
    const balance2 = await ERC20Demo.balanceOf(signer2.address);
    console.log("ERC20  :", signer2.address, ethers.formatEther(balance2));
    const erc20balance = await ERC20Demo.balanceOf(account);
    console.log("ERC20  :", account, ethers.formatEther(erc20balance));
}

main().then(() => {
    process.exit();
}).catch((error) => {
    console.error(error);
    process.exitCode = 1;
    process.exit();
});