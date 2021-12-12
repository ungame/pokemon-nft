import React, { useEffect } from 'react';
import axios from 'axios';
import { BaseURL } from '../../api';
import { Button, Col, Row } from 'react-bootstrap';
import Loading from '../components/Loading';
import ListView from '../components/ListView';
import { useBlockchain } from '../../blockchain';

const POKEMONS_LIMIT = 25;

function Game() {
    const [pokemons, setPokemons] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    const {
        isLogged,
        account,
        balance,
        tokens,
        doLogin,
        doMint,
    } = useBlockchain();

    const handleLogin = async () => {
        await doLogin();
    };

    const handleOnRegistered = async () => {
        console.log("Token registrado com sucesso. A transação está sendo processada.");
    }

    const handleOnReceipt = async (receipt) => {
        console.log("NFT criada com sucesso. Aguardando confirmações...");
    }

    const handleOnConfirmation = async (confirmations, receipt) => {
        console.log('confimations: ', confirmations);
    }

    const handleOnError = async (err) => {
        console.log("Transação falhou: ", err);
    }

    const events = {
        onRegistered: handleOnRegistered,
        onReceipt: handleOnReceipt,
        onConfirmation: handleOnConfirmation,
        onError: handleOnError,
    };

    const handleMint = async (pokemonURL, callback) => {
        doMint(pokemonURL, events);
        if (callback) callback();
    };

    useEffect(async () => {
        const response = await axios.get(`${BaseURL}/pokemons?limit=${POKEMONS_LIMIT}`);
        setPokemons(response.data);
        setLoading(false);
    }, []);

    if (!isLogged) {
        return (
            <Row>
                <Col md={12} style={{display: 'flex', alignItems: 'center', justifyContent: 'right'}}>
                    <Button variant={"dark"} onClick={() => handleLogin()}>Connect</Button>
                </Col>
            </Row>
        )
    }

    return (
        <Row>
            {
                loading ? (
                    <Col md={12} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <Loading size="mini" />
                    </Col>
                ) : (
                    <Col md={12}>
                        <ListView pokemons={pokemons} tokens={tokens} onMint={handleMint} />
                    </Col>
                )
            }
        </Row>
    )
}

export default Game;