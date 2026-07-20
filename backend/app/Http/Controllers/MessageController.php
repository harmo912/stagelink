<?php

namespace App\Http\Controllers;

use App\Models\MessageContact;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    // POST /api/messages — public, n'importe qui peut envoyer un message
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:100',
            'email' => 'required|email|max:150',
            'message' => 'required|string|max:2000',
        ]);

        MessageContact::create($validated);

        return response()->json(['message' => 'Message envoyé avec succès.'], 201);
    }

    // GET /api/messages — réservé Admin, pour consulter les messages reçus
    public function index()
    {
        return response()->json(MessageContact::orderByDesc('dateEnvoi')->get());
    }

    // DELETE /api/messages/{id} — réservé Admin
    public function destroy($id)
    {
        MessageContact::findOrFail($id)->delete();
        return response()->json(['message' => 'Message supprimé.']);
    }
}