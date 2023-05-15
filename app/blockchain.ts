import { CLPublicKey, CLValueBuilder, CasperClient, DeployUtil, RuntimeArgs, Contracts } from "casper-js-sdk";

//const NODE_URL = "http://65.108.127.242:7777/rpc";
const NODE_URL = "http://127.0.0.1:7777/rpc";
// Deployment details taken from https://github.com/andrzej-casper/pixel-rate-contract/README.adoc
const NETWORK_NAME = "casper-test";
const CONTRACT_HASH = "hash-be3d58d00bfe1af1219addce925af80d68ca6bbfad3d00f36ed9cefa2ecc4266";

const fromHexString = (hexString) =>
  Uint8Array.from(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));

export async function sendDeploy(activeKey, movie, rating) {
  const activePublicKey = CLPublicKey.fromHex(activeKey);

  const casperClient = new CasperClient(NODE_URL);

  const contract = new Contracts.Contract(casperClient);
  const args = RuntimeArgs.fromMap({
    movie: CLValueBuilder.string(movie),
    rating: CLValueBuilder.u8(rating),
  });
  contract.setContractHash(CONTRACT_HASH);
  const deploy = contract.callEntrypoint("rate_movie", args, activePublicKey, NETWORK_NAME, (2 * 1000000000).toString());

  const deployJson = DeployUtil.deployToJson(deploy);
  //console.log(deployJson);

  const CasperWalletProvider = window.CasperWalletProvider;
  const provider = CasperWalletProvider();

  console.log('active key', activeKey);

  let signedDeployJSON;
  try {
    let signature = await provider.sign(JSON.stringify(deployJson), activeKey);
    // console.log(signature)
    if (signature.cancelled) {
      alert('Sign cancelled');
    } else {
      let deploySigned = DeployUtil.setSignature(
        deploy,
        signature.signature,
        CLPublicKey.fromHex(activeKey)
      );
      signedDeployJSON = DeployUtil.deployToJson(deploySigned)
    }
  } catch (err) {
    alert(err.message);
    return false;
  }

  let signedDeploy = DeployUtil.deployFromJson(signedDeployJSON).unwrap();
  const deployHash = signedDeployJSON.deploy.hash;
  console.log("Deploy Hash", deployHash);

  let res = await casperClient.putDeploy(signedDeploy);
  console.log('dep res', res);

  return deployHash;
}
