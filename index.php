<?php
#index page script that redirects to localized pages /fr/ or /en/

# match any fr or en variants equally because we don't offer specific pages
$locales = array(
  'fr',
  'en'
);

function get_best_locale($http_accept_language, $cookie){
  global $locales; 
  if (isset($cookie) && in_array($cookie, $locales) ){
    return $cookie;
  }
  // The following is a reimplementation of http_negociate_language from PHP_pecl_http
  // http://ir2.php.net/manual/fr/function.http-negotiate-language.php
  preg_match_all("/([[:alpha:]]{1,8})(-([[:alpha:]|-]{1,8}))?" . 
  "(\s*;\s*q\s*=\s*(1\.0{0,3}|0\.\d{0,3}))?\s*(,|$)/i", 
  $http_accept_language, $hits, PREG_SET_ORDER); 
  $bestlang = 'fr';
  $bestqval = 0;
  foreach ($hits as $arr) { 
    // read data from the array of this hit 
    $langprefix = strtolower ($arr[1]); 
    if (!empty($arr[3])) { 
        $langrange = strtolower ($arr[3]); 
        $language = $langprefix . "-" . $langrange; 
    } 
    else $language = $langprefix; 
    $qvalue = 1.0; 
    if (!empty($arr[5])) $qvalue = floatval($arr[5]); 

    // find q-maximal language  
    if (in_array($language, $locales) && ($qvalue > $bestqval)) { 
        $bestlang = $language; 
        $bestqval = $qvalue; 
    } 
    // if no direct hit, try the prefix only but decrease q-value by 10% (as http_negotiate_language does) 
    else if (in_array($langprefix,$locales) && (($qvalue*0.9) > $bestqval)) { 
        $bestlang = $langprefix; 
        $bestqval = $qvalue*0.9; 
    } 
  }
  return $bestlang; 
}


///////////////////////////////
// Answer request in CGI mode
if (__FILE__ == $_SERVER['SCRIPT_FILENAME']) {
  $best_locale = get_best_locale($_SERVER['HTTP_ACCEPT_LANGUAGE'], $_COOKIE['lang']);

  #don't check if file exists, it should.
  header('Status: 301 Moved Permanently', false, 301);
  header('Location: https://'.$_SERVER['HTTP_HOST'].'/'.$best_locale.'/');
  header('Vary: Accept-Language, Cookie');
  header('Cache-Control: public, max-age=31536000'); # max-age = 1year
}
?>
