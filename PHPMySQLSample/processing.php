<?php
// processing form

// prevent hacking (from POST by FORM)
if ($_SERVER['REQUEST_METHOD'] == 'POST'){
  $fname = $_POST["fname"];
  $lname = $_POST["lname"];
  $email = $_POST["email"];
  $gender = $_POST["gender"];
  $age = $_POST["age"];
  $comments = $_POST["comments"];
  $password = $_POST["password"];

  if(isset($fname, $lname, $email, $gender, $age, $comments, $password)){
    include('connection.php');
  } else {
    echo "Please fill in all value.";
  }
} else {
  echo "No form has been submitted";
}



?>
