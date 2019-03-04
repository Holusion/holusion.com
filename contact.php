---
layout:
sitemap: false
---
<?php

$email_to = '{{site.contact_mail | default: "contact@holusion.com"}}';
$email_subject = "Contact Site Web";
$secretKey = "{{site.recaptcha_secret}}";

function set_strings($post_data){
  global $strings;
  $locale_strings = [
    "fr" => [
      "success" => "Merci de nous avoir contacté, votre demande sera traitée au plus vite",
      "err" => "Erreur",
      "empty" => "est vide",
      "einvemail"    => "L'Adresse mail est invalide",
      "einvfname"   => 'Le prénom contient des caractères interdits',
      "einvlname"   => 'Le nom contient des caractères interdits',
      "einvcomments" => 'Les commentaires doivent faire au moins 20 caractères',
    ],
    "en" => [
      "success" => "Thank you for contacting us. We will be in touch with you very soon",
      "err" => "Error",
      "empty"      => "is empty",
      "einvemail"    => 'The Email Address you entered does not appear to be valid',
      "einvfname"   => 'The First Name you entered does not appear to be valid',
      "einvlname"   => 'The Last Name you entered does not appear to be valid',
      "einvcomments" => 'Comments must be at least 20 characters long',
    ],
  ];
  if ( ( is_string($post_data) && $post_data == 'fr') || (is_array($post_data) && $post_data["lang"] == "fr")){
    $strings = $locale_strings["fr"];
  }else{
    $strings = $locale_strings["en"];
  }
}
//default
set_strings('fr');

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
  global $strings;
  if(isset($strings[$field])){
    return $strings[$field];
  }else{
    return $field;
  }
  
}

// validation : expected data exists
// return 0 on success, an error string on failure
function check_fields($data){
  global $strings;
  $missing_fields = array();
  $fields = array(
    ['fname', "/^.+$/"],
    ['lname', "/^.+$/"],
    ['email', '/^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/'],
    ['comments', "/.{20}/"],
    ['g-recaptcha-response'],
  );

  foreach($fields as $d){
    if (!isset($data[$d[0]])){
      array_push($missing_fields, $d[0].' '.$strings['empty']);
    }elseif(isset($d[1]) && !preg_match($d[1], $data[$d[0]])){
      $str = error_invalid("einv".$d[0]);
      array_push($missing_fields, $str);
    }
  }

  if(1 == count($missing_fields)){
    return $missing_fields[0];
  }else if (1 < count($missing_fields)){
    return join(", ", $missing_fields);
  }else{
    return 0;
  }
}


function check_recaptcha($secretKey, $captcha){
  //One liner to get client IP.
  $ip = isset($_SERVER['HTTP_CLIENT_IP'])?$_SERVER['HTTP_CLIENT_IP']:(isset($_SERVER['HTTP_X_FORWARDE‌​D_FOR'])?$_SERVER['HTTP_X_FORWARDED_FOR']:$_SERVER['REMOTE_ADDR']);
  // POST to google's recaptcha service to verify validity
  $response = file_get_contents( "https://www.google.com/recaptcha/api/siteverify?secret=".$secretKey."&response=".$captcha."&remoteip=".$ip);
  $r = json_decode($response,true);
  if( intval($r["success"]) !== 1 ){
    return preg_replace( "/\r|\n/", "",$response);
  }else{
    return 0;
  }
}

function clean_string($string) {
  $bad = array("content-type","bcc:","to:","cc:","href");
  return str_replace($bad,"",$string);
}

function write_mail($data){
  // required
  $first_name = $data['fname'];
  $last_name = $data['lname'];
  $email_from = $data['email'];
  $comments = $data['comments'];
  $captcha = $data['g-recaptcha-response'];
  // not required
  $source = $data['source'];
  $telephone = $data['phone'];


  $email_message = "Form details below.\n\n";
  $email_message .= "Source: ".clean_string($source)."\n";
  $email_message .= "First Name: ".clean_string($first_name)."\n";
  $email_message .= "Last Name: ".clean_string($last_name)."\n";
  $email_message .= "Email: ".clean_string($email_from)."\n";
  $email_message .= "Telephone: ".clean_string($telephone)."\n";
  $email_message .= "Comments: ".clean_string($comments)."\n";
  return $email_message;
}

function write_headers($data){
  $email_from = $data['email'];

  // create email headers
  $headers = 'From: '.$email_from."\r\n".
  'Reply-To: '.$email_from."\r\n" .
  'X-Mailer: PHP/' . phpversion();
  return $headers;
}


///////////////////////////////
// Send MAIL if in CGI mode
if (__FILE__ == $_SERVER['SCRIPT_FILENAME']) {
  $err = check_fields($_POST);
  if($err){
    bad($err);
  }

  $err = check_recaptcha($secretKey, $_POST['g-recaptcha-response']);
  if($err){
    forbidden($err);
  }
  if($_POST['email'] == "contact@holusion.com"){
    echo('{"code":200,"message":'.json_encode(write_mail($_POST)).', "headers":'.json_encode(write_headers($_POST)).'}');
  }else{
    @mail($email_to, $email_subject, write_mail($_POST), write_headers($_POST));
    echo('{"code":200,"message":"'.$strings["success"].'"}');
  }
}

?>
