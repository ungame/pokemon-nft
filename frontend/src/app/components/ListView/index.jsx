import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BaseURL } from '../../../api';
import { Col, Row, Modal, Button, Card } from 'react-bootstrap';
import Loading from '../Loading';
import { dupList, shuffle, base64ToImage } from '../../../utils';
import View from '../View';
import { v4 as uuidv4 } from 'uuid';


function ListView({ pokemons, onMint, tokens }) {
    const [gifs, setGifs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedItems, setSelectedItems] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [matchedItems, setMatchedItems] = useState([]);
    const [failures, setFailures] = useState(0);
    const [currentTokens, setCurrentTokens] = useState([]);

    useEffect(async () => {

        if (Array.isArray(pokemons)) {
            let items = [];

            for(let i = 0; i < pokemons.length; i++) {
                const pokemon = pokemons[i];
                const uri = `${BaseURL}/pokemons/${pokemon}`;
                const response = await axios.get(uri);
                items.push({ ...response.data, uri });
            }

            const duplicated = dupList(items);
            
            items = [];

            for(let i = 0; i < duplicated.length; i++) {
                const id = uuidv4();
                items.push({ id, ...duplicated[i] });
            }

            setGifs(shuffle(items));
            setLoading(false);
        } 

    }, []);

    useEffect(async () => {
        let items = [];

        for(let i = 0; i < tokens.length; i++) {
            const token = tokens[i];
            const response = await axios.get(token.uri);
            items.push({ ...response.data });
        }

        setCurrentTokens(items);

    }, [tokens])

    useEffect(async () => {
        if(selectedItems.length === 2) {
            const [first, second] = selectedItems;
            
            if (first.name === second.name) {
                setMatchedItems(matchedItems.concat([...selectedItems]));
                
                setLoading(true);
                
                await onMint(first.uri, () => setLoading(false));

                setGifs(shuffle(gifs));
            } else {
                setFailures(failures + 1);
            }

            setShowModal(true);
        }

    }, [selectedItems]);

    function onCloseModal() {
        setSelectedItems([]);
        setShowModal(false);

        if (failures === 7) {
            console.log("embaralhando pokemons...");
            setFailures(0);
            setGifs(shuffle(gifs));
        }
    }


    function onSelect(pokemon) {
        setSelectedItems(selectedItems.concat([pokemon]));
    }

    function hasMatched() {
        return selectedItems.length === 2 && matchedItems.some(item => selectedItems[0].name === item.name);
    }

    const center = {display: 'flex', alignItems: 'center', justifyContent: 'center'};

    if (loading) {
        return <Row>
            <Col md={12} style={center}>
                <Loading />
            </Col>
        </Row>
    }

    if (matchedItems.length > 0 && matchedItems.length === gifs.length) {
        return (
            <Row>
                <Col md={12}>
                    <p className='alert alert-info'>
                        Todas as combinações disponíveis foram encontradas. Tente novamente mais tarde.
                    </p>
                </Col>
            </Row>
        )
    }

    return (
        <div>
            <Row>
                <Col md={12} style={center}>
                    <h1>POKEMON NFT</h1>
                </Col>
            </Row>

            <Row className="mt-5">
                <Col md={12}>

                    <Card>
                        <Card.Header as="h5">Tente encontrar dois pokemons iguais</Card.Header>
                        <Card.Body>
                        { gifs.map((gif) => (
                            <View 
                                key={gif.id}
                                onSelect={onSelect} 
                                selected={selectedItems} 
                                matched={matchedItems}
                                pokemon={gif} 
                            />
                        )) }
                        </Card.Body>
                    </Card>
          
                </Col>
            </Row>

            <Row className='mt-5'>
                <Col>
                    <Card>
                        <Card.Header as="h5">Erros: {failures}</Card.Header>
                        <Card.Body>
                            <p className='text-mudated'>
                                <small >
                                    Se errar 7 vezes ou encontrar 1 combinação, os pokemons serão embaralhados...
                                </small>
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {
                currentTokens.length > 0 && (
                    <div className='mt-5'>
                        <Row>
                            <Col>
                                <Card>
                                    <Card.Header as="h5">Meus Pokemons: {currentTokens.length}</Card.Header>
                                    <Card.Body>
                                        {currentTokens.map(token => {
                                            return <img src={base64ToImage(token.gif)} alt={token.name} />
                                        })}
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                )
            }

            <Modal
                show={showModal}
                onHide={onCloseModal}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                       {
                           hasMatched() ? 'Combinação encontrada!' : 'Combinação falhou.'
                       }
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {
                        selectedItems.length === 2 && (
                            <div style={center}>
                                <img 
                                    src={base64ToImage(selectedItems[0].gif)}
                                    alt={selectedItems[0].name}
                                />
                                <img 
                                    src={base64ToImage(selectedItems[1].gif)}
                                    alt={selectedItems[1].name}
                                />
                            </div>
                        ) 
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button variant={hasMatched() ? 'success' : 'danger'} onClick={onCloseModal}>
                        {hasMatched() ? 'Continuar' : 'Tentar novamente'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default ListView;