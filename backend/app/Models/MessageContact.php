<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MessageContact extends Model
{
    protected $table = 'message_contact';
    protected $primaryKey = 'idMessage';
    public $timestamps = false;
    protected $fillable = ['nom', 'email', 'message'];
}