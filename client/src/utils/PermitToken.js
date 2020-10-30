const createPermitMessageData = function (message, coinAddr) {
  const typedData = JSON.stringify({
    types: {
      EIP712Domain: [
        {
          name: "name",
          type: "string",
        },
        {
          name: "version",
          type: "string",
        },
        {
          name: "chainId",
          type: "uint256",
        },
        {
          name: "verifyingContract",
          type: "address",
        },
      ],
      Permit: [
        {
          name: "holder",
          type: "address",
        },
        {
          name: "spender",
          type: "address",
        },
        {
          name: "nonce",
          type: "uint256",
        },
        {
          name: "expiry",
          type: "uint256",
        },
        {
          name: "allowed",
          type: "bool",
        },
      ],
    },
    primaryType: "Permit",
    domain: {
      name: "Dai Stablecoin",
      version: "1",
      chainId: 5777,
      verifyingContract: coinAddr,
    },
    message: message,
  });

  return {
    typedData,
    message,
  };
};

const signData = async function (web3, fromAddress, typeData) {
  return new Promise(function (resolve, reject) {
    web3.currentProvider.send(
      {
        id: 1,
        method: "eth_signTypedData_v3",
        params: [fromAddress, typeData],
        from: fromAddress,
      },
      function (err, result) {
        if (err) {
          reject(err); //TODO
        } else {
          const r = result.result.slice(0, 66);
          const s = "0x" + result.result.slice(66, 130);
          const v = Number("0x" + result.result.slice(130, 132));
          resolve({
            v,
            r,
            s,
          });
        }
      }
    );
  });
};

export const signTransferPermit = async function (web3, message, coinAddr) {
  // if (message.nonce === undefined) {
  //   let tokenAbi = ["function nonces(address holder) view returns (uint)"];

  //   let tokenContract = new web3.eth.Contract(tokenAbi, coinAddr);

  //   let nonce = await tokenContract.nonces(message.holder);

  //   message = { ...message, nonce: nonce.toString() };
  // }

  const messageData = createPermitMessageData(message, coinAddr);
  const sig = await signData(web3, message.holder, messageData.typedData);
  return Object.assign({}, sig, messageData.message);
};

// import { ethers } from "ethers";

// const domainSchema = [
//   { name: "name", type: "string" },
//   { name: "version", type: "string" },
//   { name: "chainId", type: "uint256" },
//   { name: "verifyingContract", type: "address" },
// ];

// const permitSchema = [
//   { name: "holder", type: "address" },
//   { name: "spender", type: "address" },
//   { name: "nonce", type: "uint256" },
//   { name: "expiry", type: "uint256" },
//   { name: "allowed", type: "bool" },
// ];

// export const domains = {
//   daiMainnet: {
//     name: "Dai Stablecoin",
//     version: "1",
//     chainId: "1",
//     verifyingContract: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
//   },
//   shitCoin: {
//     name: "ShitCoin",
//     version: "1",
//     chainId: "5777",
//     verifyingContract: "",
//   },
// };

// export async function signPermit(web3, domain, message) {
//   const provider = new ethers.providers.Web3Provider(web3);
//   let signer = provider.getSigner();
//   let myAddr = await signer.getAddress();

//   console.log(myAddr);

//   if (myAddr.toLowerCase() !== message.holder.toLowerCase()) {
//     throw `signPermit: address of signer does not match holder address in message`;
//   }

//   if (message.nonce === undefined) {
//     let tokenAbi = ["function nonces(address holder) view returns (uint)"];

//     let tokenContract = new ethers.Contract(
//       domain.verifyingContract,
//       tokenAbi,
//       provider
//     );

//     let nonce = await tokenContract.nonces(myAddr);

//     message = { ...message, nonce: nonce.toString() };
//   }

//   let typedData = {
//     types: {
//       EIP712Domain: domainSchema,
//       Permit: permitSchema,
//     },
//     primaryType: "Permit",
//     domain,
//     message,
//   };

//   let sig = await provider.send("eth_signTypedData_v3", [
//     myAddr,
//     JSON.stringify(typedData),
//   ]);

//   return { domain, message, sig };
// }
