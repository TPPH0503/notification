let host = "http://103.160.2.51:8080/pmf/pmf/Account/admin";
const app = angular.module("report", []);
var data;
app.controller("report_admin", function($scope, $http, $timeout) {

    $scope.account = [];
    $scope.load_account = async function() {
        
        $scope.totalAccount =  (await $http.get(`http://103.160.2.51:8080/pmf/pmf/Report/admin/totalAccount`)).data;
        $scope.totalAmount =  (await $http.get(`http://103.160.2.51:8080/pmf/pmf/Report/admin/totalAmount`)).data;
        $scope.totalProject =  (await $http.get(`http://103.160.2.51:8080/pmf/pmf/Report/admin/totalProject`)).data;
        $scope.totalActiveProject = (await $http.get(`http://103.160.2.51:8080/pmf/pmf/Report/admin/countProjectByStt/1`)).data;
        
        $scope.totalTask =  (await $http.get(`http://103.160.2.51:8080/pmf/pmf/Report/admin/totalTask`)).data;
        $scope.totalTrial =  (await $http.get(`http://103.160.2.51:8080/pmf/pmf/Report/admin/countAccountByStt/1`)).data;
        $scope.totalPremium =  (await $http.get(`http://103.160.2.51:8080/pmf/pmf/Report/admin/countAccountByStt/2`)).data;
        $scope.totalBanned =  (await $http.get(`http://103.160.2.51:8080/pmf/pmf/Report/admin/countAccountByStt/3`)).data;

        $scope.partOfValue1 =  Math. round(($scope.totalActiveProject * 100) / $scope.totalProject);
        $scope.partOfValue2 =  Math. round((($scope.totalTrial + $scope.totalPremium + $scope.totalBanned)* 100) / $scope.totalAccount);
        $scope.partOfValue3 =  Math. round(($scope.totalAmount * 100) / ($scope.totalTrial + $scope.totalPremium + $scope.totalBanned));

        var url = `${host}/getTimeline`;
        $http.get(url).then(resp => {
            $scope.account = configuration(resp.data);
            console.log("getTimeline Sucess", resp);
        }).catch(error => {
            console.log("getTimeline Error", error);
        });
    };

    
    //Tim kiem activities
    $scope.findActivities = function(){
        $scope.searchAct = $('#searchAct').val()
        if ($scope.searchAct.trim().length > 0) {
            var urlMB = `http://103.160.2.51:8080/pmf/pmf/Acivity/findActivity/${$scope.searchAct}`;
            $http.get(urlMB).then(async resp => {
                $scope.configurationTeam(resp.data)
                console.log("Load List Activities Success!");
            }).catch(error => {
                console.log("Load List Activities Error!", error);
            });
        }else{
            $scope.load_activities();
        }
    }

    $scope.load_activities = function() {
        var url = `http://103.160.2.51:8080/pmf/pmf/Activity/getListActivityForAdmin`;
        $http.get(url).then(resp => {
            $scope.configurationTeam(resp.data);
            if(resp.data.length % 10 == 0){
                $scope.totalPage = Math.floor(resp.data.length / 10);
            }else{
                $scope.totalPage = Math.floor(resp.data.length / 10) + 1;
            }
            console.log("activities Sucess", resp);
        }).catch(error => {
            console.log("activities Error", error);
        });
    };

    $scope.configurationTeam = async function(list) {
        for (let i = 0; i < list.length; i++) {
            if(list[i].activity_category.categoryID == 1){
                var id = list[i].projectID;
                $scope.pro = ( await $http.get(`http://103.160.2.51:8080/pmf/pmf/Project/getProject/${id}`)).data;
                list[i].discription = $scope.pro.team.teamName + " Team";
            }else if(list[i].activity_category.categoryID == 99){
                list[i].discription = "Paid 15$ for Version";
            }else if(list[i].activity_category.categoryID == 98){
                var reason = "Reason: '" + list[i].discription + "'";
                list[i].discription = reason;
            }
        }
        $scope.activities = list;
    }

    $scope.load_activities();
    $scope.load_account();

    $scope.load_project_rp = function() {
        var url = `http://103.160.2.51:8080/pmf/pmf/Project/getProject`;
        $http.get(url).then(async resp => {
            $scope.project = await resp.data;
            if($scope.project.length % 10 == 0){
                $scope.totalPage = Math.floor($scope.project.length / 10);
            }else{
                $scope.totalPage = Math.floor($scope.project.length / 10) + 1;
            }
            console.log("project_rp Sucess", resp);
        }).catch(error => {
            console.log("project_rp Error", error);
        });
    }

    $scope.openModalProject = function(){
        $scope.load_project_rp();
        $('#modalProject').modal('show');
    }

     //Tim kiem project
     $scope.findProject = function(){
        $scope.searchName = $('#searchName').val()
        if ($scope.searchName.trim().length > 0) {
            var urlMB = `http://103.160.2.51:8080/pmf/pmf/Project/findProject/${$scope.searchName}`;
            $http.get(urlMB).then(async resp => {
                $scope.project = resp.data;

                if($scope.project.length % 10 == 0){
                    $scope.totalPage = Math.floor($scope.project.length / 10);
                }else{
                    $scope.totalPage = Math.floor($scope.project.length / 10) + 1;
                }
    
                console.log("Load List Project Success!");
            }).catch(error => {
                console.log("Load List Project Error!", error);
            });
        }else{
            $scope.load_project_rp();
        }
    }


    $scope.openModalAmount = function(){
        $scope.load_amount_rp();
        $('#modalAmount').modal('show');
    }

     //Tim kiem Amount
     $scope.findAmount = function(){
        $scope.searchAmount= $('#searchAmount').val()
        if ($scope.searchAmount.trim().length > 0) {
            var urlMB = `http://103.160.2.51:8080/pmf/pmf/Activity/findAmount/${$scope.searchAmount}`;
            $http.get(urlMB).then(async resp => {
                $scope.amount = resp.data;

                if($scope.amount.length % 10 == 0){
                    $scope.totalPage = Math.floor($scope.amount.length / 10);
                }else{
                    $scope.totalPage = Math.floor($scope.amount.length / 10) + 1;
                }
    
                console.log("Load List Amount Success!");
            }).catch(error => {
                console.log("Load List Amount Error!", error);
            });
        }else{
            $scope.load_amount_rp();
        }
    }
    
    $scope.load_amount_rp = function() {
        var url = `http://103.160.2.51:8080/pmf/pmf/Activity/getListAmountForAdmin`;
        $http.get(url).then(resp => {
            $scope.amount = resp.data;
            if($scope.amount.length % 10 == 0){
                $scope.totalPage = Math.floor($scope.amount.length / 10);
            }else{
                $scope.totalPage = Math.floor($scope.amount.length / 10) + 1;
            }
            console.log("amount_rp Sucess", resp);
        }).catch(error => {
            console.log("amount_rp Error", error);
        });
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
        if ($scope.index > 10) {
            $scope.index -= 10;
            $scope.pageNumber -= 1;
        } else {
            $scope.pageNumber = 1;
            $scope.index = 0;
        }

    }

    $scope.number = function(ff) {
        $scope.index = 10 * (ff-1);
        $scope.pageNumber = ff;
    }
    
    $scope.next = function() {
        if ($scope.index <= $scope.activities.length - 11) {
            $scope.index += 10;
            $scope.pageNumber += 1;
        }

    }
    $scope.last = function() {
        $scope.index = $scope.activities.length - 10;
        $scope.pageNumber = Math.floor($scope.activities.length / 10) + 1;
    }
});


const configuration = (list) => {
    for (let i = 0; i < list.length; i++) {
        const d = new Date(list[i].createDate)
        list[i].createDate = timeSince(d)
    }
    return list.reverse()
}

function timeSince(date) {
    var seconds = Math.floor((new Date() - date) / 1000);
    var interval = seconds / 31536000;
    if (interval > 1) {
        return Math.floor(interval) + " ago";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        return Math.floor(interval) + " month ago";
    }
    interval = seconds / 86400;
    if (interval > 1) {
        return Math.floor(interval) + " day ago";
    }
    interval = seconds / 3600;
    if (interval > 1) {
        return Math.floor(interval) + " hour ago";
    }
    interval = seconds / 60;
    if (interval > 1) {
        return Math.floor(interval) + " minute ago";
    }
    return Math.floor(seconds) + " second ago";
}

