<html>
<head>
    <title>PHP Test</title>
</head>
<body>
<?php
$name = $_GET["name"];
if ($name) { ?>
    Hello <?= $name ?>
<?php } else { ?>
    <form>
        what is your <input type="text" name="name" placeholder="name"/>?
        <input type="submit" value="Hello!">
    </form>
    <h1>Who let the button clicks 2?</h1>
    <?php
}
?>
</body>
</html>
