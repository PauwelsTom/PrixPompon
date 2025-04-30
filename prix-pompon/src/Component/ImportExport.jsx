import { Component } from "react";
import "./ImportExport.css";
import { Boissons, Crepes, Fournitures } from "../Data/Data";

export class ImportExport extends Component {
    constructor(props) {
        super();
    }

    exporterDonnees = () => {
        const tousLesProduits = [...Boissons, ...Crepes, ...Fournitures]; // ← On regroupe tous les produits

        let donneesExportees = {};

        tousLesProduits.forEach(nom => {
            const historique = JSON.parse(localStorage.getItem("HistoriqueData_" + nom)) || [];
            if (historique.length > 0) {
                donneesExportees[nom] = historique;
            }
        });

        const donneesString = JSON.stringify(donneesExportees);

        // Compatibilité mobile (clipboard)
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(donneesString).then(() => {
                alert("Les données ont été copiées dans le presse-papier !");
            }).catch(() => {
                // Fallback prompt (ex. iOS)
                window.prompt("Copiez manuellement les données ci-dessous :", donneesString);
            });
        } else {
            // Fallback prompt (ex. iOS plus anciens)
            window.prompt("Copiez manuellement les données ci-dessous :", donneesString);
        }
    };

    importerDonnees = () => {
        const donneesCollees = window.prompt("Collez ici les données exportées :");

        if (donneesCollees) {
            try {
                const donneesImportees = JSON.parse(donneesCollees);

                for (const nom in donneesImportees) {
                    const historique = donneesImportees[nom];

                    const existant = JSON.parse(localStorage.getItem("HistoriqueData_" + nom)) || [];

                    const fusion = [...existant, ...historique];

                    const unique = fusion.filter((item, index, self) =>
                        index === self.findIndex(other =>
                            item.Date === other.Date &&
                            item.Prix === other.Prix &&
                            item.Quantite === other.Quantite &&
                            item.Magasin === other.Magasin
                        )
                    );

                    unique.sort((a, b) => new Date(a.Date) - new Date(b.Date));

                    localStorage.setItem("HistoriqueData_" + nom, JSON.stringify(unique));
                }

                alert("Importation réussie !");
                window.location.reload();
            } catch (e) {
                alert("Les données sont invalides : " + e.message);
            }
        }
    };

    render() {
        return (
            <div className="Actions">
                <button className="ImportExportButton" onClick={this.exporterDonnees}>Exporter</button>
                <button className="ImportExportButton" onClick={this.importerDonnees}>Importer</button>
            </div>
        );
    }
}
