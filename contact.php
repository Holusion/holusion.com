<?php

if(isset($_POST['email'])) {

  // EDIT THE 2 LINES BELOW AS REQUIRED

  $email_to = "contact@holusion.com";
  $email_subject = "Contact Site Web";

  function died($error) {
    // your error code can go here
    http_response_code(500);
    echo "{\"code\":500,\"message\":\"".$error."\"} ";
    die();
  }

  function bad($error) {
    http_response_code(400);
    echo "{\"code\":400,\"message\":\"".$error."\"}";
    exit(0);
  }

  function forbidden() {
    http_response_code(403);
    echo "{\"code\":403,\"message\":\"forbidden (captcha failed)\"}";
    exit(0);
  }
  // validation expected data exists

  if(!isset($_POST['first_name']) ||
      !isset($_POST['last_name']) ||
      !isset($_POST['email']) ||
      !isset($_POST['telephone']) ||
      !isset($_POST['comments']) ||
      !isset($_POST['g-recaptcha-response'])
  ) {
      died('We are sorry, but there appears to be a problem with the form you submitted.');
  }

  $first_name = $_POST['first_name']; // required
  $last_name = $_POST['last_name']; // required
  $email_from = $_POST['email']; // required
  $telephone = $_POST['telephone']; // not required
  $comments = $_POST['comments']; // required
  //Recaptcha vars
  //One liner to get client IP.
  $ip = isset($_SERVER['HTTP_CLIENT_IP'])?$_SERVER['HTTP_CLIENT_IP']:(isset($_SERVER['HTTP_X_FORWARDE‌​D_FOR'])?$_SERVER['HTTP_X_FORWARDED_FOR']:$_SERVER['REMOTE_ADDR']);
  $captcha = $_POST['g-recaptcha-response'];

  //STRING validation
  $error_message = "";

  $email_exp = '/^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/';
  if(!preg_match($email_exp,$email_from)) {
    $error_message .= 'The Email Address you entered does not appear to be valid.<br />';
  }

  $string_exp = "/^[A-Za-z .'-]+$/";
  if(!preg_match($string_exp,$first_name)) {
    $error_message .= 'The First Name you entered does not appear to be valid.<br />';
  }

  if(!preg_match($string_exp,$last_name)) {
    $error_message .= 'The Last Name you entered does not appear to be valid.<br />';
  }

  if(strlen($comments) < 20) {
    $error_message .= 'Comments must be at least 20 characters long<br />';
  }

  if(strlen($error_message) > 0) {
    bad($error_message);
  }
  // POST to google's recaptcha service to verify validity
  $secretKey = "6LdWrgwUAAAAAC1UrproS846GfExJdz_5qa4HViP";
  $response = file_get_contents( "https://www.google.com/recaptcha/api/siteverify?secret=".$secretKey."&response=".$captcha."&remoteip=".$ip);

  $r = json_decode($response,true);
  if( intval($r["success"]) !== 1 ){
    error_log($response);
    forbidden();
  }
  function clean_string($string) {
    $bad = array("content-type","bcc:","to:","cc:","href");
    return str_replace($bad,"",$string);
  }

  $email_message = "Form details below.\n\n";
  $email_message .= "First Name: ".clean_string($first_name)."\n";
  $email_message .= "Last Name: ".clean_string($last_name)."\n";
  $email_message .= "Email: ".clean_string($email_from)."\n";
  $email_message .= "Telephone: ".clean_string($telephone)."\n";
  $email_message .= "Comments: ".clean_string($comments)."\n";

  // create email headers
  $headers = 'From: '.$email_from."\r\n".

  'Reply-To: '.$email_from."\r\n" .

  'X-Mailer: PHP/' . phpversion();

  @mail($email_to, $email_subject, $email_message, $headers);
  //Success message here
?>
{"code":200,"message":"Thank you for contacting us. We will be in touch with you very soon"}
<?php
  //End of success message
}
?>
