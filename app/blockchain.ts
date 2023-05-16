import { CLPublicKey, CLValueBuilder, CasperClient, DeployUtil, RuntimeArgs, Contracts } from "casper-js-sdk";
import { NODE_URL, NETWORK_NAME, CONTRACT_HASH } from "./config";

const fromHexString = (hexString) =>
  Uint8Array.from(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));

export async function sendDeploy(activeKey, movie, rating) {
  const activePublicKey = CLPublicKey.fromHex(activeKey);

  const casperClient = new CasperClient(NODE_URL);

  const contract = new Contracts.Contract(casperClient);
  contract.setContractHash(CONTRACT_HASH);

  // ================
  // = Exercise 02a =
  // ================
  //
  // Define deployment for calling entrypoint named "rate_movie".
  // As arguments you should pass 2 variables:
  // - `movie` - as string type,
  // - `rating` - as u8 type.
  //
  // You can use `activePublicKey` and `NETWORK_NAME` for next parameters.
  // For payment, 2 CSPRs is enough to be specified - number of motes as string.
  //
  // Resources:
  // - https://github.com/casper-ecosystem/casper-js-sdk/blob/08d999695dfa71c89dd77062e1732ccae99052b7/src/lib/Contracts.ts#L99
  // - https://github.com/caspercommunityio/blockchain-authenticator-app/blob/435a0edd54b51a9988b29f2939984ea81f47fea8/src/app/services/blockchain.service.ts#L54-L58
  //

  // TODO

  const deployJson = DeployUtil.deployToJson(deploy);

  const CasperWalletProvider = window.CasperWalletProvider;
  const provider = CasperWalletProvider();

  console.log('active key', activeKey);

  let signedDeployJSON;
  try {
    let signature = await provider.sign(JSON.stringify(deployJson), activeKey);
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

  // ================
  // = Exercise 02b =
  // ================
  //
  // After deployment is signed - `signedDeploy` - it can be submitted to blokchain.
  // Use relevant casperClient call to submit it.
  //
  // Resources:
  // - https://github.com/casper-ecosystem/casper-js-sdk/blob/08d999695dfa71c89dd77062e1732ccae99052b7/src/lib/CasperClient.ts

  // TODO

  return deployHash;
}
