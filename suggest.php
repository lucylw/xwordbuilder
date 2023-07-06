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

	$w = $_GET["word"];
	if ($w!="") {
		$w .= "_";
		$len = strlen($w);
		$query = "SELECT word,rand() FROM dict_table WHERE word LIKE '$w' AND LENGTH(word)=$len ORDER BY rand() LIMIT 10";
		connectDB();
		$result = mysql_query($query);
		closeDB();
		$stext = "SUGGESTIONS\n";
		while ($row = mysql_fetch_array($result)) $stext .= $row["word"];
	}
	
	echo str_replace("\n","<br>",$stext);
	
?>