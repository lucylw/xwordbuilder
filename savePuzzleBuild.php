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
	
	function saveToDB()
	{	
		
		
		if ($addbool) {
			$result=mysql_query("SELECT * FROM $tablename WHERE name='$name' and pauthor='$pauthor'") or die(mysql_error());
			$num_results = mysql_num_rows($result); 
			if ($num_results > 0) $query="UPDATE $tablename SET puzzle='$puzzle',clues='$clues',complete='$isComp',timestamp='$convertedtime' WHERE name='$name' and pauthor='$pauthor'";
			else $query="INSERT INTO $tablename (name,pauthor,puzzle,clues,showvalue,complete,timestamp) values ('$name', '$pauthor', '$puzzle', '$clues', 1, '$isComp','$convertedtime')"; 
			mysql_query($query) or die(mysql_error());
			echo '<script type="text/javascript">alert("Crossword saved.");</script>';
		} else {
			echo '<script type="text/javascript">alert("Missing information! Crossword not saved.");</script>';
		}
		
	}
	
	function addXword()
	{
		connectDB();
		saveToDB();
		$query = "SELECT * FROM $tablename WHERE name='$pname' and showvalue=1 ORDER BY timestamp DESC";
		$result = mysql_query($query);
		$row = mysql_fetch_array($result);
		closeDB();
	}
	
	$tablename="crossword_table";
	$name = $_GET["name"];
	$author = $_GET["author"];
	$puzzle = $_GET["ptxt"];
	$clues = $_GET["ctxt"];
	$owner = $_GET["owner"];
	$hide = $_GET["hide"];
	$complete = $_GET["iscomp"];
	$convertedtime = gmdate("Y-m-d H:i:s",time());
	$addbool = true;
	
	$puzzle = str_replace("|","/",$puzzle);
	$puzzle = str_replace(",",".",$puzzle);
	
	$clues = str_replace("|","/",$clues);
	$clues = str_replace(",",".",$clues);
	
	if (empty($name) or empty($puzzle) or empty($clues) or empty($owner)) $addbool = false;
	
	if ($addbool) {
		$result=mysql_query("SELECT * FROM $tablename WHERE name='$name' and pauthor='$pauthor' and owner='$owner'") or die(mysql_error());
		$num_results = mysql_num_rows($result); 
		if ($num_results > 0) $query="UPDATE $tablename SET puzzle='$puzzle',clues='$clues',complete='$complete',private='$hide',timestamp='$convertedtime' WHERE name='$name' and pauthor='$pauthor' and owner='$owner'";
		else $query="INSERT INTO $tablename (name,pauthor,puzzle,clues,showvalue,complete,owner,private,timestamp) values ('$name', '$pauthor', '$puzzle', '$clues', 1, '$complete','$owner','$hide','$convertedtime')"; 
		// mysql_query($query) or die(mysql_error());
		echo 'Crossword saved.';
	} else {
		echo 'Missing information! Crossword not saved.';
	}
	
	
?>