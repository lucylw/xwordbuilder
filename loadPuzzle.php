<?php

	function connectDB()
	{
		$user="xwwebuser";
		$password="AlEK1Hj5d9y5";
		$database="xwordllwang";
		mysql_connect("mysql.llwang.net",$user,$password);
		@mysql_select_db($database) or die("Unable to select database");
	}
	
	function closeDB() { mysql_close(); }

	$name = $_GET["name"];
	$hash = $_GET["hash"];
	$tablename="crossword_table";
	
	connectDB();
	if ($hash == "") 
	{
		$query = "UPDATE $tablename SET playcount = playcount+1 WHERE name='$name'";
		mysql_query($query) or die(mysql_error());
		$query = "SELECT * FROM $tablename WHERE name='$name'";
	} else {
		$query = "UPDATE $tablename SET playcount = playcount+1 WHERE hashcode='$hash'";
		mysql_query($query) or die(mysql_error());
		$query = "SELECT * FROM $tablename WHERE hashcode='$hash'";
	}
	$result = mysql_query($query) or die(mysql_error());;
	
	if (mysql_num_rows($result)==0) 
	{
		echo "Failed";
	} else {
		$row = mysql_fetch_array($result);
		echo $row["name"]."||".$row["pauthor"]."||".$row["puzzle"]."||".$row["clues"]."||".$row["private"]."||".$row["owner"]."||".$row["hashcode"];
	}
	
	closeDB();
	
?>