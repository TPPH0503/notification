const app = angular.module("status", []);
//Method auto set value Progress

var i = 100;
var result = false;
$("#title-notice").hide();

function reloadPage() {
    window.location.reload();
    alert("cc");
}

function progress(value) {
    if (i == 100) {
        i = 99;
        var elem = document.getElementById("myBar");
        $(".title-notice").show(100);
        var width = 100;
        var id = setInterval(frame, 25);

        function frame() {
            if (width <= 0) {
                clearInterval(id);
                $(".title-notice").animate({
                    opacity: '0'
                });
            } else {
                width--;
                elem.style.width = width + "%";
                $(".thongbao").text(value);
            }
        }

    }
}


app.controller("status-controller", function($scope, $http) {
    let host = "http://localhost:8080";
    $scope.today = new Date();
    $scope.user = {};
    $scope.loadData = function() {
        var userLogin = sessionStorage.getItem("user");
        if (userLogin != undefined) {
            $scope.user.username = userLogin;
        }
        $http.get(`${host}/pmf/last/data`).then(resp => {
            if (resp.data != null) {
                $scope.lastData = resp.data;
            }
        });
        $http.get(`${host}/pmf/load/data`).then(resp => {
            if (resp.data != null || resp.data != undefined) {
                $scope.dataWeb = resp.data;
            }
        });
    }
    $scope.refesh = function() {
        $scope.web = {};
    }

    $scope.checkLogin = function() {
        $http.get(`${host}/pmf/account/getFindOne/${$scope.user.username}`).then(resp => {
            $scope.taiKhoan = resp.data;
            if ($scope.user.username == $scope.taiKhoan.username && $scope.user.pass == $scope.taiKhoan.pass) {
                $scope.createVersion();
                $scope.user.pass = '';
            } else if ($scope.user.username == $scope.taiKhoan.username && $scope.user.pass != $scope.taiKhoan.pass) {
                alert("Please check your password again! Not correct!");
                $scope.user.pass = '';
            } else {
                alert("Please confirm your information again! Your information not correct!");
                $scope.user.pass = '';
            }
        });
    }
    $scope.createVersion = function() {
        $scope.web.statusWeb = true;
        $scope.web.username = $scope.user.username;
        $scope.web.versionWeb = $scope.lastData.versionWeb + 0.1;
        $http.post(`${host}/pmf/new/maintenance`, $scope.web).then(resp => {
            $scope.data = resp.data;
            $scope.loadData();
            progress('New maintenance session added successfully!');
        });
    }

    $scope.loadData();
    $scope.updateStatus = function(value) {
        $http.get(`${host}/pmf/account/getFindOne/${$scope.user.username}`).then(resp => {
            $scope.taiKhoan = resp.data;
            if ($scope.user.username == $scope.taiKhoan.username && $scope.user.pass == $scope.taiKhoan.pass) {
                $scope.web = value;
                $scope.web.statusWeb = false;
                $http.post(`${host}/pmf/new/maintenance`, $scope.web).then(resp => {
                    $scope.loadData();
                    $scope.user.pass = '';
                    progress('Canceled the recent maintenance version successfully!');
                });
            } else if ($scope.user.username == $scope.taiKhoan.username && $scope.user.pass != $scope.taiKhoan.pass) {
                alert("Please check your password again! Not correct!");
                location.reload();
                $scope.user.pass = '';

            } else {
                alert("Please confirm your information again! Your information not correct!");
                $scope.user.pass = '';
                location.reload();
            }
        });
    }
});