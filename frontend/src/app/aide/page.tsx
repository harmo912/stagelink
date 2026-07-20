"use client";

import { useState } from "react";
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL;

const faqs = [
  {
    question: "Comment consulter les entreprises ?",
    reponse:
      "Rendez-vous sur la page Annuaire. La liste complète des entreprises référencées s'affiche directement, sans inscription ni connexion nécessaire.",
  },
  {
    question: "Comment filtrer les résultats ?",
    reponse:
      "Trois façons de filtrer sont disponibles : le domaine d'activité, la ville, et une recherche textuelle libre. Vous pouvez les combiner librement.",
  },
  {
    question: "Comment contacter une entreprise ?",
    reponse:
      "Chaque fiche affiche le téléphone, l'email et le site web de l'entreprise lorsqu'ils sont disponibles. Cliquez directement dessus pour ouvrir votre application de téléphone ou de messagerie.",
  },
  {
    question: "Le site nécessite-t-il un compte ?",
    reponse:
      "Non. StageLink est entièrement libre d'accès. Aucune inscription, aucune connexion n'est requise pour consulter l'annuaire ou gérer vos favoris.",
  },
  {
    question: "Une entreprise n'apparaît pas dans l'annuaire, que faire ?",
    reponse:
      "L'annuaire est mis à jour manuellement. Si une entreprise est absente ou si une coordonnée est erronée, utilisez le formulaire ci-dessous pour nous le signaler.",
  },
];

export default function AidePage() {
  const [openIndex, setOpenIndex] = useState(null);

  const [formData, setFormData] = useState({ nom: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError("");
    try {
      await axios.post(`${API}/messages`, formData);
      setSent(true);
      setFormData({ nom: "", email: "", message: "" });
    } catch (err) {
      setError("Une erreur est survenue. Réessayez dans quelques instants.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 pb-16 pt-8 sm:pt-12">
      <main className="max-w-3xl mx-auto px-5 sm:px-8">
        <div className="mb-10 text-center">
          <h1
            className="text-2xl sm:text-3xl font-bold text-zinc-900"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Aide & Support
          </h1>
          <p className="text-zinc-500 text-sm font-medium mt-2">
            Tout ce qu'il faut savoir pour utiliser StageLink.
          </p>
        </div>

        {/* FAQ */}
        <div className="space-y-3 mb-12">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white border border-zinc-200 rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="text-sm font-semibold text-zinc-900">{faq.question}</span>
                  <i
                    className={`bi bi-chevron-down text-zinc-400 transition-transform duration-200 shrink-0 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  ></i>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-out ${
                    isOpen ? "max-h-40" : "max-h-0"
                  }`}
                >
                  <p className="px-5 pb-4 text-xs text-zinc-500 font-medium leading-relaxed">
                    {faq.reponse}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* FORMULAIRE DE CONTACT */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-8">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#4F46E5]/10 text-[#4F46E5] flex items-center justify-center mx-auto mb-4">
              <i className="bi bi-chat-dots text-lg"></i>
            </div>
            <h2 className="text-sm font-bold text-zinc-900">Une question qui n'est pas listée ici ?</h2>
            <p className="text-xs text-zinc-500 font-medium mt-2 max-w-sm mx-auto">
              Envoyez-nous un message pour signaler une entreprise absente, une information erronée, ou toute autre remarque.
            </p>
          </div>

          {sent ? (
            <div className="text-center py-6">
              <i className="bi bi-check-circle text-3xl text-emerald-500"></i>
              <p className="text-sm font-semibold text-zinc-900 mt-3">Message envoyé avec succès.</p>
              <p className="text-xs text-zinc-500 mt-1">Merci pour votre retour, nous le traiterons rapidement.</p>
              <button
                onClick={() => setSent(false)}
                className="text-xs font-bold text-[#4F46E5] hover:underline mt-4"
              >
                Envoyer un autre message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
              {error && (
                <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-xs font-semibold text-red-600">
                  {error}
                </div>
              )}
              <input
                name="nom"
                placeholder="Votre nom"
                value={formData.nom}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#4F46E5] transition"
                required
              />
              <input
                name="email"
                type="email"
                placeholder="Votre email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#4F46E5] transition"
                required
              />
              <textarea
                name="message"
                placeholder="Votre message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#4F46E5] transition resize-none"
                required
              />
              <button
                type="submit"
                disabled={sending}
                className="w-full flex items-center justify-center gap-2 text-sm font-semibold px-5 py-3 rounded-xl bg-[#4F46E5] text-white hover:bg-[#4338CA] transition-colors disabled:opacity-50"
              >
                <i className="bi bi-send"></i>
                {sending ? "Envoi..." : "Envoyer le message"}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}