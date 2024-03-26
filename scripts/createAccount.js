const { loadFixture } = require("./loadFixture");

async function main() {
    const { provider, chainId, ERC6551Account, ERC6551Registry, ERC20Demo, ERC721Demo, signer1, signer2 } = await loadFixture();
    const implementation = ERC6551Account.target;
    const salt = "0x0000000000000000000000000000000000000000000000000000000000000000";
    const tokenContract = ERC721Demo.target;
    const tokenId = 1;
    const account = await ERC6551Registry.account(implementation, salt, chainId, tokenContract, tokenId);
    const code = await provider.getCode(account);
    if (code == "0x") {
        const tx = await ERC6551Registry.createAccount(implementation, salt, chainId, tokenContract, tokenId);
        const receipt = await tx.wait();
        console.log("createAccount");
    }
    console.log("account", account);
}

main().then(() => {
    process.exit();
}).catch((error) => {
    console.error(error);
    process.exitCode = 1;
    process.exit();
});