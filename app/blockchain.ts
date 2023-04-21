import { CLPublicKey, CLValueBuilder, CasperClient, DeployUtil, RuntimeArgs, Contracts } from "casper-js-sdk";

//const NODE_URL = "http://65.108.127.242:7777/rpc";
const NODE_URL = "http://127.0.0.1:7777/rpc";
const NETWORK_NAME = "casper-test";

export async function sendRating(activeKey, wasm, movie, rating) {
  const activePublicKey = CLPublicKey.fromHex(activeKey);

  const casperClient = new CasperClient(NODE_URL);
  const contract = new Contracts.Contract(casperClient);

  const args = RuntimeArgs.fromMap({
    movie: CLValueBuilder.string(movie),
    rating: CLValueBuilder.u8(rating),
  });
  //console.log(args, wasm);

  const session = DeployUtil.ExecutableDeployItem.newModuleBytes(wasm, args);
  const payment = DeployUtil.standardPayment(2 * 1000000000);
  const param = new DeployUtil.DeployParams(activePublicKey, NETWORK_NAME);

  const deploy = DeployUtil.makeDeploy(param, session, payment);
  const deployJson = DeployUtil.deployToJson(deploy);
  console.log(deployJson);
}
