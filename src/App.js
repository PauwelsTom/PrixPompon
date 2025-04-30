import './App.css';
import { Component } from 'react';
import { GroupeProduit } from './Component/GroupeProduit';
import { Boissons, Crepes, Fournitures } from './Data/Data';
import { ImportExport } from './Component/ImportExport';

class App extends Component {
    constructor(props) {
        super();
    }

    render() {
        return (
            <div className="App">
                <u className='ProduitTracker'>Product Tracker</u>
                <ImportExport />
                <GroupeProduit produits={Boissons} titre="Boissons"/>
                <GroupeProduit produits={Crepes} titre="Crepes"/>
                <GroupeProduit produits={Fournitures} titre="Fourniture"/>
            </div>
        );
    }
}

export default App;
