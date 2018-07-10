---
layout:
sitemap: false
---
<?php

$email_to = '{{site.contact_mail | default: "contact@holusion.com"}}';
$email_subject = "Contact Site Web";
$secretKey = "{{site.recaptcha_secret}}";

$locale_strings = [
  "fr" => [
    "err" => "Erreur",
    "empty1" => "est vide",
    "empty2" => "sont vides",
    "einvmail"    => 'Adresse mail est invalide',
    "einvfname"   => 'Le prénom contient des caractères interdits',
    "einvlname"   => 'Le nom contient des caractères interdits',
    "einvcomment" => 'Les commentaires doivent faire au moins 20 caractères',
  ],
  "en" => [
    "err" => "Error",
    "empty1"      => "is empty",
    "empty2"      => "are empty",
    "einvmail"    => 'The Email Address you entered does not appear to be valid',
    "einvfname"   => 'The First Name you entered does not appear to be valid',
    "einvlname"   => 'The Last Name you entered does not appear to be valid',
    "einvcomment" => 'Comments must be at least 20 characters long',
  ],
];
$strings = NULL;
if ( !isset($_POST["lang"]) || $_POST["lang"] == "fr"){
  $strings = $locale_strings["fr"];
}else{
  $strings = $locale_strings["en"];
}
function died($error) {
  // your error code can go here
  error_log("Internal error : ".$error);
  http_response_code(500);
  echo "{\"code\":500,\"message\":\"".$error."\"} ";
  die();
}

function bad($error) {
  error_log("Bad request : ".$error);
  http_response_code(400);
  echo "{\"code\":400,\"message\":\"".$error."\"}";
  exit(0);
}

function forbidden($error) {
  error_log("ReCAPTCHA error : ".$error);
  http_response_code(403);
  echo "{\"code\":403,\"message\":\"forbidden (captcha failed)\"}";
  exit(0);
}

function error_invalid($field){
  return $strings[$field].".<br/>";
}

// validation : expected data exists
$fields = array(
  'fname',
  'lname',
  'email',
  'comments',
);
$missing_fields = array();

foreach($fields as $field){
  if (!isset($_POST[$field])){
    array_push($missing_fields, $field);
  }
}
if(1 == count($missing_fields)){
  bad($missing_fields[0].' '.$strings["empty1"]);
}else if (1 < count($missing_fields)){
  bad(join(", ", $missing_fields).' '.$strings["empty2"]);
}

//Check if recaptcha is set
if (!isset($_POST['g-recaptcha-response'])){
  bad('ReCaptcha '.$strings["empty1"]);
}

$first_name = $_POST['fname']; // required
$last_name = $_POST['lname']; // required
$email_from = $_POST['email']; // required
$telephone = $_POST['phone']; // not required
$comments = $_POST['comments']; // required
$source = $_POST['source'];
//Recaptcha vars
//One liner to get client IP.
$ip = isset($_SERVER['HTTP_CLIENT_IP'])?$_SERVER['HTTP_CLIENT_IP']:(isset($_SERVER['HTTP_X_FORWARDE‌​D_FOR'])?$_SERVER['HTTP_X_FORWARDED_FOR']:$_SERVER['REMOTE_ADDR']);

$captcha = $_POST['g-recaptcha-response'];

//STRING validation
$error_message = "";


$email_exp = '/^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/';
if(!preg_match($email_exp,$email_from)) {
  $error_message .= error_invalid("einvmail");
}

$string_exp = "/^[A-Za-z .'-]+$/";
if(!preg_match($string_exp,$first_name)) {
  $error_message .= error_invalid("einvfname");
}

if(!preg_match($string_exp,$last_name)) {
  $error_message .= error_invalid("einvlname");
}

if(strlen($comments) < 20) {
  $error_message .= error_invalid("einvcomment");
}

if(strlen($error_message) > 0) {
  bad($error_message);
}
// POST to google's recaptcha service to verify validity
$response = file_get_contents( "https://www.google.com/recaptcha/api/siteverify?secret=".$secretKey."&response=".$captcha."&remoteip=".$ip);

$r = json_decode($response,true);
if( intval($r["success"]) !== 1 ){
  forbidden(preg_replace( "/\r|\n/", "",$response));
}
function clean_string($string) {
  $bad = array("content-type","bcc:","to:","cc:","href");
  return str_replace($bad,"",$string);
}

$email_message = "Form details below.\n\n";
$email_message .= "Source: ".clean_string($source)."\n";
$email_message .= "First Name: ".clean_string($first_name)."\n";
$email_message .= "Last Name: ".clean_string($last_name)."\n";
$email_message .= "Email: ".clean_string($email_from)."\n";
$email_message .= "Telephone: ".clean_string($telephone)."\n";
$email_message .= "Comments: ".clean_string($comments)."\n";

// create email headers
$headers = 'From: '.$email_from."\r\n".
'Reply-To: '.$email_from."\r\n" .
'X-Mailer: PHP/' . phpversion();
///////////////////////////////
// Send MAIL
//Special case for testing : if sender is contact@holusion.com, just output the mail as a response
if ($email_from == "contact@holusion.com"){
  echo('{"code":200,"message":'.json_encode($email_message).'}');
}else{
  @mail($email_to, $email_subject, $email_message, $headers);
  echo('{"code":200,"message":"Thank you for contacting us. We will be in touch with you very soon"}');
}

?>
