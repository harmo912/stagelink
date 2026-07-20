"use client";

import { useState, useEffect } from "react";
import axios from "axios";

const API = "http://127.0.0.1:8000/api";

export default function CpanelPage() {
  const [token, setToken] = useState(null);
  const [checking, setChecking] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);

  const [activeTab, setActiveTab] = useState("entreprises");
  const [entreprises, setEntreprises] = useState([]);
  const [domaines, setDomaines] = useState([]);
  const [showEntrepriseForm, setShowEntrepriseForm] = useState(false);
  const [editingEntreprise, setEditingEntreprise] = useState(null);
  const [entrepriseForm, setEntrepriseForm] = useState({
    nom: "", ville: "", telephone: "", email: "", siteWeb: "", domaines: [],
  });

  const [newDomaine, setNewDomaine] = useState("");
  const [feedback, setFeedback] = useState(null);

 useEffect(() => {
  const verifierToken = async () => {
    const stored = localStorage.getItem("admin_token");
    if (!stored) {
      setChecking(false);
      return;
    }

    try {
      await axios.get(`${API}/admin/me`, {
        headers: { Authorization: `Bearer ${stored}` },
      });
      setToken(stored);
    } catch (err) {
      localStorage.removeItem("admin_token");
      setToken(null);
    } finally {
      setChecking(false);
    }
  };

  verifierToken();
}, []);

  useEffect(() => {
    if (token) {
      fetchEntreprises();
      fetchDomaines();
    }
  }, [token]);

  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  const fetchEntreprises = async () => {
    const res = await axios.get(`${API}/entreprises`);
    setEntreprises(res.data);
  };

  const fetchDomaines = async () => {
    const res = await axios.get(`${API}/domaines`);
    setDomaines(res.data);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoginError("");
    try {
      const res = await axios.post(`${API}/admin/login`, { email, password });
      localStorage.setItem("admin_token", res.data.token);
      setToken(res.data.token);
    } catch (err) {
      setLoginError(err.response?.data?.message || "Identifiants incorrects.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    setToken(null);
  };

  const openNewEntrepriseForm = () => {
    setEditingEntreprise(null);
    setEntrepriseForm({ nom: "", ville: "", telephone: "", email: "", siteWeb: "", domaines: [] });
    setShowEntrepriseForm(true);
  };

  const openEditEntrepriseForm = (entreprise) => {
    setEditingEntreprise(entreprise.idEntreprise);
    setEntrepriseForm({
      nom: entreprise.nom || "",
      ville: entreprise.ville || "",
      telephone: entreprise.telephone || "",
      email: entreprise.email || "",
      siteWeb: entreprise.siteWeb || "",
      domaines: entreprise.domaines?.map((d) => d.idDomaine) || [],
    });
    setShowEntrepriseForm(true);
  };

  const toggleDomaineInForm = (idDomaine) => {
    setEntrepriseForm((prev) => ({
      ...prev,
      domaines: prev.domaines.includes(idDomaine)
        ? prev.domaines.filter((id) => id !== idDomaine)
        : [...prev.domaines, idDomaine],
    }));
  };

  const handleSubmitEntreprise = async (e) => {
    e.preventDefault();
    try {
      if (editingEntreprise) {
        await axios.patch(`${API}/entreprises/${editingEntreprise}`, entrepriseForm, authHeader);
        setFeedback({ type: "success", message: "Entreprise modifiée." });
      } else {
        await axios.post(`${API}/entreprises`, entrepriseForm, authHeader);
        setFeedback({ type: "success", message: "Entreprise ajoutée." });
      }
      setShowEntrepriseForm(false);
      fetchEntreprises();
    } catch (err) {
      setFeedback({ type: "error", message: err.response?.data?.message || "Erreur." });
    }
  };

  const handleDeleteEntreprise = async (id) => {
    if (!confirm("Supprimer cette entreprise ?")) return;
    await axios.delete(`${API}/entreprises/${id}`, authHeader);
    fetchEntreprises();
  };

  const handleAddDomaine = async (e) => {
    e.preventDefault();
    if (!newDomaine.trim()) return;
    try {
      await axios.post(`${API}/domaines`, { nomDomaine: newDomaine }, authHeader);
      setNewDomaine("");
      fetchDomaines();
    } catch (err) {
      setFeedback({ type: "error", message: err.response?.data?.message || "Erreur." });
    }
  };

  const handleDeleteDomaine = async (id) => {
    if (!confirm("Supprimer ce domaine ?")) return;
    await axios.delete(`${API}/domaines/${id}`, authHeader);
    fetchDomaines();
  };

  if (checking) return null;

  // --- ÉCRAN DE CONNEXION ---
  if (!token) {
    return (
      <div className="relative min-h-screen flex items-center justify-center px-4 py-16 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/img11.jpg')" }}
        />
        <div className="absolute inset-0 bg-black/55" />

        <div className="relative z-10 w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-2xl">
          <div className="bg-white py-7 flex items-center justify-center border-b border-zinc-100">
            <img
              src="/logo.png"
              alt="StageLink"
              className="h-9 w-auto object-contain"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "block";
              }}
            />
            <span style={{ fontFamily: "var(--font-display)" }} className="hidden text-lg font-bold text-zinc-900">
              StageLink
            </span>
          </div>

          <div className="p-8 sm:p-10">
            <div className="mb-6">
              <h1 className="text-xl font-bold text-zinc-900">Administration</h1>
              <p className="text-xs text-zinc-400 font-medium mt-1">Accès réservé</p>
            </div>

            {loginError && (
              <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-xs font-semibold text-red-600">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#4F46E5] focus:ring-4 focus:ring-[#4F46E5]/10 transition-all"
                required
              />
              <input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#4F46E5] focus:ring-4 focus:ring-[#4F46E5]/10 transition-all"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-zinc-950 text-white text-sm font-semibold py-3.5 rounded-xl hover:bg-zinc-800 transition disabled:opacity-50"
              >
                {loading ? "Connexion..." : "Se connecter"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // --- VRAI PANNEAU D'ADMINISTRATION ---
  return (
    <div className="min-h-screen bg-zinc-100 flex">
      {/* SIDEBAR */}
      <aside className="w-64 bg-gradient-to-b from-zinc-900 to-zinc-950 text-zinc-300 flex flex-col shrink-0">
        <div className="h-20 flex items-center px-6 border-b border-white/5">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-lg">
            <img
              src="/logo.png"
              alt="StageLink"
              className="h-6 w-auto object-contain"
              onError={(e) => (e.target.style.display = "none")}
            />
          </div>
          <div className="ml-3">
            <p className="text-sm font-bold text-white leading-tight">StageLink</p>
            <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Console admin</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1">
          <p className="px-3 mb-2 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Gestion</p>
          <button
            onClick={() => setActiveTab("entreprises")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === "entreprises"
                ? "bg-gradient-to-r from-[#4F46E5] to-[#6366F1] text-white shadow-lg shadow-indigo-950/50"
                : "text-zinc-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <i className="bi bi-building"></i>
            Entreprises
          </button>
          <button
            onClick={() => setActiveTab("domaines")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === "domaines"
                ? "bg-gradient-to-r from-[#4F46E5] to-[#6366F1] text-white shadow-lg shadow-indigo-950/50"
                : "text-zinc-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <i className="bi bi-tags"></i>
            Domaines
          </button>
        </nav>

        <div className="p-3 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10 transition"
          >
            <i className="bi bi-box-arrow-right"></i>
            Déconnexion
          </button>
        </div>
      </aside>

      {/* CONTENU */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOP BAR */}
        <div className="h-20 bg-white border-b border-zinc-200 flex items-center justify-between px-8 shrink-0">
          <h1 className="text-lg font-bold text-zinc-900">
            {activeTab === "entreprises" ? "Gestion des entreprises" : "Gestion des domaines"}
          </h1>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs font-bold text-zinc-900">Administrateur</p>
              <p className="text-[10px] font-medium text-zinc-400">StageLink</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4F46E5] to-[#8B5CF6] flex items-center justify-center text-white text-sm font-bold shadow-md">
              SA
            </div>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto p-8">
          {feedback && (
            <div
              className={`mb-6 px-4 py-3 rounded-xl text-sm font-semibold ${
                feedback.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
              }`}
            >
              {feedback.message}
            </div>
          )}

          {/* STATS */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white border border-zinc-200 rounded-2xl p-5 flex items-center gap-4 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#4F46E5] to-[#8B5CF6]"></div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4F46E5]/10 to-[#8B5CF6]/10 text-[#4F46E5] flex items-center justify-center">
                <i className="bi bi-building text-lg"></i>
              </div>
              <div>
                <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Entreprises</p>
                <h3 className="text-2xl font-bold text-zinc-900">{entreprises.length}</h3>
              </div>
            </div>
            <div className="bg-white border border-zinc-200 rounded-2xl p-5 flex items-center gap-4 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-400"></div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-400/10 text-emerald-600 flex items-center justify-center">
                <i className="bi bi-tags text-lg"></i>
              </div>
              <div>
                <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Domaines</p>
                <h3 className="text-2xl font-bold text-zinc-900">{domaines.length}</h3>
              </div>
            </div>
          </div>

          {activeTab === "entreprises" && (
            <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="flex justify-between items-center px-6 py-4 border-b border-zinc-100">
                <h2 className="text-sm font-bold text-zinc-900">Liste des entreprises</h2>
                <button
                  onClick={openNewEntrepriseForm}
                  className="text-xs font-bold bg-gradient-to-r from-[#4F46E5] to-[#6366F1] text-white px-4 py-2.5 rounded-xl hover:shadow-lg hover:shadow-indigo-200 transition flex items-center gap-1.5"
                >
                  <i className="bi bi-plus-lg"></i>
                  Ajouter
                </button>
              </div>

              {showEntrepriseForm && (
                <form onSubmit={handleSubmitEntreprise} className="p-6 bg-zinc-50 border-b border-zinc-100 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      placeholder="Nom"
                      value={entrepriseForm.nom}
                      onChange={(e) => setEntrepriseForm({ ...entrepriseForm, nom: e.target.value })}
                      className="px-3 py-2.5 bg-white border border-zinc-200 rounded-lg text-sm text-zinc-900 placeholder:text-zinc-400"
                      required
                    />
                    <input
                      placeholder="Ville"
                      value={entrepriseForm.ville}
                      onChange={(e) => setEntrepriseForm({ ...entrepriseForm, ville: e.target.value })}
                      className="px-3 py-2.5 bg-white border border-zinc-200 rounded-lg text-sm text-zinc-900 placeholder:text-zinc-400"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      placeholder="Téléphone"
                      value={entrepriseForm.telephone}
                      onChange={(e) => setEntrepriseForm({ ...entrepriseForm, telephone: e.target.value })}
                      className="px-3 py-2.5 bg-white border border-zinc-200 rounded-lg text-sm text-zinc-900 placeholder:text-zinc-400"
                    />
                    <input
                      placeholder="Email"
                      value={entrepriseForm.email}
                      onChange={(e) => setEntrepriseForm({ ...entrepriseForm, email: e.target.value })}
                      className="px-3 py-2.5 bg-white border border-zinc-200 rounded-lg text-sm text-zinc-900 placeholder:text-zinc-400"
                    />
                  </div>
                  <input
                    placeholder="Site web"
                    value={entrepriseForm.siteWeb}
                    onChange={(e) => setEntrepriseForm({ ...entrepriseForm, siteWeb: e.target.value })}
                    className="w-full px-3 py-2.5 bg-white border border-zinc-200 rounded-lg text-sm text-zinc-900 placeholder:text-zinc-400"
                  />
                  <div className="flex flex-wrap gap-2 pt-1">
                    {domaines.map((d) => (
                      <button
                        type="button"
                        key={d.idDomaine}
                        onClick={() => toggleDomaineInForm(d.idDomaine)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition ${
                          entrepriseForm.domaines.includes(d.idDomaine)
                            ? "bg-gradient-to-r from-[#4F46E5] to-[#6366F1] text-white border-transparent"
                            : "bg-white text-zinc-600 border-zinc-200"
                        }`}
                      >
                        {d.nomDomaine}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button type="submit" className="bg-zinc-950 text-white text-xs font-bold px-5 py-2.5 rounded-lg">
                      {editingEntreprise ? "Enregistrer les modifications" : "Créer l'entreprise"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowEntrepriseForm(false)}
                      className="text-xs font-bold text-zinc-500 px-4 py-2.5"
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              )}

              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-50 border-b border-zinc-200">
                  <tr>
                    <th className="px-6 py-3 text-xs font-bold text-zinc-500 uppercase tracking-wider">Entreprise</th>
                    <th className="px-6 py-3 text-xs font-bold text-zinc-500 uppercase tracking-wider">Ville</th>
                    <th className="px-6 py-3 text-xs font-bold text-zinc-500 uppercase tracking-wider">Domaines</th>
                    <th className="px-6 py-3 text-xs font-bold text-zinc-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {entreprises.map((e) => (
                    <tr key={e.idEntreprise} className="hover:bg-zinc-50/80 transition">
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#4F46E5]/10 to-[#8B5CF6]/10 text-[#4F46E5] flex items-center justify-center shrink-0">
                            <i className="bi bi-building text-sm"></i>
                          </div>
                          <span className="font-semibold text-zinc-900">{e.nom}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3.5 text-zinc-500">{e.ville || "—"}</td>
                      <td className="px-6 py-3.5">
                        <div className="flex flex-wrap gap-1">
                          {e.domaines?.map((d) => (
                            <span key={d.idDomaine} className="text-[10px] font-bold bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-full">
                              {d.nomDomaine}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-3.5 text-right space-x-3">
                        <button onClick={() => openEditEntrepriseForm(e)} className="text-xs font-bold text-[#4F46E5] hover:underline">
                          Modifier
                        </button>
                        <button onClick={() => handleDeleteEntreprise(e.idEntreprise)} className="text-xs font-bold text-red-600 hover:underline">
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "domaines" && (
            <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-zinc-100">
                <h2 className="text-sm font-bold text-zinc-900">Domaines d'activité</h2>
              </div>
              <form onSubmit={handleAddDomaine} className="flex gap-2 p-6 border-b border-zinc-100 bg-zinc-50">
                <input
                  placeholder="Nouveau domaine (ex : Informatique)"
                  value={newDomaine}
                  onChange={(e) => setNewDomaine(e.target.value)}
                  className="flex-1 px-3 py-2.5 bg-white border border-zinc-200 rounded-lg text-sm text-zinc-900 placeholder:text-zinc-400"
                />
                <button type="submit" className="bg-gradient-to-r from-[#4F46E5] to-[#6366F1] text-white text-xs font-bold px-5 rounded-xl hover:shadow-lg hover:shadow-indigo-200 transition">
                  Ajouter
                </button>
              </form>
              <div className="divide-y divide-zinc-100">
                {domaines.map((d) => (
                  <div key={d.idDomaine} className="flex justify-between items-center px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/10 to-teal-400/10 text-emerald-600 flex items-center justify-center">
                        <i className="bi bi-tag text-xs"></i>
                      </div>
                      <span className="text-sm font-semibold text-zinc-800">{d.nomDomaine}</span>
                    </div>
                    <button onClick={() => handleDeleteDomaine(d.idDomaine)} className="text-xs font-bold text-red-600 hover:underline">
                      Supprimer
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}