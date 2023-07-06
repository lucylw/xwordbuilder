<?php 
	require_once("models/config.php");
?>

<html lang="en">
<head>
<title>Crossword Builder</title>
<link href="style.css" rel="stylesheet" type="text/css">
<link rel="icon" type="image/png" href="images/logo.png">
</head>

<body>
<div class="wrapper" align="center"> 
	<div class="content"> 
        <div id="top-nav">
        <?php include("layout_inc/top-nav.php"); ?>
        </div>
        <p/>
		<div id="container_small">
			<h1>Crossword Builder</h1>
			</center>
			<div id="bodytext">
			<p>It is my hope that this tool provides a quick and intuitive way to design and build crossword puzzles. They have long been one of my favorite games, and my opinion is that we could all use some more of them available on the internets.</p>
			<p>Version 1.0 of this canvas includes functions for inserting blanks, editing puzzles, editing clues, word suggestions, and playing complete puzzles. I am working on adding the ability to import and export puzzles, better UI features, and a crossword auto-generator. Since this is a WIP, I would appreciate being clued in on my mishaps, as I am sure there are many.</p>
			<p>More documentation to come in the future... Till then, play on!</p>
			<p/>
			<center>
			<p><font size="2"><a href="builder.php">Try it</a></font></p>
			<p><font size="2"><a href="player.php">Play a puzzle</a></font></p>
			<p><font size="2"><a href="register.php">Register</a></font></p>
			<p><font size="2"><a href="mailto:lucylw@uw.edu">Contact me</a></font></p>
			<p>&nbsp;</p>
			<p>&nbsp;</p>
			</div>
			<div><font size="1" color="#BBBBBB" face="courier new">2012-2014 <a href="mailto:lucylw@uw.edu">Lucy Lu Wang</a></div>
			<div><font size="1" color="#BBBBBB" face="courier new"><a href="http://www.llwang.net/">llwang.net</a></div>
		</div>
	</div>
</div>

</body>

</html>