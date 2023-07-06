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
	$result = mysql_query("SELECT hashcode FROM $tablename WHERE uid='$id'") or die(mysql_error());
	$row = mysql_fetch_array($result);
	$hash = $row['hashcode'];
	closeDB();
	
	echo $hash;

?>