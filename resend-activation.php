<?php
	require_once("models/config.php");
	//Prevent the user visiting the lost password page if he/she is already logged in
	if(isUserLoggedIn()) { header("Location: account.php"); die(); }
?>
<?php
	
$errors = array();
$success_message = "";

//Forms posted
//----------------------------------------------------------------------------------------------
if(!empty($_POST) && $emailActivation)
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
			$errors[] =  lang("ACCOUNT_SPECIFY_USERNAME");
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
				$errors[] = lang("ACCOUNT_USER_OR_EMAIL_INVALID");
			}
			else
			{
				$userdetails = fetchUserDetails($username);
			
				//See if the user's account is activation
				if($userdetails["Active"]==1)
				{
					$errors[] = lang("ACCOUNT_ALREADY_ACTIVE");
				}
				else
				{
					$hours_diff = round((time()-$userdetails["LastActivationRequest"]) / (3600*$resend_activation_threshold),0);

					if($resend_activation_threshold!=0 && $hours_diff <= $resend_activation_threshold)
					{
						$errors[] = lang("ACCOUNT_LINK_ALREADY_SENT",array($resend_activation_threshold));
					}
					else
					{
						//For security create a new activation url;
						$new_activation_token = generateActivationToken();
						
						if(!updateLastActivationRequest($new_activation_token,$username,$email))
						{
							$errors[] = lang("SQL_ERROR");
						}
						else
						{
							$mail = new userCakeMail();
							
							$activation_url = $websiteUrl."activate-account.php?token=".$new_activation_token;
						
							//Setup our custom hooks
							$hooks = array(
								"searchStrs" => array("#ACTIVATION-URL","#USERNAME#"),
								"subjectStrs" => array($activation_url,$userdetails["Username"])
							);
							
							if(!$mail->newTemplateMsg("resend-activation.txt",$hooks))
							{
								$errors[] = lang("MAIL_TEMPLATE_BUILD_ERROR");
							}
							else
							{
								if(!$mail->sendMail($userdetails["Email"],"Activate your UserCake Account"))
								{
									$errors[] = lang("MAIL_ERROR");
								}
								else
								{
									//Success, user details have been updated in the db now mail this information out.
									$success_message = lang("ACCOUNT_NEW_ACTIVATION_SENT");
								}
							}
						}
					}
				}
			}
		}
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
        
		<div id="container">
	 
		<h2>Resend Activation Email</h2>
	 
		<?php
		if(!empty($_POST) || !empty($_GET["confirm"]) || !empty($_GET["deny"]) && $emailActivation)
		{     
			if(count($errors) > 0)
			{
				echo '<div id="errors">';
				errorBlock($errors);
				echo '</div>'; 
			}
			else
			{
				echo '<div id="success">';
				echo '<p>'.$success_message.'</p>';
				echo '</div>';
			}
		}
		?> 
		
		<div id="regbox">
		
		<?php 
		
		if(!$emailActivation)
		{ 
			echo lang("FEATURE_DISABLED");
		}
		else
		{
		?>
			<form name="resendActivation" action="<?php echo $_SERVER['PHP_SELF'] ?>" method="post">
			
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
				<input type="submit" value="Resend" class="submit" />
			 </p>
				
			</form>

		 <?php } ?> 
		</div>   
		 
		</div>
	</div>   
</div>
</body>
</html>


