<?php

namespace App\Http\Controllers;

use App\Models\Entreprise;
use Illuminate\Http\Request;

class EntrepriseController extends Controller
{
    // GET /api/entreprises — public, avec filtres + recherche libre
    public function index(Request $request)
    {
        $query = Entreprise::with('domaines');

        if ($request->filled('ville')) {
            $query->where('ville', $request->input('ville'));
        }

        if ($request->filled('domaine')) {
            $query->whereHas('domaines', function ($q) use ($request) {
                $q->where('nomDomaine', $request->input('domaine'));
            });
        }

        if ($request->filled('recherche')) {
            $mot = $request->input('recherche');
            $query->where(function ($q) use ($mot) {
                $q->where('nom', 'like', "%{$mot}%")
                  ->orWhere('ville', 'like', "%{$mot}%")
                  ->orWhereHas('domaines', function ($sub) use ($mot) {
                      $sub->where('nomDomaine', 'like', "%{$mot}%");
                  });
            });
        }

        return response()->json($query->orderBy('nom')->get());
    }

    // GET /api/entreprises/{id} — public
    public function show($id)
    {
        return response()->json(Entreprise::with('domaines')->findOrFail($id));
    }

    // POST /api/entreprises — réservé Admin
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:150',
            'ville' => 'nullable|string|max:100',
            'telephone' => 'nullable|string|max:30',
            'email' => 'nullable|email|max:150',
            'siteWeb' => 'nullable|string|max:255',
            'domaines' => 'nullable|array',
            'domaines.*' => 'exists:domaine,idDomaine',
        ]);

        $entreprise = Entreprise::create($validated);

        if (! empty($validated['domaines'])) {
            $entreprise->domaines()->attach($validated['domaines']);
        }

        return response()->json($entreprise->load('domaines'), 201);
    }

    // PATCH /api/entreprises/{id} — réservé Admin
    public function update(Request $request, $id)
    {
        $entreprise = Entreprise::findOrFail($id);

        $validated = $request->validate([
            'nom' => 'sometimes|string|max:150',
            'ville' => 'nullable|string|max:100',
            'telephone' => 'nullable|string|max:30',
            'email' => 'nullable|email|max:150',
            'siteWeb' => 'nullable|string|max:255',
            'domaines' => 'nullable|array',
            'domaines.*' => 'exists:domaine,idDomaine',
        ]);

        $entreprise->update($validated);

        if (array_key_exists('domaines', $validated)) {
            $entreprise->domaines()->sync($validated['domaines'] ?? []);
        }

        return response()->json($entreprise->load('domaines'));
    }

    // DELETE /api/entreprises/{id} — réservé Admin
    public function destroy($id)
    {
        Entreprise::findOrFail($id)->delete();
        return response()->json(['message' => 'Entreprise supprimée.']);
    }
}