<?php
	require_once("models/config.php");
	//Prevent the user visiting the lost password page if he/she is already logged in
	if(isUserLoggedIn()) { header("Location: account.php"); die(); }
?>
<?php
	
$errors = array();
$success_message = "";
	
//User has confirmed they want their password changed
if(!empty($_GET["confirm"]))
{
	$token = trim($_GET["confirm"]);
	
	if($token == "" || !validateActivationToken($token,TRUE))
	{
		$errors[] = lang("FORGOTPASS_INVALID_TOKEN");
	}
	else
	{
		$rand_pass = getUniqueCode(15);
		$secure_pass = generateHash($rand_pass);
		
		$userdetails = fetchUserDetails(NULL,$token);
		
		$mail = new userCakeMail();		
						
		//Setup our custom hooks
		$hooks = array(
				"searchStrs" => array("#GENERATED-PASS#","#USERNAME#"),
				"subjectStrs" => array($rand_pass,$userdetails["Username"])
		);
					
		if(!$mail->newTemplateMsg("your-lost-password.txt",$hooks))
		{
			$errors[] = lang("MAIL_TEMPLATE_BUILD_ERROR");
		}
		else
		{	
			if(!$mail->sendMail($userdetails["Email"],"Your new password"))
			{
					$errors[] = lang("MAIL_ERROR");
			}
			else
			{
					if(!updatePasswordFromToken($secure_pass,$token))
					{
						$errors[] = lang("SQL_ERROR");
					}
					else
					{	
						//Might be wise if this had a time delay to prevent a flood of requests.
						flagLostPasswordRequest($userdetails["Username_Clean"],0);
						
						$success_message  = lang("FORGOTPASS_NEW_PASS_EMAIL");
					}
			}
		}
			
	}
}

//----------------------------------------------------------------------------------------------
//User has denied this request
//----------------------------------------------------------------------------------------------
if(!empty($_GET["deny"]))
{
	$token = trim($_GET["deny"]);
	
	if($token == "" || !validateActivationToken($token,TRUE))
	{
		$errors[] = lang("FORGOTPASS_INVALID_TOKEN");
	}
	else
	{
	
		$userdetails = fetchUserDetails(NULL,$token);
		
		flagLostPasswordRequest($userdetails['Username_Clean'],0);
		
		$success_message = lang("FORGOTPASS_REQUEST_CANNED");
	}
}

//----------------------------------------------------------------------------------------------
//Forms posted
//----------------------------------------------------------------------------------------------
if(!empty($_POST))
{
		$email = $_POST["email"];
		$username = $_POST["username"];
		
		//Perform some validation
		//Feel free to edit / change as required
		
		if(trim($email) == "")
		{
			$errors[] = lang("ACCOUNT_SPECIFY_EMAIL");
		}
		//Check to ensure email is in the correct format / in the db
		else if(!isValidEmail($email) || !emailExists($email))
		{
			$errors[] = lang("ACCOUNT_INVALID_EMAIL");
		}
		
		if(trim($username) == "")
		{
			$errors[] = lang("ACCOUNT_SPECIFY_USERNAME");
		}
		else if(!usernameExists($username))
		{
			$errors[] = lang("ACCOUNT_INVALID_USERNAME");
		}
		
		
		if(count($errors) == 0)
		{
		
			//Check that the username / email are associated to the same account
			if(!emailUsernameLinked($email,$username))
			{
				$errors[] =  lang("ACCOUNT_USER_OR_EMAIL_INVALID");
			}
			else
			{
				//Check if the user has any outstanding lost password requests
				$userdetails = fetchUserDetails($username);
				
				if($userdetails["LostPasswordRequest"] == 1)
				{
					$errors[] = lang("FORGOTPASS_REQUEST_EXISTS");
				}
				else
				{
					//Email the user asking to confirm this change password request
					//We can use the template builder here
					
					//We use the activation token again for the url key it gets regenerated everytime it's used.
					
					$mail = new userCakeMail();
					
					$confirm_url = lang("CONFIRM")."\n".$websiteUrl."forgot-password.php?confirm=".$userdetails["ActivationToken"];
					$deny_url = ("DENY")."\n".$websiteUrl."forgot-password.php?deny=".$userdetails["ActivationToken"];
					
					//Setup our custom hooks
					$hooks = array(
						"searchStrs" => array("#CONFIRM-URL#","#DENY-URL#","#USERNAME#"),
						"subjectStrs" => array($confirm_url,$deny_url,$userdetails["Username"])
					);
					
					if(!$mail->newTemplateMsg("lost-password-request.txt",$hooks))
					{
						$errors[] = lang("MAIL_TEMPLATE_BUILD_ERROR");
					}
					else
					{
						if(!$mail->sendMail($userdetails["Email"],"Lost password request"))
						{
							$errors[] = lang("MAIL_ERROR");
						}
						else
						{
							//Update the DB to show this account has an outstanding request
							flagLostPasswordRequest($username,1);
							
							$success_message = lang("FORGOTPASS_REQUEST_SUCCESS");
						}
					}
				}
			}
		}
}	
//----------------------------------------------------------------------------------------------	
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
        
        <h2>Forgot Password</h2>
        
		<?php
        if(!empty($_POST) || !empty($_GET))
        {
            if(count($errors) > 0)
            {
		?>
        	<div id="errors">
            	<?php errorBlock($errors); ?>
            </div> 
        <?php
            }
			else
			{
		?>
            <div id="success">
            
                <p><?php echo $success_message; ?></p>
            
            </div>
        <?php
			}
        }
        ?> 
        
        <div id="regbox">
            <form name="newLostPass" action="<?php echo $_SERVER['PHP_SELF'] ?>" method="post">
            
            <p>
                <label>Username:</label>
                <input type="text" name="username" />
            </p>
            
            
            <p>    
                <label>Email:</label>
                <input type="text" name="email" />
            </p>
            
            
            <p>
                <label>&nbsp;</label>
                <input type="submit" value="Request" class="submit" />
            </p>
            
            </form>
        </div>

            <div class="clear"></div>
        </div>
    </div>
</div>
</body>
</html>


