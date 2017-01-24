<?php /*CRUD - Create, Read, Update and Delete*/
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

  if(!empty($fname) && !empty($lname) && !empty($email) && !empty($gender) &&
    !empty($age) && !empty($comments) && !empty($password)){
    include('connection.php');

    mysqli_query($dbc, "INSERT INTO users(first_name, last_name,
    email, gender, age, comments, password, registration_date)
    VALUES ('$fname','$lname',
    '$email','$gender','$age','$comments','$password',NOW())");

    $registered = mysqli_affected_rows($dbc);

    echo "<h3>You has registered successfully! Please login <a href='index.php'>HERE</a></h3>";

  } else {
    echo "<p style='color:red'>ERROR: you left some values blank.</p>";
  }
} else {
  echo "<h3>Please complete the form</h3>";
}
?>

<form action="userform.php" method="POST">
  <p>First Name: <input type="text" name="fname" size="20" maxlength="50" /></p>
  <p>Last Name: <input type="text" name="lname" size="20" maxlength="50" /></p>
  <p>Email: <input type="text" name="email" size="40" maxlength="50" /></p>
  <p>Gender:
    <input type="radio" name="gender" value="M" /> Male
    <input type="radio" name="gender" value="F" /> Female</p>
  <p>Age:<select name="age">
    <option value="0-29">Under 30</option>
    <option value="30-60">Between 30 and 60</option>
    <option value="60+">Over 60</option>
  </select></p>
  <p>Comments:<textarea name="comments" rows="3" cols="40" maxlength="200"></textarea></p>
  <p>Password: <input type="text" name="password" size="40" maxlength="50" /></p>
  <p><input type="submit" name="submit" value="Submit" /></p>
</form>

<a href='index.php'> Go back to login form</a>
