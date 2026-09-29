<?php

namespace App\Mail;

use App\Models\QueueEntry;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NowServing extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(public QueueEntry $entry)
    {
    }

    public function envelope(): Envelope
    {
        return new Envelope(subject: "It's your turn - {$this->entry->queue_number}");
    }

    public function content(): Content
    {
        return new Content(view: 'emails.now-serving');
    }
}
