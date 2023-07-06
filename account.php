<?php
	require_once("models/config.php");
	//Prevent the user visiting the logged in page if he/she is not logged in
	if(!isUserLoggedIn()) { header("Location: login.php"); die(); }
	
	function connectDB()
	{
		$user="xwwebuser";
		$password="AlEK1Hj5d9y5";
		$database="xwordllwang";
		mysql_connect("mysql.llwang.net",$user,$password);
		@mysql_select_db($database) or die("Unable to select database");
	}
	
	function closeDB() { mysql_close(); }
	
	$tablename = "crossword_table";
	$user = $loggedInUser->display_username;
	
	connectDB();
	// $result = mysql_query("SELECT uid,hashcode,name,complete,private,owner,MAX('timestamp') FROM $tablename WHERE showvalue=1 GROUP BY name ORDER BY timestamp LIMIT 30");
	$result = mysql_query("SELECT uid,hashcode,name,complete,vulgar,private,owner,timestamp FROM $tablename newer 
		WHERE timestamp = (SELECT MAX(timestamp) FROM $tablename WHERE newer.name = name AND showvalue=1) 
		ORDER BY name") or die(mysql_error);
	closeDB();
	
?>

<html lang="en">
<head>
<title>Crossword Builder: user <?php echo $loggedInUser->display_username; ?></title>
<link href="style.css" rel="stylesheet" type="text/css" />
<link rel="icon" 
      type="image/png" 
      href="images/logo.png">
<script type="text/javascript" src="accountfunctions.js"></script>
</head>
<body>
<div class="wrapper" align="center"> 
	<div class="content"> 
    
        <div id="top-nav">
        <?php include("layout_inc/top-nav.php"); ?>
        </div>
        
        <div id="container_medium">
        	<h2>Your Account</h2>
        
			<div id="wrapper">
        	<p>Welcome to your account page <strong><?php echo $loggedInUser->display_username; ?></strong></p>
          
            <p>You have been a member since <?php echo date("M jS Y",$loggedInUser->signupTimeStamp()); ?> </p>
			
			<p><b>Account Management</b></p>
			<div><a href="change-password.php">Change password</a></div>
            <div><a href="update-email-address.php">Update email address</a></div>
			
			<p/>
			
			<p><b>Crossword Builder History</b></p>
				
			<div id="sharelinks"></div>
			<p>&nbsp;</p>
			
			<?php
			
			$ynarray = array(
				0 => "No",
				1 => "Yes",
			);
			
			if (!empty($result)) 
			{
				echo '
				<table border="1">
				<font size="2">
				<tr>
				<th>&nbsp; Puzzle &nbsp;</th>
				<th>&nbsp; Complete &nbsp;</th>
				<th>&nbsp; Private &nbsp;</th>
				<th>&nbsp; Options &nbsp;</th>
				</tr>
				';
			
				while ($row = mysql_fetch_array($result)) 
				{
					if ($row['owner']==$user) 
					{
					echo '
						<tr>
						<td>&nbsp;'.$row['name'].'&nbsp;</td>
						<td>&nbsp;'.$ynarray[$row['complete']].'&nbsp;</td>
						<td>&nbsp;'.$ynarray[$row['private']];
						if ($row['vulgar']=='0')
						{
							echo '<img src="images/placeholder.png"></img><img style="cursor:pointer" onmousedown="changePrivacy('.$row['uid'].')" src="images/change.png" title="change privacy">&nbsp;</td>';
						}
						echo '<td>&nbsp;<a href="builder.php?puzzle='.$row['hashcode'].'"><img src="images/edit.png" title="edit puzzle"></img></a>';
						if ($row['complete']=='1')
						{
							echo '<a href="player.php?puzzle='.$row['hashcode'].'"><img src="images/play.png" title="play puzzle"></img></a>';
						} else {
							echo '<img src="images/placeholder.png"></img>';
						}
						echo '<img style="cursor:pointer" onmousedown="sharePuzzle(\''.$row['hashcode'].'\',\''.$row['complete'].'\',\''.$row['name'].'\')" src="images/share.png" title="share puzzle"></img><img style="cursor:pointer" onmousedown="deletePuzzle('.$row['uid'].')" src="images/delete.png" title="delete puzzle"></img>&nbsp;</td>
						</tr>';
					}
				}
				
				echo '</table></font>';
			}
			
			?>
		
			</div>
  		</div>
  
	</div>
	<div>&nbsp;</div>
	<div><font size="1" color="#BBBBBB" face="courier new">2012-2014 <a href="mailto:lucylw@uw.edu">Lucy Lu Wang</a></div>
	<div><font size="1" color="#BBBBBB" face="courier new"><a href="http://www.llwang.net/">llwang.net</a></div>
</div>
</body>
</html>

