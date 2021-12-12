function Loading({ size }) {
    let style = { width: '0px', height: '0px' };

    switch(size) {
        case "mini":
            style.width = "75px";
            style.height = "50px";
            break;

        case "medium":
            style.width = "250px";
            style.height = "200px";
            break;

        case "big":
            style.width = "500px";
            style.height = "400px";
            break; 

        default:
            style.width = "150px";
            style.height = "100px";
    }

    return <img alt="loading" src="/assets/loading.gif" style={style} />
}

export default Loading;