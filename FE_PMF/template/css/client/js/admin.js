let host = "http://103.160.2.51:8080/pmf/pmf/Account";
const app = angular.module("myAdmin", []);

app.controller("admin", function($scope, $http, $timeout) {
    $scope.account = [];
    $scope.load_account = function() {
        var url = `${host}/getAccount`;
        $http.get(url).then(resp => {
            $scope.account = resp.data;

            $scope.account.forEach(e => {
                if (e.account_role.roleID == 1) {
                    var index = $scope.account.indexOf(e);
                    $scope.account.splice(index, 1);
                }
            });
            console.log("getAccount Sucess", resp);

            resp.data.forEach(e => {
                $scope.account.push(e);
            });

            if($scope.account.length % 8 == 0){
                $scope.totalPage = Math.floor($scope.account.length / 8);
            }else{
                $scope.totalPage = Math.floor($scope.account.length / 8) + 1;
            }
 
        }).catch(error => {
            console.log("getAccount Error", error);
        });
    };
    $scope.load_account();

    //Tim kiem account
    $scope.findAccount = function(){
        $scope.searchName = $('#searchName').val()
        if ($scope.searchName.trim().length > 0) {
            var urlMB = `http://103.160.2.51:8080/pmf/pmf/Account/findAccount/${$scope.searchName}`;
            $http.get(urlMB).then(async resp => {
                $scope.account = resp.data;

                $scope.account.forEach(e => {
                    if (e.account_role.roleID == 1) {
                        var index = $scope.account.indexOf(e);
                        $scope.account.splice(index, 1);
                    }
                });

                if($scope.account.length % 8 == 0){
                    $scope.totalPage = Math.floor($scope.account.length / 8);
                }else{
                    $scope.totalPage = Math.floor($scope.account.length / 8) + 1;
                }
    
                $('#modalListMember').modal('show');
                console.log("Load List Account Success!");
            }).catch(error => {
                console.log("Load List Account Error!", error);
            });
        }else{
            $scope.load_account();
        }
    }

    //Hàm kiểm tra account status rồi return ra giá trị checked phù hợp cho checkbox
    $scope.checkStt = function(status) {
        if (status == 3) {
            return false;
        } else {
            return true;
        }
    }

    //Xác Nhận Cập Nhật Trạng Thái Account
    $scope.confirmUpdateStatus = async function(name, status) {
        $('#confirmUpdate').modal('show');
        $('#confirmBtn').off('click').on('click', function() {
            $scope.updateStatus(name, status, $('#reasonConfirm').val());
        })
    }

    //Hàm Cập Nhật Trạng Thái Của Checkbox
    $scope.updateStatus = async function(name, status, reason) {
        if ($scope.checkStt(status) == true) {
            var url = `${host}/updateStatus/${name}/3`;
            $http.put(url, reason).then(async resp => {
                var index = await $scope.account.findIndex(item => item.username == name);
                var st = 3;
                $scope.account[index].status = st;
                $scope.$apply();
                alert("Cập Nhật Thành Công!");
            }).catch(error => {
                console.log("Error", resp);
                alert("Cập Nhật Thất Bại!");
            });
        } else {
            var objectId = (await $http.get(`http://103.160.2.51:8080/pmf/pmf/Activity/getObjectIdByUserAndCate/${name}/98`)).data
            var url = `${host}/updateStatus/${name}/${objectId}`;
            $http.put(url, reason).then(async resp => {
                var index = await $scope.account.findIndex(item => item.username == name);
                var st = objectId;
                $scope.account[index].status = st;
                $scope.$apply();
                alert("Cập Nhật Thành Công!");
            }).catch(error => {
                console.log("Error", resp);
                alert("Cập Nhật Thất Bại!");
            });
        }
        $('#confirmUpdate').modal('hide');
    }

    //Cac nut index xu li phan trang
    $scope.index = 0;
    $timeout(function() {
        $scope.pageNumber = 1;
    }, 710);

    $scope.first = function() {
        $scope.index = 0;
        $scope.pageNumber = 1;
    }
    
    $scope.prev = function() {
        if ($scope.index > 8) {
            $scope.index -= 8;
            $scope.pageNumber -= 1;
        } else {
            $scope.pageNumber = 1;
            $scope.index = 0;
        }

    }

    $scope.number = function(ff) {
        $scope.index = 8 * (ff-1);
        $scope.pageNumber = ff;
    }
    
    $scope.next = function() {
        if ($scope.index <= $scope.account.length - 9) {
            $scope.index += 8;
            $scope.pageNumber += 1;
        }

    }
    $scope.last = function() {
        $scope.index = $scope.account.length - 8;
        $scope.pageNumber = Math.floor($scope.account.length / 8) + 1;
    }

});