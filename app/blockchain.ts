import { CLPublicKey, CLValueBuilder, CasperClient, DeployUtil, RuntimeArgs, Contracts } from "casper-js-sdk";

//const NODE_URL = "http://65.108.127.242:7777/rpc";
const NODE_URL = "http://127.0.0.1:7777/rpc";
const NETWORK_NAME = "casper-test";

export async function sendDeploy(activeKey, wasm, movie, rating) {
  const activePublicKey = CLPublicKey.fromHex(activeKey);

  const casperClient = new CasperClient(NODE_URL);
  const contract = new Contracts.Contract(casperClient);

  const args = RuntimeArgs.fromMap({
    movie: CLValueBuilder.string(movie),
    rating: CLValueBuilder.string(''+rating),
  });
  //console.log(args, wasm);

  const session = DeployUtil.ExecutableDeployItem.newModuleBytes(wasm, args);
  const payment = DeployUtil.standardPayment(2 * 1000000000);
  const param = new DeployUtil.DeployParams(activePublicKey, NETWORK_NAME);

  const deploy = DeployUtil.makeDeploy(param, session, payment);
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
