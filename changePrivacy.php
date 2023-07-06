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
	
	$id = $_GET["id"];
	$tablename = "crossword_table";
	
	connectDB();
	$result = mysql_query("SELECT private FROM $tablename WHERE uid='$id'") or die(mysql_error());
	$row = mysql_fetch_array($result);
	$privacy = $row['private'];
	if ($privacy==1) $privacy=0;
	else $privacy=1;
	$query = "UPDATE $tablename SET private='$privacy' WHERE uid='$id'";
	mysql_query($query) or die(mysql_error());
	closeDB();

?>