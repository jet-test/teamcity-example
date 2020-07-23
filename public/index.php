<html>
<head>
    <title>PHP Test</title>
</head>
<body>
<?php
$name = $_GET["name"];
if ($name) { ?>
    <span id="name">Hello <?= $name ?></span>
<?php } else { ?>
    <form id="form">
        what is your <input type="text" name="name" placeholder="name"/>?
        <input type="submit" value="Hello!">
    </form>
    <?php
}
?>
</body>
</html>
