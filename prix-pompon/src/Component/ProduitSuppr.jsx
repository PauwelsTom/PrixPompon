import { Component } from "react";
import "./ProduitSuppr.css";

export class ProduitSuppr extends Component {
    constructor() {
        super();
        this.state = {
            historique: [],
        };
    }

    componentDidMount() {
        this.loadHistorique();
    }

    loadHistorique = () => {
        const nom = this.props.name;
        const historique = JSON.parse(localStorage.getItem("HistoriqueData_" + nom)) || [];

        // ✅ Tri par date décroissante (du plus récent au plus ancien)
        const historiqueTrie = historique.sort((a, b) => new Date(b.Date) - new Date(a.Date));

        this.setState({ historique: historiqueTrie });
    };

    supprimerElement = (index) => {
        const { historique } = this.state;
        const nom = this.props.name;
        const item = historique[index];
    
        // Format du message de confirmation
        const confirmationMessage = `Voulez-vous supprimer l'achat du ${new Date(item.Date).toLocaleDateString("fr-FR", { day: 'numeric', month: 'long' })} ?\n\n` +
            `Vous avez acheté ${item.Quantite} ${nom} pour ${(item.Prix / item.Quantite).toFixed(2)}€ l'unité chez ${item.Magasin}.`;


        // Afficher la fenêtre de confirmation
        const isConfirmed = window.confirm(confirmationMessage);
    
        // Si l'utilisateur confirme, supprimer l'élément
        if (isConfirmed) {
            const updatedHistorique = [...historique];
            updatedHistorique.splice(index, 1);
    
            // Mettre à jour le localStorage avec la version modifiée de l'historique
            localStorage.setItem("HistoriqueData_" + nom, JSON.stringify(updatedHistorique));
    
            // Mettre à jour l'état
            this.setState({ historique: updatedHistorique });
        }
    };
    

    render() {
        const { historique } = this.state;

        return (
            <div className="ProduitHistorique">
                <h3>Historique des achats</h3>
                <div className="HistoriqueTable">
                    <div className="TableHeader">
                        <div className="TableCell">Date</div>
                        <div className="TableCell">Prix</div>
                        <div className="TableCell">Supprimer</div>
                    </div>
                    <div className="TableBody">
                        {historique.length > 0 ? (
                            historique.map((item, index) => (
                                <div key={index} className="TableRow">
                                    <div className="TableCell">
                                        {new Date(item.Date).toLocaleDateString("fr-FR", { day: 'numeric', month: 'long' })}
                                    </div>
                                    <div className="TableCell">
                                        {(item.Prix / item.Quantite).toFixed(2)}€
                                    </div>
                                    <div className="TableCell">
                                        <button className="SupprimerButton" onClick={() => this.supprimerElement(index)}>
                                            Supprimer
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div>Aucun achat enregistré</div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}
