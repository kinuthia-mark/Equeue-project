<?php

/*
 | Services offered by the office. The array key is the slug stored in the
 | database; `prefix` is used to build queue numbers such as "P-001".
 */
return [
    'services' => [
        'passport-application' => ['label' => 'Passport application', 'prefix' => 'PA'],
        'passport-renewal'     => ['label' => 'Passport renewal',     'prefix' => 'PR'],
        'visa-application'     => ['label' => 'Visa application',     'prefix' => 'VA'],
        'permit-renewal'       => ['label' => 'Permit renewal',       'prefix' => 'WP'],
        'status-inquiry'       => ['label' => 'Status inquiry',       'prefix' => 'SI'],
    ],
];
