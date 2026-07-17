<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Entreprise extends Model
{
    protected $table = 'entreprise';
    protected $primaryKey = 'idEntreprise';
    public $timestamps = false;
    protected $fillable = ['nom', 'ville', 'telephone', 'email', 'siteWeb'];

    public function domaines()
    {
        return $this->belongsToMany(Domaine::class, 'entreprise_domaine', 'idEntreprise', 'idDomaine');
    }
}