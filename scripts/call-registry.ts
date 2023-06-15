import { Contract } from 'ethers';
import { artifacts, ethers } from 'hardhat';
import { getTransactionFees, ZERO_ADDRESS } from './util';

async function main() {
  try {
    const [deployer] = await ethers.getSigners();
    const balance = await deployer.getBalance();

    console.log(`Calling contracts with account: ${deployer.address} and balance: ${balance.toString()}`);

    const txArgs = await getTransactionFees();

    const contractAddr = "0xE189686254a28650414a6a59ac6DFda5433f2910";

    // call
    const tokenArtifact = await artifacts.readArtifact("SubnetRegistry");
    const contract = new Contract(contractAddr, tokenArtifact.abi, deployer);
    
    const parentSubnetId = { route: ["0x008Ee541Cc66D2A91c3624Da943406D719CF42EF"] };
    const ipcGatewayAddr = "0x008Ee541Cc66D2A91c3624Da943406D719CF42EF";
    const minActivationCollateral = 10000;
    const minValidators = 1;

    const params = {
      parentId: parentSubnetId,
      name: ethers.utils.formatBytes32String('Subnet'),
      ipcGatewayAddr,
      consensus: 0,
      minActivationCollateral: ethers.utils.parseEther("1"),
      minValidators: 3,
      bottomUpCheckPeriod: 10,
      topDownCheckPeriod: 10,
      majorityPercentage: 66,
      genesis: 0
    };

    const tx = await contract.newSubnetActor(params, txArgs);
    const receipt = await tx.wait();
    // Receipt should now contain the logs
    console.log(receipt.logs)

    const subnets = await contract.listSubnets(0);
    console.log(subnets);

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();
