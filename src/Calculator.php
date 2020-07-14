<?php

namespace teamcity\example;

use Exception;

class Calculator
{
    public function plus($a, $b): int
    {
        return $a + $b;
    }

    public function minus($a, $b): int
    {
        return $a - $b;
    }

    public function multiply($a, $b): int
    {
        return $a * $b;
    }

    public function divide($a, $b): int
    {
        if ($b == 0) {
            throw new Exception('Division by zero.');
        }
        return $a / $b;
    }

}