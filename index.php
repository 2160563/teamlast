<?php 
	$host = 'localhost';
	$user = 'root';
	$pass = '';
	$dbname = 'teampalak';

	$conn = mysqli_connect($host,$user,$pass,$dbname) or die('Cannot connect to db');


?>
<!DOCTYPE html>
<html>
<head>
	<title>Testing Page</title>
</head>
<body>
	<center>	
		<h3>Welcome to the testing page</h3>
	<form method="Post" enctype="multipart/form-data">
		<label>Upload CSV File</label>
		<br>
		<br>
		<input type="file" name="csv">
		<br>
		<br>
		<input type="submit" name="submit">
	</form>
	<?php 
	if (isset($_POST['submit'])) {
		if ($_FILES['csv']['name']) {
			$filename = explode(".", $_FILES['csv']['name']);
			if ($filename[1] == "csv") {
				if ($filename[0] == "accounts") {
					$handle = fopen($_FILES['csv']['tmp_name'], "r");
					$row = 1;
					echo "<h3>Please verify the data</h3>";
					echo "<h3>Edit the CSV file and upload again if not satisfied</h3>";
			        echo "<h3>If satisfied go to the buttom of the page and upload the same file and click submit button so that it will go to the database</h3>";
					echo "<form method='POST' enctype=\"multipart/form-data\">";
					while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
				        $num = count($data);
				        echo "<h1> Line $row: <br /></h1>\n";
				        $row++;
				        $label = array("Username","Password","Firstname","Lastname","Email","AccountType","Image");
				        for ($i=0; $i < $num; $i++) {
				        	echo "<label>".$label[$i]."</label><br \>\n";
				            echo "<input readonly size='50' type='text' value='".$data[$i]."'></input><br />\n";
				            echo "<br>";
				        }
				    }
				        echo "<input type=\"file\" name=\"final\">";
				        echo "<input type=\"submit\" name=\"accounts\">";
				        echo "</form>";
				    fclose($handle);
				}else if ($filename[0] == "gameAccounts") {
					$handle = fopen($_FILES['csv']['tmp_name'], "r");
					$row = 1;
					echo "<h3>Please verify the data</h3>";
					echo "<h3>Edit the CSV file and upload again if not satisfied</h3>";
			        echo "<h3>If satisfied go to the buttom of the page and upload the same file and click submit button so that it will go to the database</h3>";
					echo "<form method='POST' enctype=\"multipart/form-data\">";
					while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
				        $num = count($data);
				        echo "<h1> Line $row: <br /></h1>\n";
				        $row++;
				        $label = array("Username","Game","InGameName","SummonerOrDotaID","SteamOrAccountID","Rank","MMR");
				        for ($i=0; $i < $num; $i++) {
				        	echo "<label>".$label[$i]."</label><br \>\n";
				            echo "<input readonly size='50' type='text' value='".$data[$i]."'></input><br />\n";
				        	echo "<br>";
				        }
				    }
				    	echo "<input type=\"file\" name=\"final\">";
				        echo "<input type=\"submit\" name=\"gameAccounts\">";
				        echo "</form>";
				    fclose($handle);
				}else{
					echo "<script type='text/javascript'>alert('Wrong file uploaded');
                window.location.replace(\"http://localhost/csv/\");
              </script>";
				}
			}
		}
	}
	if (isset($_POST['accounts'])) {
		if ($_FILES['final']['name']) {
			$filename = explode(".", $_FILES['final']['name']);
			if ($filename[1] == "csv") {
				if ($filename[0] == "accounts") {	
			    	$handle = fopen($_FILES['final']['tmp_name'],'r');
			    	while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
			    			$item1 = mysqli_real_escape_string($conn, $data[0]);
			    			$item2 = mysqli_real_escape_string($conn, $data[1]);
			    			$item3 = mysqli_real_escape_string($conn, $data[2]);
			    			$item4 = mysqli_real_escape_string($conn, $data[3]);
			    			$item5 = mysqli_real_escape_string($conn, $data[4]);
			    			$item6 = mysqli_real_escape_string($conn, $data[5]);
			    			$item7 = mysqli_real_escape_string($conn, $data[6]);
			    			$sql1 = "UPDATE accounts SET `Username`='{$item1}',`Password`='{$item2}',`Firstname`='{$item3}',`Lastname`='{$item4}',`Email`='{$item5}',`AccountType`='{$item6}',`Image`='{$item7}' WHERE username = '$item1'";
			    			mysqli_query($conn,$sql1);			
			    			$sql = "INSERT INTO accounts(`Username`, `Password`, `Firstname`, `Lastname`, `Email`, `AccountType`, `Image`) VALUES ('{$item1}','{$item2}','{$item3}','{$item4}','{$item5}','{$item6}','{$item7}')";
			    			mysqli_query($conn,$sql);		
			    	}
			    	fclose($handle);
			    	echo "<script type='text/javascript'>alert('Successfully Imported');
			            window.location.replace(\"http://localhost/csv/\");
			          </script>";
				}else{
					echo "<script type='text/javascript'>alert('Wrong file uploaded');
                window.location.replace(\"http://localhost/csv/\");
              </script>";
				}
			}
		}
    }
    if (isset($_POST['gameAccounts'])) {
    	if($_FILES['final']['name']) {
			$filename = explode(".", $_FILES['final']['name']);
			if ($filename[1] == "csv") {
				if ($filename[0] == "gameAccounts") {	
			    	$handle = fopen($_FILES['final']['tmp_name'],'r');
			    	while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
			    			$item1 = mysqli_real_escape_string($conn, $data[0]);
			    			$item2 = mysqli_real_escape_string($conn, $data[1]);
			    			$item3 = mysqli_real_escape_string($conn, $data[2]);
			    			$item4 = mysqli_real_escape_string($conn, $data[3]);
			    			$item5 = mysqli_real_escape_string($conn, $data[4]);
			    			$item6 = mysqli_real_escape_string($conn, $data[5]);
			    			$item7 = mysqli_real_escape_string($conn, $data[6]);
			    			$sql1 = "UPDATE gameaccounts SET `Username`='{$item1}',`Game`='{$item2}',`InGameName`='{$item3}',`SummonerOrDotaID`='{$item4}',`SteamOrAccountID`='{$item5}',`Rank`='{$item6}',`MMR`='{$item7}' WHERE  username = '$item1'";
			    			mysqli_query($conn,$sql1);		
			    			$sql = "INSERT INTO gameaccounts(`Username`, `Game`, `InGameName`, `SummonerOrDotaID`, `SteamOrAccountID`, `Rank`, `MMR`) VALUES ('{$item1}','{$item2}','{$item3}','{$item4}','{$item5}','{$item6}','{$item7}')";
			    			mysqli_query($conn,$sql);		
			    	}
			    	fclose($handle);
			    	echo "<script type='text/javascript'>alert('Successfully Imported');
			            window.location.replace(\"http://localhost/csv/\");
			          </script>";
				}else{
					echo "<script type='text/javascript'>alert('Wrong file uploaded');
                window.location.replace(\"http://localhost/csv/\");
              </script>";
				}
			}
		}
    }
	?>
	</center>
</body>
</html>