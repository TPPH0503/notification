const app = angular.module("login", []);

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

app.controller("login-controller", function($scope, $http) {
    let host = "http://103.160.2.51:8080/pmf";
    //Check the user's login session
    $scope.login_session = function() {
        $http.get(`${host}/pmf/data/login/`).then(resp => {
            $scope.logged = resp.data;
        });
    }
    $scope.login_session();
    //Check version maintaince 
    $scope.maintaince = function() {
            $("#message").hide();
            $http.get(`${host}/pmf/maintaince`).then(resp => {
                var value = resp.data;
                //Check time version maintaince start
                var startDate = new Date(value.startDate);
                var endDate = new Date(value.endDate);
                var today = new Date();
                if (today > startDate && today < endDate) {
                    window.location.href = "http://103.160.2.51:8080/projectmanagement/template/pages/samples/error-404.html";
                } else {
                    console.log(value)
                    if (value.statusWeb == true) {
                        alert("Caution! System is shutting down in " + timeSince(new Date(value.startDate)) + ". Please save all your change before this time!");
                    }
                }
            });
    }
        //
    $scope.loadCookie = function() {
        if (getCookie("user") != "") {
            $scope.username = getCookie("user");
            $http.get(`${host}/pmf/account/getFindOne/${$scope.username}`).then(resp => {
                $scope.pass = resp.data.pass;
            });
        }
    }

    $scope.maintaince();
    $scope.loadCookie();
    //Foget password
    $scope.forget = function() {
            //Find username
            $http.get(`${host}/pmf/account/getFindOne/${$scope.data_find}`).then(resp => {
                var value = resp.data;
                if (value == null || value == "") {
                    $scope.data_find = null;
                    alert("Your account not exits! Try again!");
                } else {
                    //Set default password
                    $http.post(`${host}/pmf/default/password`, value).then(resp => {
                        if (resp.data != null) {
                            alert("Your password was reset successfuly! Check your mail " + value.email);
                        } else {
                            $scope.data_find = null;
                            alert("The system have some problem, can you try it latter!");
                        }
                    })
                }
            })
        }
        //Set data for user
    function set_data(username, role_id) {
        alert("Logged in successfully!");
        sessionStorage.setItem("user", username);
        if ($scope.remember == true) {
            if (getCookie("user") != "") {
                setCookie("user", username, 365);
            } else {
                setCookie("user", username, 365);
            }
        }
        if (role_id == 1) {
            //Admin
            window.location.href = "http://103.160.2.51:8080/projectmanagement/template/pages/tables/viewAccounts.html";
        } else {
            //Client
            window.location.href = "http://103.160.2.51:8080/projectmanagement/template/client/home.html";
        }
    }
    //Check data
    $scope.login = function(username, pass) {
        //Check captcha
        if ($(".g-recaptcha-response")[0].value != "") {
            const Object = {
                username: username,
                pass: pass,
                fullname: '',
                email: '',
                phone: '',
                address: '',
                image: '',
                status: ''
            };
            $http.post(`${host}/pmf/login`, Object).then(resp => {
                var user = resp.data;
                if (user == undefined || user == null || user == NaN || user == "") {
                    alert("This account currently does not exist! Try again!");
                    $("#message").show();
                    $("#message").text("This account currently does not exist! Try again!");
                    $scope.message = false;
                } else if (user.pass != pass && user.username == username) {
                    alert("This password not correct! Try again!");
                    $("#message").show();
                    $("#message").text("This password not correct! Try again!");
                    $scope.message = false;
                }

                if (user.pass == pass && user.username == username) {
                    //If this account is locked you cannot post !
                    if (user.status == 0) {
                        alert("This account has been disabled, contact your administration for assistance!");
                        $("#message").show();
                        $("#message").text("This account has been disabled, contact your administration for assistance!");
                    } else {
                        $("#message").hide(500);
                        set_data(username, user.account_role.roleID);
                    }
                }
            });
        } else {
            alert("Please check your captcha again!");
        }
    };
    //Login with google
    $(document).ready(function() {
        $("#login-google").click(function() {
            window.location.href = `${host}/oauth2/authorization/google`;
        });
    });
});