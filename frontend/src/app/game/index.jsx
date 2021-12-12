import React, { useEffect } from 'react';
import axios from 'axios';
import { BaseURL } from '../../api';
import { Col, Row } from 'react-bootstrap';
import Loading from '../components/Loading';
import ListView from '../components/ListView';

function Game() {
    const [pokemons, setPokemons] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    useEffect(async () => {
        const response = await axios.get(`${BaseURL}/pokemons`);
        setPokemons(response.data);
        setLoading(false);
    }, []);

    return (
        <Row>
            {
                loading ? (
                    <Col md={12} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <Loading size="mini" />
                    </Col>
                ) : (
                    <Col md={12}>
                        <ListView pokemons={pokemons} />
                    </Col>
                )
            }
        </Row>
    )
}

export default Game;