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
    const balance = await ERC721Demo.balanceOf(signer2.address);
    if (balance == 0) {
        const tx = await ERC721Demo.mint(signer2.address, tokenId);
        const receipt = await tx.wait();
        console.log("mint", signer2.address, tokenId);
    }
    const owner = await ERC721Demo.ownerOf(tokenId);
    console.log("ownerOf", tokenId, owner);
}

main().then(() => {
    process.exit();
}).catch((error) => {
    console.error(error);
    process.exitCode = 1;
    process.exit();
});