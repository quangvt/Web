<?php
  // Page title
  echo "<h3>Control Panel</h3>";

  include('navbar.php');

  include("connection.php");

  // Number of records to be displayed per Page
  $display = 3;

  // Determine how many pages there are
  if (isset($_GET['p']) && is_numeric($_GET['p'])){
    // Already been determined
    $pages = $_GET['p'];

  } else {
    // Needs to be determined


    // Count the number of records
    $q = "SELECT COUNT(id) FROM users";
    $r = mysqli_query($dbc, $q);
    $row = mysqli_fetch_array($r, MYSQLI_NUM);
    $records = $row[0];

    // Calculate the number of pages
    if ($records > $display) {
      // More than one page:
      $pages = ceil($records/$display);
    } else {
      $pages = 1;
    }
  }

  // Determine where in the database to start returning results:
  if (isset($_GET['s']) && is_numeric($_GET['s'])){
    $start = $_GET['s'];
  } else {
    $start = 0;
  }

  // Define query
  //$q = "SELECT last_name, first_name, email,
  //    DATE_FORMAT(registration_date, '%M %d, %Y') AS dr,
  //    id FROM users ORDER BY registration_date ASC";
  $q = "SELECT last_name, first_name, email,
      DATE_FORMAT(registration_date, '%M %d, %Y') AS dr,
      id FROM users ORDER BY registration_date ASC LIMIT $start, $display";

  //$r = mysqli_query($dbc, "SELECT * FROM users");
  $r = mysqli_query($dbc, $q);

  // count the number of returned rows
  $num = mysqli_num_rows($r);

  //If any rows returned, display records:
  if($num > 0){
    echo "<a href='orderbyname.php'>Order by name</a>";

    // Inform how mnay users are registered.
    echo "<p>There are $num registered users.</p>";

    echo "<table align='center' border='1' cellspacing='3' cellpadding='3' width='75%'>
    <tr>
      <td align='left'><b>Edit</b></td>
      <td align='left'><b>Delete</b></td>
      <td align='left'><b>Name</b></td>
      <td align='left'><b>Email</b></td>
      <td align='left'><b>Registration</b></td>
    </tr>";

    while($row = mysqli_fetch_array($r)){
      echo "
      <tr>
      <td align='left'><a href='edit_user.php?user_id=".$row['id']."&fname=".
        $row['first_name']."&lname=".$row['last_name']."&lemail=".$row['email']."'>Edit</a></td>

      <td align='left'><a href='delete.php?user_id=".$row['id']."&fname=".
        $row['first_name']."&lname=".$row['last_name']."'>Delete</a></td>
      <td align='left'>".$row['first_name'].", ".$row['last_name']."</td>
      <td align='left'>".$row['email']."</td>
      <td align='left'>".$row['dr']."</td>
      </tr>";
    };

    echo "</table>";
  } else {
    echo "<p>There are currently no registered users!</p>";
  }

  mysqli_close($dbc);


  // Make the links to other pages:
  echo "<center>";
  if ($pages > 1){
    echo '<br /><p>';
    // Determine what page the script is :
    $current_page = ($start/$display) + 1;

    //If not the first page create previous link:
    if($current_page != 1) {
      echo '<a href="output.php?s='.($start - $display).'&p='.$pages.'"> Previous </a>';
    }

    // Make all the numbered pages:
    for ($i = 1; $i <= $pages; $i++){
      if($i != $current_page) {
        echo '<a href="output.php?s='.($display * ($i - 1)).'&p='.$pages.'" style="text-decoration:none"> '.$i.' </a>';
      } else {
        echo $i . '';
      }
    }

    // If it's not the last page, make a next button:
    if($current_page != $pages) {
      echo '<a href="output.php?s='.($start + $display).'&p='.$pages.'"> Next </a>';
    }
    echo '</p>';
  }
  echo "</center>";
 ?>
