import { Component } from "react";
import "./Produit.css";
import { ProduitInfo } from "./ProduitInfo";
import { ProduitGraph } from "./ProduitGraph";
import { ProduitSuppr } from "./ProduitSuppr";

export class Produit extends Component {
    constructor(props) {
        super();
        this.state = {
            graphe: false,
            moyen_u: 0,
            dernier: 0,
            dernierDate: "", // Pour stocker la date du dernier achat
            unroll: false,
        };

        this.historiquePrix = [];
        this.historiqueDate = [];
    }

    componentDidMount() {
        this.get_data();
    }

    get_data = () => {
        const nom = this.props.name;
        const historique = JSON.parse(localStorage.getItem("HistoriqueData_" + nom)) || [];
        historique.sort((a, b) => new Date(a.Date) - new Date(b.Date));
    
        let moyen_u = 0;
        let dernier = 0;
        let dernierDate = "";
        let quantiteTotale = 0;
        let prixTotal = 0;
    
        if (historique.length > 0) {
            quantiteTotale = historique.reduce((acc, item) => acc + item.Quantite, 0);
            prixTotal = historique.reduce((acc, item) => acc + item.Prix, 0);
            moyen_u = quantiteTotale > 0 ? (prixTotal / quantiteTotale).toFixed(2) : 0;

            const dernierItem = historique[historique.length - 1];
            dernier = (dernierItem.Prix / dernierItem.Quantite).toFixed(2);
    
            const dateObj = new Date(dernierItem.Date);
            const options = { weekday: 'long', day: 'numeric', month: 'long' };
            dernierDate = dateObj.toLocaleDateString("fr-FR", options);
    
            quantiteTotale = historique.reduce((acc, item) => acc + item.Quantite, 0);
            prixTotal = historique.reduce((acc, item) => acc + item.Prix, 0);
        }

        let prixUnitaireMin = null;
        let magasinMin = "";

        if (historique.length > 0) {
            const minItem = historique.reduce((min, item) => {
                const prixUnitaire = item.Prix / item.Quantite;
                const prixUnitaireMin = min.Prix / min.Quantite;
                return prixUnitaire < prixUnitaireMin ? item : min;
            }, historique[0]);

            prixUnitaireMin = (minItem.Prix / minItem.Quantite).toFixed(2);
            magasinMin = minItem.Magasin;
        }

    
        this.setState({
            moyen_u: parseFloat(moyen_u),
            dernier: parseFloat(dernier),
            dernierDate: dernierDate,
            quantiteTotale,
            prixTotal,
            prixUnitaireMin: parseFloat(prixUnitaireMin),
            magasinMin: magasinMin
        });

    };
    
    
    

    Ajouter = () => {
        const nom = this.props.name;
    
        // Recuperation des donnees
        const prixInput = document.querySelector(`.PrixInput[data-produit="${nom}"][data-type="prix"]`);
        const quantiteInput = document.querySelector(`.PrixInput[data-produit="${nom}"][data-type="quantite"]`);
        const dateInput = document.querySelector(`.PrixInput[data-produit="${nom}"][data-type="date"]`);
        const magasinInput = document.querySelector(`.PrixInput[data-produit="${nom}"][data-type="magasin"]`);
    
        // Normalisation des donnees
        const prix = parseFloat(prixInput.value);
        const quantite = parseFloat(quantiteInput.value);
        const date = dateInput.value || new Date().toISOString();
        const magasin = magasinInput.value || "Inconnu";
    
        // Verifiaction validite
        if (isNaN(prix) || isNaN(quantite) || prix <= 0 || quantite <= 0) {
            alert("Veuillez entrer un prix et une quantité valides.");
            return;
        }
    
        const historique = JSON.parse(localStorage.getItem("HistoriqueData_" + nom)) || [];
    
        historique.push({
            Prix: prix,
            Quantite: quantite,
            Date: new Date(date).toISOString(),
            Magasin: magasin
        });
        
        // Enregistrement des donnees
        localStorage.setItem("HistoriqueData_" + nom, JSON.stringify(historique));
    
        // Reset
        prixInput.value = "";
        quantiteInput.value = "";
        magasinInput.value = "";
    
        this.get_data();
    };
    

    get_class = () => {
        if (this.state.unroll) {
            return "ProduitInfosSection Unroll";
        } else {
            return "ProduitInfosSection Rolled";
        }
    }

    render() {
        const { name } = this.props;

        return (
            <div className="ProduitDiv">
                <u className="ProduitName" onClick={() => this.setState({ unroll: !this.state.unroll })}>{name}</u>
                
                <div className={this.get_class()}>

                    <hr className="SeparationLigne" />

                    {
                        this.state.graphe? 
                        <ProduitGraph name={name} />
                        :this.state.suppr?
                        <ProduitSuppr name={name} />
                        
                        :<ProduitInfo
                            name={name}
                            moyen={this.state.moyen_u}
                            dernier={this.state.dernier}
                            dernierDate={this.state.dernierDate}
                            Ajouter={this.Ajouter}
                            quantiteTotale={this.state.quantiteTotale}
                            prixTotal={this.state.prixTotal}
                            prixUnitaireMin={this.state.prixUnitaireMin}
                            magasinMin={this.state.magasinMin}
                        />
                    }

                    <hr className="SeparationLigne" />

                    {
                        this.state.graphe || this.state.suppr?
                        <div className="ProduitGraphButon" onClick={() => this.setState({ graphe: false, suppr: false })}>Retour</div>
                        :<div className="BoutonsProduit">
                            <div className="ProduitGraphButon" onClick={() => this.setState({ suppr: !this.state.suppr })}>Supprimer</div>
                            <div className="ProduitGraphButon" onClick={() => this.setState({ graphe: !this.state.graphe })}>Graph</div>
                        </div>
                    }

                </div>

            </div>
        );
    }
}
