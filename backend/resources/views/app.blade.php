<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>{{config('app.name')}}</title>

    <base href="/">

    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" type="image/x-icon" href="app/dist/favicon.ico">
    <link href="https://fonts.googleapis.com/css?family=Nunito:300,400,400i,600,700,800,900" rel="stylesheet">
</head>
<body class="text-left">
<app-root>
    <div class="loadscreen">
        <img src="app/dist/assets/images/logo.png" class="logo mb-3" style="display: none" alt="">
        <div class="loader-bubble loader-bubble-primary d-block"></div>
    </div>
</app-root>

<script src="app/dist/runtime.js" defer></script>
<script src="app/dist/polyfills-es5.js" nomodule defer></script>
<script src="app/dist/polyfills.js" defer></script>
<script src="app/dist/styles.js" defer></script>
<script src="app/dist/scripts.js" defer></script>
<script src="app/dist/vendor.js" defer></script>
<script src="app/dist/main.js" defer></script>
</body>
</html>
