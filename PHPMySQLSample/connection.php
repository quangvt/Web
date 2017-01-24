<?php
$hostname = "localhost";
$username = "root";
$password1 = "";
$dbname = "myfirstdatabase";
// making the connection to mysql
$dbc = mysqli_connect($hostname, $username, $password1, $dbname)
OR die("could not connect to database, ERROR: ".mysqli_connect_error());
// die prevent hack

// set encoding
mysqli_set_charset($dbc, "utf8");

// echo "you are connected to ".$dbname." Database";

?>
