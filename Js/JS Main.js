
var AdmimUserpoolID="eu-central-1_X1qFJApW7"
var  AdminAppClientID="3qultnnrp3njrau8h9ahar12ro"

function createNewAdminUser(username,password,emails) //CreateNewUser
{
    var poolData = {
        UserPoolId : AdmimUserpoolID, // Your user pool id here
        ClientId : AdminAppClientID // Your client id here
    };
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

    var attributeList = [];

    var dataEmail = {
        Name : 'email',
        Value : emails
    };

    var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);

    attributeList.push(attributeEmail);

    userPool.signUp(username, password, attributeList, null, function(err, result){
        if (err) {
            alert(err.message || JSON.stringify(err));
            return;
        }
        cognitoUser = result.user;
        alert("Sucessfully Created New Admin. New Username Is: "+ cognitoUser.getUsername());
    });
}
function Login(usernames, passwords) //used to log a user into the main page
{
var poolData = {
    UserPoolId : AdmimUserpoolID, // your user pool id here
    ClientId : AdminAppClientID // your app client id here
};
var userPool = 
new AmazonCognitoIdentity.CognitoUserPool(poolData);
var userData = {
Username : usernames, // your username here
Pool : userPool
};
    var authenticationData = {
        Username : usernames, // your username here
        Password : passwords, // your password here
    };
    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
 
    cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            var accessToken = result.getAccessToken().getJwtToken();
            document.getElementById("SignUpErrMsg").style.color = "green";
            document.getElementById("SignUpErrMsg").innerHTML = "User Sucessfully Logged In";
            localStorage.setItem("JwtToken",accessToken);
            self.location=("Pages/homepage.html")
        },
            onFailure: function(err) {
            document.getElementById("SignUpErrMsg").style.color = "red";
            document.getElementById("SignUpErrMsg").innerHTML = (err.message || JSON.stringify(err));
        }
    });
}

function checkValid(jwtToken)// Used to see if session has ended
{ 
    
    var current_time = Date.now() / 1000;
    if ( jwtToken.exp < current_time) 
    {
        return false
    }
    else
    {
        return true
    }
    
    if(current_time-jwtToken.exp < 5000)
    {
        const userPool = new AWSCognito.CognitoUserPool({
        UserPoolId: AdmimUserpoolID,
        ClientId: AdminAppClientID
        })

        userPool.client.makeUnauthenticatedRequest('initiateAuth', {
          ClientId: AdminAppClientID,
          AuthFlow: 'REFRESH_TOKEN_AUTH',
          AuthParameters: {
            'REFRESH_TOKEN':localStorage.getItem("JwtToken")  // client refresh JWT
          }
        }, (err, authResult) => {
          if (err) {
             throw err
          }
          localStorage.setItem("JwtToken",authResult); // contains new session
        })
    }
}
function whatUser(jwtToken) // checks what user it is, and whether or not it is a master user
{
    const tokenParts = jwtToken.split('.');
    const encodedPayload = tokenParts[1];
    const rawPayload = atob(encodedPayload);
    const user = JSON.parse(rawPayload);
    return (user.username )
}

