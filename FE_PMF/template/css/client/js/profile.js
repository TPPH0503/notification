let host = "http://103.160.2.51:8080/pmf/pmf/Account";
const app = angular.module("myProfile", []);

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function(e) {
            $('#avatarProfile').attr('src', e.target.result);
        }

        reader.readAsDataURL(input.files[0]);
    }
}

$("#imgInpProfile").change(function() {
    readURL(this);
});

var username = sessionStorage.getItem('user');
app.controller("profile", function($scope, $http) {
    $scope.load_profile = function() {
        var url = `${host}/getProfile/${username}`;
        $http.get(url).then(resp => {
            $scope.account = resp.data;
            console.log("Sucess", resp);
        }).catch(error => {
            console.log("Error", error);
        });
    };

    $scope.update_profile = function() {
        var item = angular.copy($scope.account);
        if (image != null) {
            var name = image.name;
        } else {
            var name = $scope.account.image;
        }
        var url = `${host}/updateProfile/${name}`;
        console.log(name);
        $http.put(url, item).then(resp => {
            $scope.account = resp.data;
            $scope.upload();
            alert("Cập Nhật Thành Công!");
        }).catch(error => {
            console.log("Error", resp);
            alert("Cập Nhật Thất Bại!");
        });
    };

    var image;
    $scope.upload = function() {
        if (image != null) {
            //var url = `${host}/upload`;
            var url = `http://103.160.2.51:8080/projectmanagement/upload`;
            var form = new FormData();
            form.append("file", image);
            $http.put(url, form, {
                transformRequest: angular.identity,
                headers: { 'Content-type': undefined }
            }).then(resp => {
                console.log("Success", resp);
            }).catch(error => {
                console.log("Error", resp);
            });
        }
    }

    $scope.fileUp = function(file) {
        image = file[0];
    }

    $scope.load_profile();
});