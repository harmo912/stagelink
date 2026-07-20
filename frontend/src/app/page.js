"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";

const API = "http://127.0.0.1:8000/api";

export default function HomePage() {
  const [apercu, setApercu] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApercu = async () => {
      try {
        const res = await axios.get(`${API}/entreprises`);
        setApercu(res.data.slice(0, 3));
      } catch (err) {
        console.error("Erreur chargement aperçu :", err);
      } finally {
        setLoading(false);
      }
    };
    fetchApercu();
  }, []);

  return (
    <div className="w-full bg-zinc-50 pb-20">
      {/* SECTION 1 : POURQUOI STAGELINK */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-16">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
            L'annuaire de référence des entreprises béninoises.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-white/60 backdrop-blur-md border border-zinc-200/80 rounded-3xl transition-all duration-300 hover:-translate-y-2 hover:bg-white hover:shadow-2xl hover:border-zinc-300">
            <div className="w-12 h-12 bg-zinc-900 text-white rounded-2xl flex items-center justify-center mb-6 shadow-sm">
              <i className="bi bi-search text-lg"></i>
            </div>
            <h3 className="text-base font-bold text-zinc-900">Recherche simple</h3>
            <p className="text-zinc-600 text-xs mt-3 leading-relaxed">
              Filtrez les entreprises par domaine d'activité ou par ville, en quelques secondes.
            </p>
          </div>

          <div className="p-8 bg-white/60 backdrop-blur-md border border-zinc-200/80 rounded-3xl transition-all duration-300 hover:-translate-y-2 hover:bg-white hover:shadow-2xl hover:border-zinc-300">
            <div className="w-12 h-12 bg-zinc-900 text-white rounded-2xl flex items-center justify-center mb-6 shadow-sm">
              <i className="bi bi-telephone text-lg"></i>
            </div>
            <h3 className="text-base font-bold text-zinc-900">Contact direct</h3>
            <p className="text-zinc-600 text-xs mt-3 leading-relaxed">
              Téléphone, email, site web — toutes les coordonnées pour joindre l'entreprise vous-même.
            </p>
          </div>

          <div className="p-8 bg-white/60 backdrop-blur-md border border-zinc-200/80 rounded-3xl transition-all duration-300 hover:-translate-y-2 hover:bg-white hover:shadow-2xl hover:border-zinc-300">
            <div className="w-12 h-12 bg-zinc-900 text-white rounded-2xl flex items-center justify-center mb-6 shadow-sm">
              <i className="bi bi-building-check text-lg"></i>
            </div>
            <h3 className="text-base font-bold text-zinc-900">Aucun compte requis</h3>
            <p className="text-zinc-600 text-xs mt-3 leading-relaxed">
              L'annuaire est entièrement libre d'accès, sans inscription ni connexion.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2 : COMMENT ÇA MARCHE */}
      <section className="w-full bg-white border-y border-zinc-200/80 py-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Simple et direct</span>
            <h2
              className="text-3xl font-bold text-zinc-900 tracking-tight mt-2 mb-6"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Comment ça marche ?
            </h2>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-200 text-zinc-800 flex items-center justify-center text-xs font-bold">1</div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-900">Parcourez l'annuaire</h4>
                  <p className="text-zinc-500 text-xs mt-1">Consultez la liste complète des entreprises référencées.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-200 text-zinc-800 flex items-center justify-center text-xs font-bold">2</div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-900">Filtrez selon vos critères</h4>
                  <p className="text-zinc-500 text-xs mt-1">Par domaine d'activité, par ville, ou les deux combinés.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-200 text-zinc-800 flex items-center justify-center text-xs font-bold">3</div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-900">Contactez l'entreprise</h4>
                  <p className="text-zinc-500 text-xs mt-1">Par téléphone, email ou site web — directement, sans intermédiaire.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 bg-zinc-50 border border-zinc-200 rounded-3xl shadow-sm space-y-4">
            <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Aperçu rapide</h3>
            <div className="h-3 w-2/3 bg-zinc-200/60 rounded-full"></div>
            <div className="h-3 w-full bg-zinc-200/60 rounded-full"></div>
            <div className="h-3 w-1/2 bg-zinc-200/60 rounded-full"></div>
            <div className="pt-4 flex justify-end">
              <Link href="/annuaire" className="px-5 py-2.5 bg-zinc-900 text-white rounded-full text-xs font-semibold hover:bg-zinc-800 transition">
                Explorer l'annuaire
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 : APERÇU DE QUELQUES ENTREPRISES */}
      <section className="max-w-7xl mx-auto px-6 pt-20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Quelques exemples</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight mt-1" style={{ fontFamily: "var(--font-display)" }}>
              Entreprises référencées
            </h2>
          </div>
          <Link href="/annuaire" className="text-xs font-bold text-zinc-900 hover:underline">
            Voir toutes les entreprises →
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-16 text-zinc-400 text-sm font-medium">Chargement...</div>
        ) : apercu.length === 0 ? (
          <div className="text-center py-16 bg-white border border-dashed border-zinc-200 rounded-2xl">
            <p className="text-sm text-zinc-500 font-semibold">Aucune entreprise référencée pour l'instant.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {apercu.map((entreprise) => (
              <div
                key={entreprise.idEntreprise}
                className="p-6 bg-white/60 backdrop-blur-md border border-zinc-200/80 rounded-2xl flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 hover:bg-white hover:shadow-2xl hover:border-zinc-300"
              >
                <div>
                  {entreprise.domaines?.[0] && (
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide bg-zinc-200/60 px-2 py-0.5 rounded">
                      {entreprise.domaines[0].nomDomaine}
                    </span>
                  )}
                  <h4 className="text-base font-bold text-zinc-900 mt-3 line-clamp-1">{entreprise.nom}</h4>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-200 flex justify-between items-center text-xs text-zinc-500">
                  <div className="flex items-center gap-1 font-medium">
                    <i className="bi bi-geo-alt text-zinc-400"></i>
                    <span>{entreprise.ville || "Bénin"}</span>
                  </div>
                  <Link href="/annuaire" className="font-bold text-zinc-900 hover:opacity-70 transition">
                    Voir le contact
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}