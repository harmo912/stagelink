"use client";

import { useState, useEffect } from "react";
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function AnnuairePage() {
  const [entreprises, setEntreprises] = useState([]);
  const [domaines, setDomaines] = useState([]);
  const [villes, setVilles] = useState([]);
  const [domaineFiltre, setDomaineFiltre] = useState("");
  const [villeFiltre, setVilleFiltre] = useState("");
  const [recherche, setRecherche] = useState("");
  const [loading, setLoading] = useState(true);

  const [favoris, setFavoris] = useState([]);
  const [showFavorisOnly, setShowFavorisOnly] = useState(false);

  useEffect(() => {
  const nettoyerFavoris = async () => {
    const stored = localStorage.getItem("stagelink_favoris");
    if (!stored) return;

    const favorisStockes = JSON.parse(stored);
    if (favorisStockes.length === 0) return;

    try {
      const res = await axios.get(`${API}/entreprises`);
      const idsExistants = new Set(res.data.map((e) => e.idEntreprise));
      const favorisValides = favorisStockes.filter((id) => idsExistants.has(id));

      setFavoris(favorisValides);
      localStorage.setItem("stagelink_favoris", JSON.stringify(favorisValides));
    } catch (err) {
      console.error("Erreur nettoyage favoris :", err);
      setFavoris(favorisStockes);
    }
  };

  nettoyerFavoris();
}, []);

const toggleFavori = (idEntreprise) => {
  setFavoris((prev) => {
    const next = prev.includes(idEntreprise)
      ? prev.filter((id) => id !== idEntreprise)
      : [...prev, idEntreprise];
    localStorage.setItem("stagelink_favoris", JSON.stringify(next));
    return next;
  });
};

  useEffect(() => {
    const fetchDomaines = async () => {
      try {
        const res = await axios.get(`${API}/domaines`);
        setDomaines(res.data);
      } catch (err) {
        console.error("Erreur chargement domaines :", err);
      }
    };
    fetchDomaines();
  }, []);

  useEffect(() => {
    const fetchEntreprises = async () => {
      setLoading(true);
      try {
        const params = {};
        if (domaineFiltre) params.domaine = domaineFiltre;
        if (villeFiltre) params.ville = villeFiltre;
        if (recherche.trim()) params.recherche = recherche.trim();
        const res = await axios.get(`${API}/entreprises`, { params });
        setEntreprises(res.data);

        if (!villeFiltre) {
          const villesUniques = [...new Set(res.data.map((e) => e.ville).filter(Boolean))];
          setVilles(villesUniques);
        }
      } catch (err) {
        console.error("Erreur chargement entreprises :", err);
      } finally {
        setLoading(false);
      }
    };
    const debounce = setTimeout(fetchEntreprises, 300);
    return () => clearTimeout(debounce);
  }, [domaineFiltre, villeFiltre, recherche]);

  const entreprisesAffichees = showFavorisOnly
    ? entreprises.filter((e) => favoris.includes(e.idEntreprise))
    : entreprises;

  const resetFiltres = () => {
    setDomaineFiltre("");
    setVilleFiltre("");
    setRecherche("");
    setShowFavorisOnly(false);
  };

  return (
    <div className="min-h-screen bg-zinc-50 pb-16 pt-8 sm:pt-12">
      <main className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900" style={{ fontFamily: "var(--font-display)" }}>
              Annuaire des entreprises
            </h1>
            <p className="text-zinc-500 text-sm font-medium mt-1">
              Retrouvez leurs coordonnées et contactez-les directement.
            </p>
          </div>

          <button
            onClick={() => setShowFavorisOnly(!showFavorisOnly)}
            className={`flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl border transition shrink-0 ${
              showFavorisOnly
                ? "bg-red-50 border-red-200 text-red-600"
                : "bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300"
            }`}
          >
            <i className={`bi ${showFavorisOnly ? "bi-heart-fill" : "bi-heart"}`}></i>
            Mes favoris {favoris.length > 0 && `(${favoris.length})`}
          </button>
        </div>

        {/* RECHERCHE + FILTRES */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-sm space-y-3 mb-8">
          <div className="relative">
            <i className="bi bi-search absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"></i>
            <input
              type="text"
              placeholder="Rechercher une entreprise, une ville, un domaine..."
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 text-sm font-medium text-zinc-900 border border-zinc-200 rounded-xl focus:outline-none focus:border-[#4F46E5] focus:bg-white transition"
            />
          </div>

          <div className="flex flex-col md:flex-row gap-3 items-center">
            <div className="w-full md:w-auto flex items-center gap-2">
              <i className="bi bi-funnel text-zinc-400"></i>
              <select
                value={domaineFiltre}
                onChange={(e) => setDomaineFiltre(e.target.value)}
                className="w-full md:w-auto px-3 py-2.5 bg-zinc-50 text-sm font-semibold text-zinc-800 border border-zinc-200 rounded-xl focus:outline-none focus:border-[#4F46E5] transition"
              >
                <option value="">Tous les domaines</option>
                {domaines.map((d) => (
                  <option key={d.idDomaine} value={d.nomDomaine}>
                    {d.nomDomaine}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full md:w-auto flex items-center gap-2">
              <i className="bi bi-geo-alt text-zinc-400"></i>
              <select
                value={villeFiltre}
                onChange={(e) => setVilleFiltre(e.target.value)}
                className="w-full md:w-auto px-3 py-2.5 bg-zinc-50 text-sm font-semibold text-zinc-800 border border-zinc-200 rounded-xl focus:outline-none focus:border-[#4F46E5] transition"
              >
                <option value="">Toutes les villes</option>
                {villes.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>

            {(domaineFiltre || villeFiltre || recherche || showFavorisOnly) && (
              <button
                onClick={resetFiltres}
                className="text-xs font-bold text-zinc-500 hover:text-zinc-900 transition flex items-center gap-1"
              >
                <i className="bi bi-x-circle"></i>
                Réinitialiser
              </button>
            )}
          </div>
        </div>

        {/* LISTE */}
        <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider mb-4">
          {!loading &&
            `${entreprisesAffichees.length} entreprise${entreprisesAffichees.length > 1 ? "s" : ""}`}
        </h2>

        {loading ? (
          <div className="text-center py-16 text-zinc-400 text-sm font-medium">Chargement...</div>
        ) : entreprisesAffichees.length === 0 ? (
          <div className="text-center py-16 bg-white border border-dashed border-zinc-200 rounded-2xl">
            <i className={`bi ${showFavorisOnly ? "bi-heart" : "bi-building"} text-3xl text-zinc-300`}></i>
            <p className="text-sm text-zinc-500 font-semibold mt-3">
              {showFavorisOnly
                ? "Aucune entreprise en favori pour l'instant."
                : "Aucune entreprise ne correspond à ces critères."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {entreprisesAffichees.map((entreprise) => {
              const estFavori = favoris.includes(entreprise.idEntreprise);
              return (
                <div
                  key={entreprise.idEntreprise}
                  className="relative p-6 bg-white border border-zinc-200 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <button
                    onClick={() => toggleFavori(entreprise.idEntreprise)}
                    className="absolute top-5 right-5 text-lg transition-colors"
                    aria-label="Ajouter aux favoris"
                  >
                    <i
                      className={`bi ${estFavori ? "bi-heart-fill text-red-500" : "bi-heart text-zinc-300 hover:text-zinc-400"}`}
                    ></i>
                  </button>

                  <div className="w-12 h-12 rounded-xl bg-[#4F46E5]/10 text-[#4F46E5] flex items-center justify-center mb-4">
                    <i className="bi bi-building text-xl"></i>
                  </div>

                  <h3 className="text-sm font-bold text-zinc-900 pr-6">{entreprise.nom}</h3>

                  {entreprise.ville && (
                    <p className="text-xs text-zinc-500 font-medium mt-1 flex items-center gap-1">
                      <i className="bi bi-geo-alt"></i>
                      {entreprise.ville}
                    </p>
                  )}

                  {entreprise.domaines?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {entreprise.domaines.map((d) => (
                        <span
                          key={d.idDomaine}
                          className="text-[10px] font-bold text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded-full"
                        >
                          {d.nomDomaine}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-5 pt-4 border-t border-zinc-100 space-y-2">
                    {entreprise.telephone && (
                      <a
                        href={`tel:${entreprise.telephone}`}
                        className="flex items-center gap-2 text-xs font-semibold text-zinc-700 hover:text-[#4F46E5] transition"
                      >
                        <i className="bi bi-telephone"></i>
                        {entreprise.telephone}
                      </a>
                    )}
                    {entreprise.email && (
                      <a
                        href={`mailto:${entreprise.email}`}
                        className="flex items-center gap-2 text-xs font-semibold text-zinc-700 hover:text-[#4F46E5] transition"
                      >
                        <i className="bi bi-envelope"></i>
                        {entreprise.email}
                      </a>
                    )}
                    {entreprise.siteWeb && (
                      <a
                        href={entreprise.siteWeb}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-xs font-semibold text-zinc-700 hover:text-[#4F46E5] transition"
                      >
                        <i className="bi bi-globe"></i>
                        Site web
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}