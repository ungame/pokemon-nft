function Image({ onClick, src, style, alt }) {
    return (
        <img 
            style={{ ...style }}
            src={gif} 
            alt={pokemon.name}
            onClick={() => onClick(pokemon)}
        />
    );
}

export default Image;