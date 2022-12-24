let host_NhaThanh = "http://localhost:8080/pmf";
const app = angular.module("report", []);

function cc() {
    alert("cc");
}
app.controller("report_admin", function($scope, $http) {
    $scope.report1 = function() {
        $http.get(`${host_NhaThanh}/report_admin1`).then(resp => {
            $scope.data_report1 = resp.data;
            console.log(resp.data);
        }).catch(
            error => {
                console.log("Error with report 1" + error);
            }
        );

        $http.get(`${host_NhaThanh}/top1_user`).then(resp => {
            $scope.data_userTop1 = resp.data;
            $scope.percent = ($scope.data_userTop1[0][0] / 100 * 100);
            $('#top1').css('width', $scope.percent + '%');
            console.log($scope.percent);
        }).catch(
            error => {
                console.log("Error with top 1 user" + error);
            }
        );

        $http.get(`${host_NhaThanh}/total`).then(resp => {
            $scope.total = resp.data;
        }).catch(
            error => {
                console.log("Error with total" + error);
            }
        );

    }
    $scope.report1();
})