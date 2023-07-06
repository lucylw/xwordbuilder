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
	
	$plist = "";
	$tablename = "crossword_table";
	$user = $loggedInUser->display_username;
	
	connectDB();
	// $result = mysql_query("SELECT uid,name,owner,timestamp FROM $tablename WHERE showvalue=1 GROUP BY name ORDER BY timestamp LIMIT 15") or die(mysql_error);
	$result = mysql_query("SELECT uid,name,owner,timestamp FROM $tablename newer WHERE timestamp = 
		(SELECT MAX(timestamp) FROM $tablename WHERE newer.name = name AND showvalue=1) ORDER BY timestamp LIMIT 15") or die(mysql_error);
	closeDB();
	while ($row = mysql_fetch_array($result)) 
	{
		if ($row['owner']==$user || $row['owner']=="") 
		{
			$plist .= $row['name']."//";
		}
	}

	echo $plist;

?>