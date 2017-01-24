<?php
  //error_reporting(0);

  include("connection.php");
  // grap values email and password from login form
  $login_email = mysqli_real_escape_string($dbc, trim($_POST['login_email']));
  $login_password = mysqli_real_escape_string($dbc, $_POST['login_password']);

  // create the query and number of rows returned from the query
  $query = mysqli_query($dbc, "SELECT * FROM users WHERE email='".$login_email."'");
  $numrows = mysqli_num_rows($query);
  if($_SERVER['REQUEST_METHOD'] == 'POST'){

    // create condition to check if there is 1 row with email
    if($numrows != 0){
      // grab the email and password from that row returned before
      while ($row = mysqli_fetch_array($query)) {
        $dbemail = $row['email'];
        $dbpass = $row['password'];
        $dbfirstname = $row['first_name'];
      }

      // Create condition to check if email and password are equal to the
      //  return row
      if($login_email == $dbemail){
        if($login_password == $dbpass){
          echo "Welcome ".$dbfirstname."! You'll be redirected to the control panel in 5 seconds...";
          header('Refresh: 3; URL=output.php');
          //include("navbar.php");
        } else {
          echo "your password is incorrect! <a href='index.php'> Go back to login form</a>";
        }
      } else {
        echo "your email is incorrect! <a href='index.php'> Go back to login form</a>";
      }
    } else {
      echo "Invalid credentials. If you are not registered please register <a href='userform.php'>HERE</a>...";
    }
  } else {
    echo "Please Login <a href='index.php'>HERE</a>";
  }
 ?>

 <html>
 <head>
   <title></title>
 </head>
 <body>
   <h3>Please login...</h3>
   <form method="post" action="login.php">
    <p>Email:<input type="text" name="login_email" /></p>
    <p>Password:<input type="password" name="login_password" maxlength="50" /></p>
    <p><input type="submit" value="Login" /></p>
   </form>
   <a href="userform.php">Register Here</a>
 </body>
 </html>
