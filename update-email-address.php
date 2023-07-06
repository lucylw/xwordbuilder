<?php
	include("models/config.php");
	//Prevent the user visiting the logged in page if he/she is not logged in
	if(!isUserLoggedIn()) { header("Location: login.php"); die(); }
?>

<?php

//Forms posted
if(!empty($_POST))
{
		$errors = array();
		$email = $_POST["email"];

		//Perform some validation
		//Feel free to edit / change as required
		
		if(trim($email) == "")
		{
			$errors[] = lang("ACCOUNT_SPECIFY_EMAIL");
		}
		else if(!isValidEmail($email))
		{
			$errors[] = lang("ACCOUNT_INVALID_EMAIL");
		}
		else if($email == $loggedInUser->email)
		{
				$errors[] = lang("NOTHING_TO_UPDATE");
		}
		else if(emailExists($email))
		{
			$errors[] = lang("ACCOUNT_EMAIL_TAKEN");	
		}
		
		//End data validation
		if(count($errors) == 0)
		{
			$loggedInUser->updateEmail($email);
		}
	}
?>
<html lang="en">
<head>
<title>Crossword Builder</title>
<link href="style.css" rel="stylesheet" type="text/css" />
</head>
<body>
<div class="wrapper" align="center"> 
	<div class="content"> 
        <div id="top-nav">
        <?php include("layout_inc/top-nav.php"); ?>
        </div>
        <p/>

		<div id="container">

            <h2>Update your email address</h2>
    
            <?php
			if(!empty($_POST))
			{
				if(count($errors) > 0)
				{
					echo '<div id="errors">';
					errorBlock($errors);
					echo '</div>';     
				} else {  
					echo '<div id="success">';
					echo '<p>'.lang("ACCOUNT_DETAILS_UPDATED").'</p>';
					echo '</div>';
				} 
			}
			?>

            <div id="regbox">
                <form name="changePass" action="<?php echo $_SERVER['PHP_SELF'] ?>" method="post">
            
                <p>
                    <label>Email:</label>
                    <input type="text" name="email" value="<?php echo $loggedInUser->email; ?>" />
                </p>
        
                <p>
                    <label>&nbsp;</label>
                    <input type="submit" value="Update Email" class="submit" />
                </p>
                
                </form>
            </div>
        </div>
	</div>
</div>
</body>
</html>

