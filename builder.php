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
	
	function generatePassword()
	{
		$length = 8;
		$password = "";
		$possible = "012346789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
		$maxlength = strlen($possible);
	  
		if ($length > $maxlength) {$length = $maxlength;}
	
		$i = 0; 
		
		while ($i < $length) 
		{ 
			// pick a random character from the possible ones
			$char = substr($possible, mt_rand(0, $maxlength-1), 1);
			$password .= $char;
			$i++;
		}
		
		return $password;
	}
	
	function saveToDB()
	{	
		global $tablename,$loginuser,$displaytext;
		// $hash = sha1(generatePassword());
		$name = $_POST["puzzleName"];
		$pauthor = $_POST["puzzleAuthor"];
		$puzzle = $_POST["puzzleTxt"];
		$clues = $_POST["clueTxt"];
		$cluesclean = mysql_real_escape_string($clues);
		$hash = $_POST["hashcode"];
		$isComp = $_POST["isComplete"];
		$isVulg = $_POST["isVulgar"];
		$owner = $_POST["owner"];
		if (!empty($loginuser)) 
		{
			$hide = $_POST["hidePuzzle"];
		} else $hide = 0;
		$convertedtime = gmdate("Y-m-d H:i:s",time());
		$addbool = true;
		
		if ($pauthor == "") $pauthor = "guest";
		
		if (empty($name) or empty($puzzle) or empty($cluesclean) or ($isVulg==1 and $hide==0)) $addbool = false;
		
		if ($owner == "" && $hide == 1) $displaytext = "Guests cannot hide puzzles! Please register! Crossword not saved.";
		else if ($addbool) {
			if ($hash!="")
			{
				$query="UPDATE $tablename SET puzzle='$puzzle',clues='$cluesclean',complete='$isComp',vulgar='$isVulg',private='$hide' WHERE hashcode='$hash'";
				mysql_query($query) or die(mysql_error());
				$displaytext = "Crossword saved.";
			} else {
				$query="SELECT * FROM $tablename WHERE name='$name'";
				$result = mysql_query($query) or die(mysql_error());
				if (mysql_num_rows($result)!=0)
				{
					$displaytext = "Duplicate puzzle name, please change.";
				} else {
					$hash = sha1(generatePassword());
					$query="INSERT INTO $tablename (hashcode,name,pauthor,puzzle,clues,showvalue,complete,vulgar,owner,private,createdt) values ('$hash', '$name', '$pauthor', '$puzzle', '$cluesclean', 1, '$isComp','$isVulg','$owner','$hide','$convertedtime')"; 
					mysql_query($query) or die(mysql_error());
					$displaytext = "Crossword saved.";
				}
			}
		} else {
			if (!($isVulg==1 and $hide==0)) 
			{
				$displaytext = "Missing information! Crossword not saved.";
			} else {
				$displaytext = "Puzzle contains vulgar content, cannot be public!";
			}
		}
		
		echo '<script type="text/javascript">load(); loadFromPHP(\''.$name.'\',\''.$pauthor.'\',\''.$puzzle.'\','.json_encode($clues).',\''.$owner.'\',\''.$hide.'\',\''.$hash.'\'); document.getElementById("display").innerHTML = "'.$displaytext.'";</script>';
		
	}
	
	function addXword()
	{
		connectDB();
		saveToDB();
		closeDB();
	}
	
	$tablename="crossword_table";
	$loginuser = $loggedInUser->display_username;
	$displaytext = "";
	
?>

<html lang="en">
<head>
<title>Crossword Builder</title>
<link href="style.css" rel="stylesheet" type="text/css">
<link rel="icon" 
      type="image/png" 
      href="images/logo.png">
	  
<!--<script type="text/javascript" src="datatypes.js"></script>	
<script type="text/javascript" src="common.js"></script>
<script type="text/javascript" src="drawtools.js"></script> -->	
<script type="text/javascript" src="xwordbuild.js"></script>
	  
<script type="text/javascript">
//kills special keys in firefox, chrome; 
function killSpecialKeys(e) {
	e = e? e : window.event;
	// var t = e.target? e.target : e.srcElement? e.srcElement : null;
	// if (t && t.tagName && (t.type && /(password)|(text)|(file)/.test(t.type.toLowerCase())) || t.tagName.toLowerCase() == "textarea")
		// return true;
	var k = e.keyCode? e.keyCode : e.which? e.which : null;
	var target = e.target || e.srcElement;
	if (((k==8) || (k==9) || (k>=37 && k<=40) || (k==32)) && !/input|textarea/i.test(target.nodeName)) {
		if (e.preventDefault)
			e.preventDefault();
		return false;
	};
	return true;
};

if (typeof document.addEventListener!="undefined")
	document.addEventListener("keydown", killSpecialKeys, false);
else if (typeof document.attachEvent!="undefined")
	document.attachEvent("onkeydown", killSpecialKeys);
else {
	if (document.onkeydown!=null) {
		var oldOnkeydown=document.onkeydown;
		document.onkeydown=function (e) {
			oldOnkeydown(e);
			killSpecialKeys(e);
		};
	} else
		document.onkeydown=killSpecialKeys;
	}

</script>
</head>

<body>

<div class="wrapper" align="center"> 
	<div class="content"> 
		<div id="top-nav">
			<?php include("layout_inc/top-nav.php"); ?>
		</div>
		<h1>Builder Mode</h1>
		<div id="control2">
			<select id="puzzleToLoad" name="puzzleToLoad"></select>
			<button onclick="loadPuzzle('<?php echo $loginuser; ?>','')" id="load">Load</button>&nbsp;
			<font size="2"><u><a href="allbuild.php">Show all</a></u></font>
		</div>
		<div id="display"></div>
		<p/>
		<div id="container">
			<canvas id="xword" width="640" height="640" tabindex="1">Your browser does not support HTML5 Canvas.</canvas>
			<canvas id="clues" width="420" height="640" tabindex="2"></canvas>
		</div>
		<p/>
		<div id="control">
			<input type="hidden" name="wordToSuggest" id="wordToSuggest"/>
			<button onclick="showWords()" id="suggestWord">Suggest Word</button>
			<button onclick="editDim(1)" id="more" title="Increase crossword dimension by 1">Add row/col</button>
			<button onclick="editDim(-1)" id="less" title="Decrease crossword dimension by 1">Subtract row/col</button>
			<button onclick="changeSymSetting()" id="dsymmetry" style="color: red" title="Inserted blanks will be symmetrical"><div>Symmetrical</div></button>
			<button onclick="changeColorSetting()" id="dcolor" style="color: black" title="Insert blanks with mouse"><div>Insert Blanks</div></button>
			<button onclick="clearContent()" id="clearcont" title="Clears all words and clues"><div>Clear All</div></button>
			<button onclick="reset()" id="reset">Reset</button>
		</div>
		<p/>
		<div id="regbox" display="inline">
		<form id="saveform" name="saveform" method="post" action="builder.php">
			<p>
                <label>Puzzle name:</label>
                <input type="text" name="puzzleName" id="puzzleName"/>
            </p>

			<p>
                <label>Puzzle author:</label>
                <input type="text" name="puzzleAuthor" id="puzzleAuthor" value="<?php echo $loginuser; ?>"/>
            </p>
			<?php 
			if (!empty($loginuser)) 
			{
				echo '<p>
	                <label>Keep private:</label>
					<input type="radio" name="hidePuzzle" id="hidePuzzle1" value="1">Yes
					<input type="radio" name="hidePuzzle" id="hidePuzzle2" value="0" checked="checked">No
					</p>';
			} else {
				echo '<p>Log in to hide puzzles.</p>';
			}
			?>
			<input type="hidden" name="puzzleTxt" id="puzzleTxt"/>
			<input type="hidden" name="clueTxt" id="clueTxt"/>
			<input type="hidden" name="hashcode" id="hashcode"/>
			<input type="hidden" name="isComplete" id="isComplete"/>
			<input type="hidden" name="isVulgar" id="isVulgar"/>
			<input type="hidden" name="owner" id="owner" value="<?php echo $loginuser; ?>"/>
			<button onclick="submitForSave('<?php echo $loginuser; ?>')" id="saveButton">Save</button>
		</form>
		</div>
		<p/>
		<!--<button id="exporttxt">Export as TXT</button>-->
	</div> 
	<div>&nbsp;</div>
	<div><font size="1" color="#BBBBBB" face="courier new">2012-2014 <a href="mailto:lucylw@uw.edu">Lucy Lu Wang</a></div>
	<div><font size="1" color="#BBBBBB" face="courier new"><a href="http://www.llwang.net/">llwang.net</a></div>
</div>

<?php 
	if (isset($_POST['puzzleName']) and isset($_POST['puzzleTxt']) and isset($_POST['clueTxt'])) addXword();
	else echo '<script type="text/javascript">load();</script>';
?>
</body>

<?php
	$hash = $_GET["puzzle"];
	
	if (!empty($hash) && ctype_alnum($hash)) {
		echo '<script type="text/javascript">setTimeout(function() {loadPuzzle(\''.$loginuser.'\',\''.$hash.'\');},1000);</script>';
	}
?>

</html>