import React, { useContext, useState } from 'react';
import Web3 from 'web3';
import Pokemon from './contracts/Pokemon.json';

const BlockchainContext = React.createContext();

export const BlockchainProvider = ({ children }) => {

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [account, setAccount] = useState();
    const [balance, setBalance] = useState(0);
    const [tokenContract, setTokenContract] = useState();
    const [tokens, setTokens] = useState([]);

    const connect = async () => {
        try {
            
            if (window.ethereum) {
                console.log("connecting metamask...");
             
                window.web3 = new Web3(window.ethereum);
             
                await window.ethereum.enable();

                return true;
            }

            if (window.web3) {

                console.log("connecting web3...");
                
                window.web3 = new Web3(window.web3.currentProvider);

                return true;
            }

            window.alert("Não é possível se conectar a rede Ethereum neste navegador. Tente com a Metamask.");

        } catch (err) {
            window.alert("Conexão com o blockchain falhou: ", err);
        }

        return false;
    };

    const loadTokens = async (tokenContract, account) => {
        let balance = await tokenContract.methods.balanceOf(account).call();

        const tokens = [];
        
        for(let i = 0; i < balance; i++) {
            const id = await tokenContract.methods.tokenOfOwnerByIndex(account, i).call();
            const uri = await tokenContract.methods.tokenURI(id).call();
            tokens.push({id, uri});
        }

        setTokens(tokens);
    };

    const loadData = async () => {
        const web3 = window.web3;
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);

        console.log('Accounts:', accounts);

        const networkId = await web3.eth.net.getId();
        const network = Pokemon.networks[networkId];

        if (network) {
            const abi = Pokemon.abi;
            const address = network.address;

            const res = await web3.eth.getBalance(address);
            const balance = web3.utils.fromWei(res, 'ether');
            setBalance(balance);

            const tokenContract = new web3.eth.Contract(abi, address);
            setTokenContract(tokenContract);

            await loadTokens(tokenContract, accounts[0]);
        } else {
            alert("Smart Contract não encontrado.");
        }
    };

    const doLogin = async () => {
        if(await connect()) {
            await loadData();
            setIsAuthenticated(true);
        }
    };

    const doMint = async (tokenURI, events) => {
        const { onRegistered, onError, onReceipt, onConfirmation } = events;

        await tokenContract.methods.mint(account, tokenURI)
            .send({from: account})
            .on('transactionHash', async (hash) => {
                console.log('NFT foi registrado.');
                await onRegistered(hash);
            })
            .on('receipt', async (receipt) => {
                console.log('NFT mintado com sucesso!', {receipt});
                await onReceipt(receipt);
                await loadTokens(tokenContract, account);
            })
            .on('confirmation', async (confirmationNumber, receipt) => {
                console.log("Confirmações: ", confirmationNumber);

                await onConfirmation(confirmationNumber, receipt);
                await loadTokens(tokenContract, account);
            })
            .on('error', async (err) => {
                onError(err.message);
            });
    };

    const payload = {
        isLogged: isAuthenticated,
        account,
        balance,
        tokens,
        loadTokens,
        doLogin,
        doMint,
    };

    return (
        <BlockchainContext.Provider value={payload}>
            {children}
        </BlockchainContext.Provider>
    )
};

export function useBlockchain() {
    return useContext(BlockchainContext);
};

export default BlockchainContext;