<?php

namespace App\Http\Controllers;

use App\Models\Domaine;
use Illuminate\Http\Request;

class DomaineController extends Controller
{
    // GET /api/domaines — public
    public function index()
    {
        return response()->json(Domaine::orderBy('nomDomaine')->get());
    }

    // POST /api/domaines — réservé Admin
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nomDomaine' => 'required|string|max:100|unique:domaine,nomDomaine',
        ]);
        return response()->json(Domaine::create($validated), 201);
    }

    // PATCH /api/domaines/{id} — réservé Admin
    public function update(Request $request, $id)
    {
        $domaine = Domaine::findOrFail($id);
        $validated = $request->validate([
            'nomDomaine' => 'required|string|max:100|unique:domaine,nomDomaine,' . $id . ',idDomaine',
        ]);
        $domaine->update($validated);
        return response()->json($domaine);
    }

    // DELETE /api/domaines/{id} — réservé Admin
    public function destroy($id)
    {
        Domaine::findOrFail($id)->delete();
        return response()->json(['message' => 'Domaine supprimé.']);
    }
}