<?php

namespace teamcity\example;

class Calculator
{
    public function plus($a, $b)
    {
        return $a + $b;
    }

    public function minus($a, $b)
    {
        return $a - $b;
    }

    public function multiply($a, $b)
    {
        return $a * $b;
    }

    public function divide($a, $b)
    {
        if ($b == 0) {
            return "ERROR";
        }
        return $a / $b;
    }

}