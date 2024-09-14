import React, { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";


const Index = () => {
    const [parrains, setParrains] = useState([]);
    const [filleuls, setFilleuls] = useState([]);
    const [filiere, setFiliere] = useState(""); // État pour la filière sélectionnée

    const getCurrentSchoolYear = () => {
        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth(); // Mois commence à 0 pour janvier, donc novembre est 10

        // Si on est en novembre ou après, l'année scolaire est "année courante - année suivante"
        if (currentMonth >= 10) {
            // Mois >= 10 signifie novembre ou après
            return `${currentYear}-${currentYear + 1}`;
        } else {
            // Si on est avant novembre, l'année scolaire est "année précédente - année courante"
            return `${currentYear - 1}-${currentYear}`;
        }
    };

    const currentSchoolYear = getCurrentSchoolYear();
    console.log(currentSchoolYear); // Affichera l'année scolaire actuelle

    const handleFileUpload = (event, setter) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            // Ignorer la première ligne (A1)
            const filteredData = jsonData.slice(1).flat();
            setter(filteredData);
        };

        reader.readAsArrayBuffer(file);
    };

    const shuffleArray = (array) => {
        return array.sort(() => 0.5 - Math.random());
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (parrains.length === 0 || filleuls.length === 0) {
            alert(
                "Veuillez télécharger les fichiers de parrains et de filleuls.",
            );
            return;
        }

        if (!filiere) {
            alert("Veuillez sélectionner une filière.");
            return;
        }

        // Tri des filleuls par ordre alphabétique
        const sortedFilleuls = filleuls.sort((a, b) => a.localeCompare(b));

        // Mélange des parrains pour une attribution aléatoire
        const shuffledParrains = shuffleArray([...parrains]);

        // Attribution des parrains aléatoirement
        const attribution = [];
        let parrainIndex = 0;

        sortedFilleuls.forEach((filleul, index) => {
            attribution.push([
                index + 1,
                filleul,
                shuffledParrains[parrainIndex],
            ]);
            parrainIndex++;
            if (parrainIndex >= shuffledParrains.length) {
                parrainIndex = 0;
            }
        });

        // Génération du fichier PDF
        const doc = new jsPDF();
        doc.text(
            `Attribution Parrains et Filleuls - ${currentSchoolYear} - ${filiere}`,
            20,
            10,
        ); // Ajout de la filière dans le PDF
        doc.autoTable({
            head: [["#", "Nom Filleul", "Nom Parrain"]],
            body: attribution,
        });

        doc.save(`attribution_parrain_filleul_${filiere}.pdf`); // Utilisation de la filière dans le nom du fichier
    };

    return (
        <div>
            <div className="container">
                <h1>Attribution Parrains et Filleuls {currentSchoolYear}</h1>
                <form id="uploadForm" onSubmit={handleSubmit}>
                    <label htmlFor="fileParrains">
                        Le fichier des parrains
                    </label>
                    <input
                        type="file"
                        id="fileParrains"
                        accept=".csv, .xlsx"
                        required
                        className="input-group"
                        onChange={(e) => handleFileUpload(e, setParrains)}
                    />

                    <label htmlFor="fileFilleuls">
                        Le fichier des filleuls
                    </label>
                    <input
                        type="file"
                        id="fileFilleuls"
                        accept=".csv, .xlsx"
                        required
                        className="input-group"
                        onChange={(e) => handleFileUpload(e, setFilleuls)}
                    />

                    <label htmlFor="sel1" className="form-label">
                        Sélectionner la filière :
                    </label>
                    <select
                        className="form-select"
                        id="classe"
                        name="sellist1"
                        value={filiere}
                        onChange={(e) => setFiliere(e.target.value)} // Mise à jour de la filière sélectionnée
                        required
                    >
                        <option value="">Sélectionner une filière</option>
                        <option value="EJ">EJ</option>
                        <option value="ETTA">ETTA</option>
                        <option value="EPA">EPA</option>
                        <option value="EPM">EPM</option>
                        <option value="EAIN">EAIN</option>
                    </select>
                    <br></br>
                    <br></br>

                    <button id="generate" type="submit">
                        Générer le fichier PDF
                    </button>
                </form>
            </div>
            <div className="toast show">
                <div className="toast-header">
                    <strong className="me-auto">Developpeur 1</strong>
                    <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="toast"
                    />
                </div>
                <div className="toast-body">
                    <p>YEO YEPELEYA TENENA</p>
                    <div className="social-icons">
                        <a
                            href="https://www.facebook.com/AEISTC"
                            target="_blank" rel="noreferrer"
                        >
                            <i className="fa-brands fa-facebook-f" />
                        </a>
                        <a
                            href="https://www.instagram.com/ae.istc"
                            target="_blank" rel="noreferrer"
                        >
                            <i className="fa-brands fa-instagram" />
                        </a>
                    </div>
                </div>
            </div>
            <div className="toast show">
                <div className="toast-header">
                    <strong className="me-auto">Developpeur 2</strong>
                    <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="toast"
                    />
                </div>
                <div className="toast-body">
                    <p>Tiendrebeogo christoin aquilas</p>
                </div>
            </div>
        </div>
    );
};

export default Index;
