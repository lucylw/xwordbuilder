<?php
	require_once("models/config.php");
	
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
	$result = mysql_query("SELECT hashcode,name,pauthor,complete,owner,createdt,timestamp FROM $tablename newer 
		WHERE timestamp = (SELECT MAX(timestamp) FROM $tablename WHERE newer.name = name AND showvalue=1 AND complete=0 AND private=0 AND owner='') ORDER BY createdt") or die(mysql_error);
	closeDB();
	
?>

<html lang="en">
<head>
<title>Crossword Builder</title>
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
        	<h2>Edit a Puzzle</h2>
        
			<div id="wrapper">
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
				<th>&nbsp; Author &nbsp;</th>
				<th>&nbsp; Options &nbsp;</th>
				<th>&nbsp; Created &nbsp;</th>
				</tr>
				';
			
				while ($row = mysql_fetch_array($result)) 
				{
					echo '
						<tr>
						<td>&nbsp;'.$row['name'].'&nbsp;</td>
						<td>&nbsp;'.$row['pauthor'].'&nbsp;</td>
						<td>&nbsp;<a href="builder.php?puzzle='.$row['hashcode'].'"><img src="images/edit.png" title="edit puzzle"></img></a><img style="cursor:pointer" onmousedown="sharePuzzle(\''.$row['hashcode'].'\',\''.$row['complete'].'\',\''.$row['name'].'\')" src="images/share.png" title="share puzzle"></img>&nbsp;</td>
						<td>&nbsp;'.$row['createdt'].'&nbsp;</td>
						</tr>';
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

