
		<?php if(!isUserLoggedIn()) { ?>
            <ul>
                <a href="index.php">Home</a>&nbsp;&nbsp;
				<a href="builder.php">Builder</a>&nbsp;&nbsp;
				<a href="player.php">Player</a>&nbsp;&nbsp;
				<a href="info.php">Info</a>&nbsp;&nbsp;
                <a href="login.php">Login</a>
            </ul>
       <?php } else { ?>
       		<ul>
            	<a href="index.php">Home</a>&nbsp;&nbsp;
				<a href="builder.php">Builder</a>&nbsp;&nbsp;
				<a href="player.php">Player</a>&nbsp;&nbsp;
            	<a href="account.php">Account Home</a>&nbsp;&nbsp;
				<a href="info.php">Info</a>&nbsp;&nbsp;
				<a href="logout.php">Logout</a>
       		</ul>
       <?php } ?>
            
            
