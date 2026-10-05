<?php

/*
 | Services offered by the office. The array key is the slug stored in the
 | database; `prefix` is used to build queue numbers such as "PR-001".
 */
return [
    'services' => [
        'passport-application' => ['label' => 'Passport application', 'prefix' => 'PA'],
        'passport-renewal' => ['label' => 'Passport renewal',     'prefix' => 'PR'],
        'visa-application' => ['label' => 'Visa application',     'prefix' => 'VA'],
        'permit-renewal' => ['label' => 'Permit renewal',       'prefix' => 'WP'],
        'status-inquiry' => ['label' => 'Status inquiry',       'prefix' => 'SI'],
    ],

    /*
     | Used for wait estimates until a service has real history. Once people
     | have been served, the average of the most recent ones is used instead.
     */
    'default_service_minutes' => (int) env('QUEUE_DEFAULT_SERVICE_MINUTES', 5),

    // How many recent completed entries the average service time is based on.
    'average_sample_size' => 20,
];
