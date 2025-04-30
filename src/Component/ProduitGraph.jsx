import { Component } from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";
import "./ProduitGraph.css";

// Enregistrer les composants Chart.js nécessaires
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export class ProduitGraph extends Component {
    constructor(props) {
        super();
        this.state = {
            chartData: {
                labels: [], // Dates
                datasets: [{
                    label: 'Prix unitaire (€)',
                    data: [], // Prix unitaires
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    fill: true,
                    tension: 0.1,
                }]
            },
            extraData: [], // Pour stocker quantité & magasin pour chaque point
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const point = context.raw;
                                return [
                                    `Prix unitaire: ${point.y.toFixed(2)}€`,
                                    `Quantité: ${point.quantite}`,
                                    `Magasin: ${point.magasin}`
                                ];
                            }
                        }
                    }                       
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: "Date d'achat"
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Prix (€)'
                        },
                        min: 0
                    }
                },
                elements: {
                    line: {
                        borderWidth: 3
                    },
                    point: {
                        radius: 5
                    }
                },
                layout: {
                    padding: 20
                }
            }
        };
    }

    componentDidMount() {
        this.loadGraphData();
    }

    loadGraphData = () => {
        const nom = this.props.name;
        const historique = JSON.parse(localStorage.getItem("HistoriqueData_" + nom)) || [];
        historique.sort((a, b) => new Date(a.Date) - new Date(b.Date));

        const optionsDate = { day: 'numeric', month: 'long' };
    
        const labels = [];
        const dataPoints = [];
    
        historique.forEach(entry => {
            const dateObj = new Date(entry.Date);
            const formattedDate = dateObj.toLocaleDateString("fr-FR", optionsDate);
    
            const prixUnitaire = entry.Prix / entry.Quantite;
    
            labels.push(formattedDate);
            dataPoints.push({
                x: formattedDate,
                y: prixUnitaire,
                quantite: entry.Quantite,
                magasin: entry.Magasin
            });
        });
    
        this.setState({
            chartData: {
                labels: labels,
                datasets: [{
                    label: 'Prix unitaire (€)',
                    data: dataPoints,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    fill: true,
                    tension: 0.1,
                }]
            }
        });
    };
    

    render() {
        const { chartData, options } = this.state;

        return (
            <div className="ProduitGraph">
                <h2>Évolution des prix de {this.props.name}</h2>
                <Line data={chartData} options={options} height={400} />
            </div>
        );
    }
}
