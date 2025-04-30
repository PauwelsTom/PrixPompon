import { Component } from "react";
import "./GroupeProduit.css";
import { Produit } from "./Produit";
import { iconeChevronBas } from "../Data/Data";

export class GroupeProduit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ouvert: false,
            produitsAffiches: 0
        };
        this.timeouts = [];
    }

    componentWillUnmount() {
        this.clearTimeouts();
    }

    clearTimeouts = () => {
        this.timeouts.forEach(timeout => clearTimeout(timeout));
        this.timeouts = [];
    }

    toggleOuverture = () => {
        const { ouvert } = this.state;
        if (!ouvert) {
            // On ouvre : animation progressive
            this.setState({ ouvert: true, produitsAffiches: 0 }, () => {
                this.afficherProduitsProgressivement();
            });
        } else {
            // On referme : on coupe tout
            this.clearTimeouts();
            this.setState({ ouvert: false, produitsAffiches: 0 });
        }
    }

    afficherProduitsProgressivement = () => {
        const { produits } = this.props;
        produits.forEach((_, index) => {
            const timeout = setTimeout(() => {
                this.setState(prev => ({ produitsAffiches: prev.produitsAffiches + 1 }));
            }, index * 100); // 100ms entre chaque
            this.timeouts.push(timeout);
        });
    }

    get_class_chevron = () => {
        return this.state.ouvert ? "IconeChevronBas Ouvert" : "IconeChevronBas";
    }

    render() {
        const { produits } = this.props;
        const { ouvert, produitsAffiches } = this.state;

        return (
            <div className="groupe-produit">
                <div
                    className="groupe-titre"
                    onClick={this.toggleOuverture}
                    style={{ cursor: "pointer", fontWeight: "bold" }}
                >
                    <img className={this.get_class_chevron()} src={iconeChevronBas} alt="Icone chevron bas" />
                    <span className="titreGroupe">{this.props.titre}</span>
                </div>

                {ouvert && (
                    <div className="liste-produits fade-in">
                        {produits.slice(0, produitsAffiches).map((produit, index) => (
                            <Produit key={index} name={produit} />
                        ))}
                    </div>
                )}
            </div>
        );
    }
}
