let host = "http://103.160.2.51:8080/pmf/pmf/Account";
const app = angular.module("apps", [])
app.controller("register", function($scope, $http) {
    $scope.account = {};
    $scope.items = [];
    $scope.role = [];
    $scope.date = new Date();
    $scope.listName = [];
    $scope.codeVerify = 0;
            // File by Nha Thanh
	$scope.load_local_json = function(){

    		$http.get("http://103.160.2.51:8080/projectmanagement/template/JSON/local.json").then(function(d) {
        		$scope.local = d.data;
    		});
	}
	$scope.load_local_json();

    // Method use for distrist combobox
    $scope.getCtys = function() {
        var value = $('#floatingSelectCty').val();
        $scope.districts = $scope.local[value].districts;
        $scope.ctyId = value;

        $scope.wards = [];
        $scope.streets = [];
        tp = "TP " + $scope.local[value].name;
    };

    // // Method use for cty combobox
    $scope.getDistricts = function() {
        var value = $('#distrists').val();
        disId = value;
        $scope.loadWard_Streets($scope.ctyId, disId);
    };
   
    $scope.loadWard_Streets = function(cty, dis) {
        $scope.wards = $scope.local[cty].districts[dis].wards;
        $scope.streets = $scope.local[cty].districts[dis].streets;
        quan = ", " + $scope.districts[dis].name; + ", ";
    };
    $scope.getWard = function() {
        var value = $('#ward').val();
        phuong = value;
    };
    $scope.getStreet = function() {
        var value = $('#street').val();
        duong = value;
    };
    //
    $scope.streets=[];
    $scope.wards=[];
    var tp, quan, phuong, duong;

    $scope.load_username = function() {
        var url = `${host}/getUsername`;
        $http.get(url).then(resp => {
            console.log(resp.data);
            $scope.listName = resp.data;
            console.log("Load Sucess", resp);
        }).catch(error => {
            console.log("Load Error", error);
        });
    };
    $scope.load_email = function() {
        var url = `${host}/getemail`;
        $http.get(url).then(resp => {
            $scope.listemail = resp.data;
            console.log("Load Sucess", resp);
        }).catch(error => {
            console.log("Load Error", error);
        });
    }
    $scope.confirmPassword;
    $scope.stt = true;
    $scope.checkExist = function() {
        var count = 0;
        for (var i = 0; i < $scope.listName.length; i++) {
            if ($scope.listName[i] == $scope.account.username) {
                count++;
            }
        }
        if (count != 0) {
            $scope.stt = false;
        } else {
            $scope.stt = true;
        }
    }
    $scope.checkemail = function() {
        var count = 0;
        for (var i = 0; i < $scope.listemail.length; i++) {
            if ($scope.listemail[i] == $scope.account.email) {
                count++;
            }
        }
        if (count != 0) {
            $scope.abc = false;
        } else {
            $scope.abc = true;
        }
    }
    $scope.load_email();
    $scope.load_username();
    $scope.reset = function() {
        $scope.key = null;
    }
    $scope.load_all = function() {
        var url = `${host}/register`;
        $http.get(url).then(resp => {
            $scope.items = resp.data;
            console.log("Success", resp);
        }).catch(error => {
            console.log("Error", error);
        });
    }
    $scope.create = function() {
            var account_role = {
                roleID: '2',
                roleName: 'User'
            }
            $scope.account.image = "notAvailable.jpg";
            $scope.account.status = "1";
            $scope.account.account_role = account_role;
            $scope.account.createDate = $scope.date;
            $scope.account.address = tp + quan + ", " + phuong + ", " + duong;
            var item = angular.copy($scope.account);
            console.log(item);
            var url = `${host}/register`;
            $http.post(url, item).then(resp => {
                $scope.account = resp.data.name;
                // $scope.items[$scope.key] = item;
                $scope.reset();
                console.log('Success', resp)
                alert("Your account was successfully!")
                window.location.href = "login.html";
            }).catch(error => {
                console.log("Error", error)
            });
        }
    

    $scope.sendMailVerify = function(email) {
        $http.get(`${host}/send/code/${email}`).then(resp => {
            $scope.codeVerify = resp.data;
            console.log(resp.data);
        });
    };
});

//
$("#pills-profile-tab").on("click", function() {
    $("#pills-profile-tab").removeClass("active");
});
$("#pills-home-tab").on("click", function() {
    $("#pills-home-tab").removeClass("active");
});
$("#pills-mail-tab").on("click", function() {
    $("#pills-mail-tab").removeClass("active");
});
$("#pills-back-tab").on("click", function() {
    $("#pills-back-tab").removeClass("active");
});