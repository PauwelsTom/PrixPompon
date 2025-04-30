import { Component } from "react";
import "./ProduitInfo.css"

export class ProduitInfo extends Component {

    render() {
        const { name, moyen, dernier, dernierDate, Ajouter } = this.props;

        // Formater les prix avec deux décimales
        const moyenFormate = parseFloat(moyen).toFixed(2);  // Formater le prix moyen
        const dernierFormate = parseFloat(dernier).toFixed(2);  // Formater le dernier prix

        return (
            <div className="ProduitInfos">
                <div className="ProduitStats">
                    <div>
                        <u className="Gras">{"Prix Moyen (unitaire):"}</u>
                        <span className="ProduitStatValue">{" " + moyenFormate + "€"}</span>
                    </div>

                    <div>
                        <u className="Gras">{"Dernier achat:"}</u>
                        <span className="ProduitStatValue">{" " + dernierFormate + "€"}</span>
                    </div>
                    <div>
                        <u className="Gras">{"Date dernier achat:"}</u>
                        <span className="ProduitStatValue">{" " + (dernierDate ? `${dernierDate}` : "Aucun achat enregistré")}</span>
                    </div>
                </div>

                <hr className="SeparationLigne" />

                <div className="ProduitForm">
                <div className="ProduitFormDiv">
                    <div className="ProduitFormTitre">Prix total (€):</div>
                    <input type="number" className="PrixInput" data-produit={name} data-type="prix" />
                </div>

                <div className="ProduitFormDiv">
                    <div className="ProduitFormTitre">Quantité:</div>
                    <input type="number" className="PrixInput" data-produit={name} data-type="quantite" />
                </div>

                <div className="ProduitFormDiv">
                    <div className="ProduitFormTitre">Date d'achat:</div>
                    <input type="date" className="PrixInput" data-produit={name} data-type="date" defaultValue={new Date().toISOString().slice(0, 10)} />
                </div>

                <div className="ProduitFormDiv">
                    <div className="ProduitFormTitre">Magasin:</div>
                    <input type="text" className="PrixInput" data-produit={name} data-type="magasin" />
                </div>

                    <div className="ProduitFormDiv">
                        <button className="AjouterButton" onClick={Ajouter}>Ajouter</button>
                    </div>
                </div>
            </div>
        );
    }
}
