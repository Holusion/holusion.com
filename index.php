<?php
#index page script that redirects to localized pages /fr/ or /en/

# match any fr or en variants equally because we don't offer specific pages
$locales = array(
  'fr',
  'en'
);

$best_locale = locale_lookup($locales, $_SERVER['HTTP_ACCEPT_LANGUAGE'], false, 'fr');

#don't check if file exists, such an error would be caught by Integration testing
header('Status: 301 Moved Permanently', false, 301);
header('Location: https://'.$_SERVER['HTTP_HOST'].'/'.$best_locale.'/');
header('Vary: Accept-Language');
header('Cache-Control: public, max-age=31536000'); # max-age = 1year
?>
