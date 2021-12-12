import React from 'react';
import { base64ToImage } from '../../../utils';

function View({ pokemon, selected, matched, onSelect }) {

    if(matched.some(item => pokemon.id === item.id)) {
        return <React.Fragment />;
    }

    let gif = '/assets/wait-select.gif';
    let style = {width: '50px', height: '50px', cursor: 'pointer'};

    if(selected.some(item => pokemon.id === item.id)) {
        gif = base64ToImage(pokemon.gif);
        style = {};
    }

    return (
        <img 
            style={{ ...style }}
            src={gif} 
            alt={pokemon.name}
            onClick={() => onSelect(pokemon)}
        />
    )
}

export default View;