import { Container } from 'react-bootstrap';
import Game from './game';
import { BlockchainProvider } from '../blockchain';

function App() {
    return (
        <Container>
            <BlockchainProvider>
                <Game />
            </BlockchainProvider>
        </Container>
    );
}

export default App;