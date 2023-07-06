<?php
	require_once("models/config.php");
	
	//Prevent the user visiting the logged in page if he/she is already logged in
	if(isUserLoggedIn()) { header("Location: account.php"); die(); }
?>
<?php
	$errors = array();

	//Get token param
	if(isset($_GET["token"]))
	{
		$token = $_GET["token"];
		if(!isset($token))
		{
			$errors[] = lang("FORGOTPASS_INVALID_TOKEN");
		}
		else if(!validateActivationToken($token)) //Check for a valid token. Must exist and active must be = 0
		{
			$errors[] = "Token does not exist / Account is already activated";
		}
		else
		{
			//Activate the users account
			if(!setUserActive($token))
			{
				$errors[] = lang("SQL_ERROR");
			}
		}
	}
	else
	{
		$errors[] = lang("FORGOTPASS_INVALID_TOKEN");
	}
?>

<html lang="en">
<head>
<title>Crossword Builder</title>
<link href="style.css" rel="stylesheet" type="text/css" />
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
		
		<div id="container_small">
		<h2>Account activation</h2>

			<?php
				if(count($errors) > 0)
				{
            ?>
            <div id="errors">
            <?php errorBlock($errors); ?>
            </div>     
            <?php
           		 } else { ?> 
        <div id="success">
        
           <p><?php echo lang("ACCOUNT_NOW_ACTIVE"); ?></p>
           
        </div>
        <?php }?>

		</div>
	</div>
</div>
</body>
</html>

