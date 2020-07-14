<?php

require __DIR__ . "/../src/Calculator.php";

use teamcity\example\Calculator;
use PHPUnit\Framework\TestCase;

class CalculatorTest extends TestCase
{
    protected $calculator;

    protected function setUp(): void
    {
        $this->calculator = new Calculator();
    }

    public function testPlus(): void
    {
        $this->assertEquals(2, $this->calculator->plus(1,1));
    }

    public function testMinus(): void
    {
        $this->assertEquals(1, $this->calculator->minus(2,1));
    }

    public function testDivide(): void
    {
        $this->assertEquals(2, $this->calculator->divide(2,1));
    }

    public function testMultiply(): void
    {
        $this->assertEquals(2, $this->calculator->multiply(2,1));
    }

    public function testFail(): void
    {
        $this->assertEquals(2, 1);
    }
}