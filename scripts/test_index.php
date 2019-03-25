<?php
declare(strict_types=1);
use PHPUnit\Framework\TestCase;

require_once(__DIR__."/../_site/index.php");

final class IndexTest extends TestCase {
    public function testCanDefaulToFr(){
        $this->assertEquals(get_best_locale('zh-CN,zh;q=0.9,nl-nl;q=0.8,nl;q=0.7', NULL), 'fr');
    }
    public function testCanCheckAcceptLanguageHeader(){
        $this->assertEquals(get_best_locale('fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7', NULL), 'fr');
        $this->assertEquals(get_best_locale('zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7', NULL), 'en');
        $this->assertEquals(get_best_locale('en-US,en;q=0.9,fr-FR;q=0.8,fr;q=0.7', NULL), 'en');
    }
    public function testCanUseCookie(){
        $this->assertEquals(get_best_locale('en-US,en;q=0.9,fr-FR;q=0.8,fr;q=0.7', 'fr'), 'fr');
        $this->assertEquals(get_best_locale('fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7', 'en'), 'en');
        $this->assertEquals(get_best_locale('en-US,en;q=0.9,fr-FR;q=0.8,fr;q=0.7', 'zh'), 'en');
        $this->assertEquals(get_best_locale('en-US,en;q=0.9,fr-FR;q=0.8,fr;q=0.7', 'undefined'), 'en');
    }
}
