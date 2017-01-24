<?php
// check if user submitted form
if($_SERVER['REQUEST_METHOD'] == 'POST'){
  // connect to database
  include('connection.php');
  // Create an array for errors:
  $errors = array();
  // check for email address
  if(empty($_POST['email'])){
    $errors[] = 'You forgot to enter your email';
  } else {
    $e = mysqli_real_escape_string($dbc, trim($_POST['email']));
  }

  // check current passwordif
  if (empty($_POST['pass'])){
    $errors[] = 'You forgot to enter your password!';
  } else {
    $p = mysqli_escape_string($dbc, trim($_POST['pass']));
  }

  // check for a new password and compare it with confirmed password
  if (!empty($_POST['pass1'])){
    if ($_POSS['pass1'] != $_POST['pass2']){
      $errors[] = 'Your new password does not match the confirmed password!';
    } else {
      $np = mysqli_real_escape_string($dbc, trim($_POST['pass1']));
    }
  } else {
    $errors[] = 'You forgot to enter your new password!';
  }

  // if there is no errors
  if(empty($errors)){
    // check that the user entered the right email/password combination
    $q = "SELECT id FROM users WHERE (email = '$e' AND password='$p')";
    $r = mysqli_query($dbc, $q);
    $num = mysqli_num_rows($r);

    // get user id
    if($num == 1) {
      $row = mysqli_fetch_array($r, MYSQLI_NUM);
      // Make the UPDATE query
      $q = "UPDATE users SET password='$np' WHERE id='$row[0]'";
      $r = mysqli_query($dbc, $q);
      // if everying was ok
      if(mysqli_affected_rows($dbc) == 1){
        //OK
        echo "Thank! You have updated your password!";
      } else {
        echo "Your password could not be changed due to a system error";
      }
      // close connection to db
      mysqli_close($dbc);
    } else {
      echo "The email and password do not match our records!";
    }
  } else {
    echo "Error! The following errors(s) occurred: <br />";
    foreach($errors as $msg){
      echo $msg."<br />";
    }
  }
}
 ?>

 <h1>Change Password</h1>
 <form action="password.php" method="post">
   <p>Email:<input type="input" name="email" size="20" maxlength="50" value="<?php if(isset($_POST['email'])){echo $POST['email'];} ?>" /></p>
   <p>Current Password: <input type="password" name="pass" maxlength="50" value="<?php if(isset($_POST['pass'])){echo $POST['pass'];} ?>"/></p>
   <p>New Password: <input type="password" name="pass1" size="10" maxlength="50" value="<?php if(isset($_POST['pass1'])){echo $POST['pass1'];} ?>"/></p>
   <p>Confirm New Password: <input type="password" name="pass2" size="10" maxlength="50" value="<?php if(isset($_POST['pass2'])){echo $POST['pass2'];} ?>"/></p>
   <p><input type="submit" name="submit" value="Change Password" /></p>
 </form>
