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
	$query = "SELECT name,owner FROM $tablename WHERE uid='$id'";
	$result = mysql_query($query) or die(mysql_error());
	$row = mysql_fetch_array($result);
	$name = $row['name'];
	$owner = $row['owner'];
	$query = "UPDATE $tablename SET showvalue=0 WHERE name='$name' AND owner='$owner'";
	mysql_query($query) or die(mysql_error());
	closeDB();
	
	echo 'Puzzle deleted.';

?>