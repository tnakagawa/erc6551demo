const { loadFixture } = require("./loadFixture");

async function main() {
    const { provider, chainId, ERC6551Account, ERC6551Registry, ERC20Demo, ERC721Demo, signer1, signer2 } = await loadFixture();
    const tokenId = 1;
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