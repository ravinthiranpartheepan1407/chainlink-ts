import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useEffect, useRef, useState } from "react";
import { BigNumber, Contract, providers, Signer } from "ethers";
import Web3Modal from "web3modal";
import Core from "web3modal";
import { config } from "../constants/config";
import { parseEther } from "ethers/lib/utils";

const Home: NextPage = () => {
  const [ethPriceInUsd, setEthPriceInUsd] = useState<number>();

  const [amountToSend, setAmountToSend] = useState<number>();

  const [recipientAddress, setRecipientAddress] = useState<string>();

  const [walletConnected, setWalletConnected] = useState(false);

  const web3ModalRef = useRef<Core>();

  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);
    } catch (error) {
      console.error(error);
    }
  };

  const getProviderOrSigner = async (needSigner = false) => {
    const provider = await web3ModalRef!.current!.connect();
    const web3Provider = new providers.Web3Provider(provider);

    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 4) {
      window.alert("Please switch to the Rinkeby network!");
      throw new Error("Please switch to the Rinkeby network");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };


  const getContractInstance = (
    providerOrSigner: providers.Provider | Signer
  ) => {
    return new Contract(
      config.CHAINLINK_CONTRACT_ADDRESS,
      config.CHAINLINK_CONTRACT_ABI,
      providerOrSigner
    );
  };

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "rinkeby",
        providerOptions: {},
        disableInjectedProvider: false,
      });

      connectWallet().then(() => {});
      getEthPrice();
    }
  }, [walletConnected]);

  const getEthPrice = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const contract = getContractInstance(signer);
      const _ethPriceInUsd = await contract.getEthUsd();
      setEthPriceInUsd(
        parseInt(BigNumber.from(_ethPriceInUsd).toString()) / 100000000
      );
    } catch (error: any) {
      console.error(error);
      alert(error?.message);
    } finally {
    }
  };

  const sendEth = async () => {
    try {
      if (!amountToSend || !recipientAddress) {
        alert("please fill the form");
        console.log({ amountToSend, recipientAddress });
        return;
      }
      console.log({ amountToSend, recipientAddress });

      const ethToSend = amountToSend / ethPriceInUsd!;

      const signer = await getProviderOrSigner(true);
      const contract = getContractInstance(signer);
      const txn = await contract.sendEther(recipientAddress, {
        value: parseEther(ethToSend.toString()),
      });
      txn.wait();
      alert("txn sent");
      console.log({ txn });
    } catch (error: any) {
      console.error(error);
      alert(error?.message);
    }
  };

  return (
    <div>
      <h1>Send ETH in USD</h1>
      <div>
        <label>
          Recipient:
          <input
            onChange={(event) => {
              setRecipientAddress(event.target.value);
            }}
            name="recipient"
            type={"text"}
          />
        </label>
        <label>
          Anount to send (in USD):
          <span>
            Current ETH price (in USD): {ethPriceInUsd}
          </span>
          <input
            onChange={(event) => {
              setAmountToSend(parseFloat(event.target.value));
            }}
            name={"amount"}
            step={"any"}
            type={"number"}
          />
        </label>
      </div>
      <span>
        <button
          onClick={async () => {
            await sendEth();
          }}
        >
          Send ETH
        </button>
      </span>
    </div>
  );
}

export default Home
