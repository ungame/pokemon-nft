import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BaseURL } from '../../../api';
import { Col, Row, Modal, Button } from 'react-bootstrap';
import Loading from '../Loading';
import { dupList, shuffle, base64ToImage } from '../../../utils';
import View from '../View';
import { v4 as uuidv4 } from 'uuid';


function ListView({ pokemons }) {
    const [gifs, setGifs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedItems, setSelectedItems] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [matchedItems, setMatchedItems] = useState([]);
    const [failures, setFailures] = useState(0);

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

    useEffect(() => {
        if(selectedItems.length === 2) {
            const [first, second] = selectedItems;
            
            if (first.name === second.name) {
                setMatchedItems(matchedItems.concat([...selectedItems]));
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

            <Row>
                <Col>
                    <p className="alert alert-info text-center">
                        Se errar 7 vezes ou encontrar 1 combinação, os pokemons serão embaralhados...
                    </p>
                    <h3>Erros: {failures}</h3>
                </Col>
            </Row>

            <Row className="mt-5">
                <Col md={12} style={{ ...center, flexWrap: 'wrap', gap: '75px'}}>
                { gifs.map((gif) => (
                    <View 
                        key={gif.id}
                        onSelect={onSelect} 
                        selected={selectedItems} 
                        matched={matchedItems}
                        pokemon={gif} 
                    />
                )) }
                </Col>
            </Row>

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
                        {hasMatched() ? 'Reivindicar' : 'Tentar novamente'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default ListView;