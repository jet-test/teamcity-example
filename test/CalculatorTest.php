<?php

require __DIR__ . "/../src/Calculator.php";

use teamcity\example\Calculator;
use PHPUnit\Framework\TestCase;

class CalculatorTest extends TestCase
{
    protected $calculator;

    public function setUp()
    {
        $this->calculator = new Calculator();
    }

    public function testPlus()
    {
        $this->assertEquals(2, $this->calculator->plus(1,1));
    }

    public function testMinus()
    {
        $this->assertEquals(1, $this->calculator->minus(2,1));
    }

    public function testDivide()
    {
        $this->assertEquals(2, $this->calculator->divide(2,1));
    }

    public function testMultiply()
    {
        $this->assertEquals(2, $this->calculator->multiply(2,1));
    }

    public function testFail()
    {
        $this->assertEquals(2, 1);
    }
}