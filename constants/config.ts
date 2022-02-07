export const config = {
 CHAINLINK_CONTRACT_ADDRESS: "0xe6B3E27259D135788422a8234Aa39eb0d9630Bb2",
 CHAINLINK_CONTRACT_ABI: [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "aggregatorAddress",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "getEthUsd",
    "outputs": [
      {
        "internalType": "int256",
        "name": "",
        "type": "int256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address payable",
        "name": "_to",
        "type": "address"
      }
    ],
    "name": "sendEther",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
],
};
