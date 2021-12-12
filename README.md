# Smart Contracts ERC721

## Instalar o Ganache

- https://trufflesuite.com/ganache/

## Metamask

- https://metamask.io/
- Criar carteira
- Salvar o minemonic (12 palavras secretas)
- Salvar a senha

## Conectar Metamask na rede do Ganache

- Abrir a Metamask
- Adicionar Rede
- Digitar `Ganache` em "Nome da rede"
- Digitar `HTTP://127.0.0.1:7545` em "Novo URL da RPC"
- Digitar `1337` em ID da chain
- Salvar

## Importar Carteira do Ganache para a Metamask

- Clicar em "show keys" na aba ACCOUNTS do Ganache
- Copiar a chave privada
- Abrir a Metamask
- Clicar em "Importar conta"
- Colar a chave privada
- Importar

## Instalar o truffle

- Abrir um terminal como administrador
- Instalar o truffle:

```bash
    npm install -g truffle
```

## Iniciar um projeto com Truffle

```bash
mkdir project_name

cd project_name

npm init -y

truffle init
```

## Configurar a rede do Ganache

- Adicionar o codigo abaixo no `truffle-config.js`:

```js
development: {
    host: "127.0.0.1",     // Localhost (default: none)
    port: 7545,            // Default Ganache Network Port
    network_id: "*",       // Any network (default: none)
}
```

## Instalar o OpenZeppelin

- https://docs.openzeppelin.com/contracts/4.x/

```bash
npm install @openzeppelin/contracts
```

## Criar o Smart Contract

- Crie o contrato dentro do diretorio `contracts`
- Exporte o contrato no diretório `migrations`

## Exemplo básico de um Smart Contract ERC721 

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";


contract ContractName is ERC721Enumerable, ERC721URIStorage {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("ContractName", "SYMBOL") {}

    function mint(address _wallet, string memory _tokenURI) public returns(uint256) {
        
        uint256 tokenId = _tokenIdCounter.current();

        _safeMint(_wallet, tokenId);

        _setTokenURI(tokenId, _tokenURI);

        _tokenIdCounter.increment();

        return tokenId;
    }

    function _beforeTokenTransfer(address _from, address _to, uint256 _tokenId) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(_from, _to, _tokenId);
    }

    function supportsInterface(bytes4 _interfaceId) public view override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(_interfaceId);
    }

    function _burn(uint256 _tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(_tokenId);
    }

    function tokenURI(uint256 _tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(_tokenId);
    }
}
```

## Compilar o Smart Contract

```bash
truffle compile
```
## Testar o Smart Contract

- Instalar pacotes de teste:

```bash
npm install chai chai-as-promised
```

- Executar testes com `truffle`:

```bash
truffle test
```


## Simular o deploy do Smart Contract

```bash
truffle migrate --reset --dry-run
```

## Fazer o deploy do Smart Contract

```bash
truffle migrate --reset
```

## Importar Smart Contract no Ganache

- Clicar na aba CONTRACTS do Ganache
- Clicar em "LINK TUFFLE PROJECTS"
- Clicar em "ADD PROJECT"
- Selecionar o arquivo `truffle-config.js`
- Clicar em Abrir
- Clicar em "SAVE AND RESTART"

## Instalar o Web3 no Frontend

```bash
npm install web3
```

## Configurar Smart Contract no Frontend

> Dentro do projeto iniciado com o `truffle init` e compilado com o `truffle compile`, tem um diretório "build/contracts"

- Criar um diretório `blockchain` no diretório `src` do frontend
- Copiar o diretório `contracts` do projeto compilado com truffle para o diretório blockchain do frontend
- Criar um provider de conexão com a metamask para fazer chamadas parar a blockchain