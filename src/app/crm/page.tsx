import React from 'react';

const Page = () => {
  return (
    <main>
      <section id="stats">
        <h2>Statistiques</h2>
        <div className="stat-item">
          <h3>Clients</h3>
          <p>Nombre total: 150</p>
        </div>
        <div className="stat-item">
          <h3>Ventes</h3>
          <p>Ce mois: 120</p>
        </div>
        <div className="stat-item">
          <h3>Revenus</h3>
          <p>Ce mois: 50,000€</p>
        </div>
      </section>
      <section id="recent-activities">
        <h2>Activités Récentes</h2>
        <ul>
          <li>Nouvelle vente: Client A - 500€</li>
          <li>Nouvelle vente: Client B - 300€</li>
          <li>Client C a été ajouté</li>
        </ul>
      </section>
    </main>
  );
};

export default Page;