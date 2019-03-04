<?php
declare(strict_types=1);
use PHPUnit\Framework\TestCase;

require_once(__DIR__."/../_site/contact.php");

function mock_post($arg=[]){
    return array_merge(array(
        'fname' => "foo",
        'lname' => "bar",
        'email' => "foo@bar.org",
        'comments' => "hello world this is a message",
        'g-recaptcha-response' => "something",
    ),$arg);
}

final class ContactTest extends TestCase {
    public function testCanCleanString(){
        $res = clean_string("foo@bar.com\nbcc:hacker@badguy.com");
        $this->assertEquals($res, "foo@bar.com\nhacker@badguy.com");
    }
    public function testCanWriteError(){
        set_strings('en');
        $err = error_invalid('einvemail');
        $this->assertEquals($err, 'The Email Address you entered does not appear to be valid');
        set_strings('fr');
        $err = error_invalid('einvemail');
        $this->assertEquals($err, "L'Adresse mail est invalide");        
    }
    public function testCanAcceptValidPost(){
        $this->assertEquals(check_fields(mock_post()),0);
    }
    public function testRejectsInvalidEmail(){
        $d = mock_post(['email'=>'foo']);
        $res = check_fields($d);
        $this->assertEquals($res,"L'Adresse mail est invalide");
    }
    public function testRejectsMissingEmail(){
        $d = mock_post();
        unset($d["email"]);
        $res = check_fields($d);
        $this->assertEquals($res,"email est vide");
    }
    public function testRejectsMissingMultiple(){
        $d = mock_post();
        unset($d["email"]);
        unset($d["fname"]);
        $res = check_fields($d);
        $this->assertEquals($res,"fname est vide, email est vide");
    }
}
