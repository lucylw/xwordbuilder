<?php
	require_once("models/config.php");
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
<script type="text/javascript" src="drawtools.js"></script>	-->
<script type="text/javascript" src="xwordplay.js"></script>

<script type="text/javascript">
//kills backspace key function in firefox, chrome
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

<body onload="load()">
	
	<div class="wrapper" align="center"> 
		<div class="content"> 
			<div id="top-nav">
				<?php include("layout_inc/top-nav.php"); ?>
			</div>
			<h1>Player Mode</h1>
			<div id="wrapper" display="inline">
			<div id="control2">
				<select id="puzzleToLoad" name="puzzleToLoad" tabindex="1"></select>
				<button onclick="loadPuzzle('')" id="load">Load</button>&nbsp;
				<font size="2"><u><a href="allplay.php">Show all</a></u></font>
				<p/>
				<button onclick="loadRandom()" id="loadRand">Load Random</button>
			</div>
			<p/>
			<div id="container">
				<canvas id="xword" width="640" height="640" tabindex="1">Your browser does not support HTML5 Canvas.</canvas>
				<canvas id="clues" width="420" height="640" tabindex="2"></canvas>
			</div>
			<p/>
			<div id="control"></div>
			<p/>
			<!--
			<div id="info"></div>
			<button id="exportxpf">Export as XPF</button>
			<button id="exporttxt">Export as TXT</button>-->
		</div> 
		<div>&nbsp;</div>
		<div><font size="1" color="#BBBBBB" face="courier new">2012-2014 <a href="mailto:lucylw@uw.edu">Lucy Lu Wang</a></div>
		<div><font size="1" color="#BBBBBB" face="courier new"><a href="http://www.llwang.net/">llwang.net</a></div>
	</div>

</body>

<?php
	$hash = $_GET["puzzle"];
	
	if (!empty($hash) && ctype_alnum($hash)) {
		echo '<script type="text/javascript">setTimeout(function() {loadPuzzle(\''.$hash.'\');},1000);</script>';
	}
?>

</html>