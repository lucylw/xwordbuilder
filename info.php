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
</head>

<body>
<div class="wrapper" align="center"> 
	<div class="content"> 
        <div id="top-nav">
        <?php include("layout_inc/top-nav.php"); ?>
        </div>
        <p/>
		<div id="container_medium">
			<h2>Getting Started</h2>
			</center>
			<div id="bodytext_wide">
			<p><center><font size="3"><b>Changing puzzle size</b></font></center></p>
			<p>Use the add and subtract row/col buttons at the bottom of the builder page to change the dimensions of your crossword puzzle. Currently, the puzzle must be a square. Note: changing the dimensions will delete all contents of the puzzle!</p>
			<p><center><font size="3"><b>Inserting blanks</b></font></center></p>
			<p>Click the "Insert Blank" button at the bottom of the builder page to turn on this function. Using the mouse, click anywhere on the puzzle to change squares between black and white. The "Symmetrical" function is automatically on to start, keeping the blanks inserted symmetrical across the diagonal of the puzzle. This is common in most US crossword puzzles, and the function can be turned off by clicking the button at the bottom of the builder page. Once your blanks are inserted, you can edit your puzzle. If you find during editing that you would like to add or remove any blanks, this will not affect the contents of your puzzle.</p>
			<p><center><font size="3"><b>Filling in words</b></font></center></p>
			<p>Words can be entered by hand. For assistance, a "Suggest Word" button is provided at the bottom of the page. Highlight the word in the puzzle with which you would like assistance, and a list of possible words fitting into those spaces with those letters will appear. If no words appear, that combination of letters does not yet exist in my word bank. Currently, a ~100,000 word English dictionary is used. I will add more possible word and clue combinations in the future.</p>
			<p><center><font size="3"><b>Writing clues</b></font></center></p>
			<p>For now, use your wit! I am working on providing clue suggestions based on previously completed word/clue combinations.</p>
			<p><center><font size="3"><b>Other</b></font></center></p>
			<p>Save your crosswords and come back to edit them later. Register in order to keep puzzles private. Build puzzles with others, and share the completed ones to be played.</p>
			<p>This site has been tested in newer versions of Chrome and Firefox. It obviously does not work on browsers that do not support html5 canvas. If it doesn't work for you, I'm sorry, but such is the state of the internet. Nothing personal.</p>
			<center>
			<p><font size="2"><a href="builder.php">Get Started</a></font></p>
			<p><font size="2"><a href="player.php">Play a puzzle</a></font></p>
			<p><font size="2"><a href="mailto:lucylw@uw.edu">Contact me</a></font></p>
			<p>&nbsp;</p>
			<div><center><b>Resources</b></div>
			<font size="2">
			<div><a href="http://en.wikipedia.org/wiki/Crossword">Wikipedia entry on crosswords</a></div>
			<div><a href="http://www.slate.com/articles/technology/technology/2006/07/the_ultimate_crossword_smackdown.html">Article: role of computers in crossword writing</a></div>
			<div><a href="http://www.nytimes.com/pages/crosswords/index.html">NYTimes Crossword Puzzles</a></div>
			<div><a href="http://puzzles.usatoday.com/">USA Today Crossword Puzzles</a></div>
			<p>&nbsp;</p>
			<div><center><b>Thank you</b></div>
			<font size="2">
			<div><a href="http://usercake.com/">Usercake</a></div>
			</font>
			</center>
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