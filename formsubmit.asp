<html>
<head>
<title>Submitted data</title>
</head>

<body>
<%
'declare the variables that will receive the values 
Dim like, unlike, likeThis, likesThis
'receive the values sent from the form and assign them to variables
'note that request.form("name") will receive the value entered 
'into the textfield called name
like=Request.Form("like")
unlike=Request.Form("unlike")
likeThis=Request.Form("likeThis")
likesThis=Request.Form("likesThis")

'let's now print out the received values in the browser
Response.Write("like: " & like & "<br>")
Response.Write("unlike: " & unlike & "<br>")
Response.Write("likeThis: " & likeThis & "<br>")
Response.Write("likesThis: " & likesThis & "<br>")
%> 
</body>
</html>