const app = angular.module("main", []);
// sessionStorage.setItem("user", 'admin123')
var username = sessionStorage.getItem("user");
var projects = null;
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firsttime_user = true;
var firsttime_task = true;
var userID = username;
var messageForMoveTaskToAnotherSection = null;
// DemoNotification
//Notification
//For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCzwwYZJ6sZlvmOAPMRmFdjZfPT_Zeg8Z8",
    authDomain: "servertest-31e01.firebaseapp.com",
    projectId: "servertest-31e01",
    storageBucket: "servertest-31e01.appspot.com",
    messagingSenderId: "594090763269",
    appId: "1:594090763269:web:63bc7d82fad3a4334ae86c",
    measurementId: "G-45YZTDKDLC"
  };


//End Notification
firebase.initializeApp(firebaseConfig);

var firestore = firebase.firestore();
const settings = { timestampsInSnapshots: true };
firestore.settings(settings);


firestore.collection(userID).onSnapshot(function(snapshot) {
    if (firsttime_user === true) {
        firsttime_user = false;
        return;
    }
    snapshot.docChanges().forEach(async function(change) {
        if (change.type === "added") {
            var notification = change.doc.data();
            var pj = await findOneProjectGen(notification.projectID)
            sendNotification(notification.title + "<br>" + " Project: " + pj.projectName + "", notification.message, notification.createdTime);
            if (notification.message.includes("You has been removed from project") === true) {
                if (notification.projectID == sessionStorage.getItem("pi")) {
                    setTimeout(function() {
                        window.location.href = "http://103.160.2.51:8080/projectmanagement/template/client/home.html"
                    }, 4000)
                } else {
                    angular.element(document.getElementById('sidebarController')).scope().load_all_project();
                }
            }
        }
        if (change.type === "modified") {

        }
        if (change.type === "removed") {

        }
    });
});






app.controller("sidebarController", ($scope, $http, $timeout, $interval, $location, $rootScope) => {
    let hostNotification = "http://103.160.2.51:8080/pmf/pmf";
    let host = "http://103.160.2.51:8080/pmf/pmf/Home";
    $rootScope.load_all_project = function() {
        var url = `http://103.160.2.51:8080/pmf/pmf/Project/getAllProjectsRelevantToAccount/${username}`;
        $http.get(url).then(resp => {
            $rootScope.projects = resp.data;
        }).catch(error => {
            console.log("Error", error);
        });
    };

    $scope.lo = async function(pi) {
        var check = await $rootScope.checkAuthorization(pi);
        if(check === false){
            sendNotification("Authorization","<span class='text-danger'>This project has been shut down</span>",new Date());
            return;
        }
        sessionStorage.setItem("pi", pi);
        $scope.pi = sessionStorage.getItem("pi");
        window.location.href = "http://103.160.2.51:8080/projectmanagement/template/client/task.html"
    }

    $rootScope.checkAuthorization = async function(pid){
        var url = `http://103.160.2.51:8080/pmf/pmf/project/${pid}/${username}/authorization`;
        var check = false;
        await $http.get(url).then(resp => {
            check = resp.data;
        }).catch(error => {
            console.log("Error", error);
        });

        return check;
    }
    $rootScope.load_all_project();

    //Duy làm notificcation
    //Lay ho va ten cua user
    $scope.load_fullname = function() {
        var url = `${host}/helloName/${username}`;
        $http.get(url).then(resp => {
            $scope.fullname = resp.data;
        }).catch(error => {
            console.log("fullname Error", error);
        });
    };
    $scope.load_fullname()
        //Mảng chứa notification
    $scope.notificationList = []
        //Mảng chứa project
    $scope.projectList = []
        //Mảng chứa project
    $scope.projectListPrivate = []
        //Các biến để điều hướng hiển thị
    $scope.viewObject = {
        firstTimeLoading: true,
        newNotification: 0,
        view: false
    }

    $scope.viewMore = function(){
        $scope.indexNotification += 7;
    }

    $scope.viewMorePrivate = function(){
        $scope.indexNotificationPrivate += 7;
    }

    $scope.intervalFunction = () => {
        $.ajax({
            url: `${hostNotification}/Project/getAllProjectsRelevantToAccount/${sessionStorage.getItem('user')}`,
            type: 'GET',
            contentType: "application/json",
            success: async(res) => {
                if ($scope.viewObject.firstTimeLoading === true) {
                    //Lần đầu load trang thì không cần load thông báo mới
                    $scope.projectList = await projectNormalConfiguration(res);
                    $scope.viewObject.firstTimeLoading = false;
                } else {
                    //Kiểm tra thử có thông báo mới không
                    let result = await areThereNewNotification($scope.projectList)
                        //Nếu có thì tiến hành load thông báo
                    if (result === true) {
                        $scope.projectList = await projectConfiguration($scope.projectList, res);
                        $scope.viewObject.newNotification = 0;
                        for (var i = 0; i < $scope.projectList.length; i++) {
                            $scope.viewObject.newNotification = $scope.viewObject.newNotification + $scope.projectList[i].projectNotification
                        }
                    }
                }
            },
            error: (err) => {
                console.log(err)
            }
        });
    }
    $scope.intervalFunction()
    $interval($scope.intervalFunction, 2000)
    $scope.notificationOpen = () => {
        $scope.viewObject.newNotification = 0,
        $scope.viewObject.view = false,
        $('#exampleModal').modal('show')
    }

    //Load list private
    $scope.load_list_project_private = async function() {
        await $.ajax({
            url: `${hostNotification}/Project/getAllProjectsRelevantToAccountPrivate/${sessionStorage.getItem('user')}`,
            type: 'GET',
            contentType: "application/json",
            success: async(res) => {
                $scope.projectListPrivate = await res;
            },
            error: (err) => {
                console.log(err)
            }
        });
    }

    //Kiem tra list private
    $scope.check_list_project_private = async function() {
        await $scope.projectListPrivate.forEach(async function(item) {
            await $.ajax({
                url: `${hostNotification}/Project/${item.projectID}/${sessionStorage.getItem('user')}/checkUserInProject`,
                type: 'GET',
                contentType: "application/json",
                success: async(res) => {
                    item.membership = await res;
                },
                error: (err) => {
                    console.log(err)
                }
            });
        });
    }

    $scope.notificationPrivateOpen = async() => {
            $scope.viewObject.newNotification = 0,
                $scope.viewObject.view = false,
                $scope.notificationList = [];

            await $scope.load_list_project_private();
            await $scope.check_list_project_private();

            $('#privateModal').modal('show')
        }
        //Khi người dùng bấm vào project thì sẽ đổ ra các thông báo liên quan
    $scope.changeView = async(projectID) => {
        $scope.notificationList = configuration(await getNotification(projectID))
        $scope.viewObject.view = true
        $scope.indexNotification = 7;
        for (var i = 0; i < $scope.projectList.length; i++) {
            if ($scope.projectList[i].projectID == projectID) {
                $scope.projectList[i].projectNotification = 0
            }
        }
    }

    //profile người dùng của Hùng
    $rootScope.load_profile = function() {
        var url = `http://103.160.2.51:8080/pmf/pmf/Account/getProfile/${username}`;
        $http.get(url).then(async resp => {
            $rootScope.verifiedEmail = resp.data.email;
            $rootScope.load_email_for_check_updateProfile();
            $rootScope.account = resp.data;
            await $('#avatarProfile').attr('src','https://drive.google.com/uc?export=image&id='+ resp.data.image);
            $('#profileModal').modal('show');
            console.log("Sucess", resp);
        }).catch(error => {
            console.log("Error", error);
        });
    };

    $rootScope.verifyEmail = function(email){
        var count = 0;
        for (var i = 0; i < $rootScope.listemail_updateProfile.length; i++) {
            if ($rootScope.listemail_updateProfile[i] == email) {
                count++;
            }
        }
        if(count==0){
            alert("Verify code is sending! Please wait!");
            $http.get(`http://103.160.2.51:8080/pmf/pmf/Account/send/code/${email}`).then(resp => {
                $scope.codeVerify = resp.data;
                $('#profileModal').modal('hide');
                $('#verifyEmailModal').modal('show');
                console.log(resp.data);
            }).catch(error => {
                alert("Error when sending code to your email!")
                console.log("Error", error);
            });
    
        }else{
            alert("This email is already taken!");
        }


    }

    $rootScope.load_email_for_check_updateProfile = function() {
        var url = `http://103.160.2.51:8080/pmf/pmf/Account/getemail`;
        $http.get(url).then(resp => {
            $rootScope.listemail_updateProfile = resp.data;
            console.log("Load Sucess", resp);
        }).catch(error => {
            console.log("Load Error", error);
        });
    }

    $rootScope.verify = function(email){
        $scope.codeInputed = $('#exampleInputCode').val();
        if($scope.codeInputed == $scope.codeVerify){
            $rootScope.verifiedEmail = email;
            alert("Success!");
            $rootScope.backToProfile();
        }else{
            alert("Incorrect code or timeout!")
        }
    }

    $rootScope.backToProfile = async function(){
        $('#verifyEmailModal').modal('hide');
        $('#profileModal').modal('show');
    }

    $rootScope.update_profile = function(imageCode) {
        var item = angular.copy($rootScope.account);
        if (image != null) {
            var name = imageCode;
        } else {
            var name = $rootScope.account.image;
        }
        var url = `http://103.160.2.51:8080/pmf/pmf/Account/updateProfile/${name}`;
        $http.put(url, item).then(resp => {
            $rootScope.account = resp.data;
        }).catch(error => {
            console.log("Error", resp);
            alert("Error!");
        });
    };

    $rootScope.upload = function() {
        alert("Updating...");
        image = document.getElementById('imgInpProfile').files[0];
        if (image != null) {
            var url = `http://103.160.2.51:8080/pmf/pmf/Account/upload`;
            var form = new FormData();
            form.append("file", image);
            $http.post(url, form, {
                transformRequest: angular.identity,
                headers: { 'Content-type': undefined }
            }).then(resp => {
                console.log(resp.data.image);
                $rootScope.update_profile(resp.data.image)
                alert("Update successful!");
                $('#fileUploadInput').val(null);
                console.log("Upload Success", resp);
            }).catch(error => {
                console.log("Upload Error", error);
            });
    };

    $rootScope.change_section_pi = async function(projectID) {
        // await $rootScope.$emit("CallParentMethod", {});
        await $scope.load_all_subtask(projectID);
        await $scope.load_all_ac_mem(projectID);
        await $scope.load_all_mem(projectID);
        await $scope.load_all_task_assigned(projectID);
        await $scope.load_all_subtask_assigned(projectID);
    }

    $rootScope.changeViewPrivate = async(projectID, type) => {
        $scope.indexNotificationPrivate = 7;
        await $scope.load_all_mem(projectID);
        var check = await $scope.check_role_member();
        if (check.team_role.roleID == 1) {
            if (type == 1) {
                $scope.notificationList = configuration(await getNotificationInvitationAdmin(projectID))
            } else if (type == 2) {
                $scope.notificationList = configuration(await getNotificationTaskAssignedAdmin(projectID))
            } else if (type == 3) {
                $scope.notificationList = configuration(await getNotificationSubTaskAssignedAdmin(projectID))
            }
        } else {
            if (type == 1) {
                $scope.notificationList = configuration(await getNotificationInvitation(projectID))
            } else if (type == 2) {
                $scope.notificationList = configuration(await getNotificationTaskAssigned(projectID))
            } else if (type == 3) {
                $scope.notificationList = configuration(await getNotificationSubTaskAssigned(projectID))
            }
        }


        $scope.viewObject.view = true
        for (var i = 0; i < $scope.projectList.length; i++) {
            if ($scope.projectList[i].projectID == projectID) {
                $scope.projectList[i].projectNotification = 0
            }
        }
    }

    //Invitation
    $scope.accept_invitation = async function(projectID) {
        var infor = [username, projectID];

        await $.ajax({
            url: 'http://103.160.2.51:8080/pmf/pmf/project/accept-invitation',
            type: 'POST',
            contentType: "application/json",
            data: JSON.stringify(infor),
            success: async function(res) {
                await $scope.load_list_project_private();
                await $scope.check_list_project_private();
                await $rootScope.load_all_project();
                $scope.$apply();
            },
            error: function(resp) {
                console.log('Assign ko ok')
            }
        });
        var message = "User " + username + " has acepted the invitation";
        await sendAPINoti(message, "task" + projectID, projectID, -1);

    }

    $scope.refuse_invitation = async function(projectID) {
        var infor = [username, projectID];

        await $.ajax({
            url: 'http://103.160.2.51:8080/pmf/pmf/project/refuse-invitation',
            type: 'POST',
            contentType: "application/json",
            data: JSON.stringify(infor),
            success: async function(res) {
                await $scope.load_list_project_private();
                await $scope.check_list_project_private();
                $scope.$apply();
            },
            error: function(resp) {
                console.log('Assign ko ok')
            }
        });
        var message = "User " + username + " has refused the invitation";
        await sendAPINoti(message, "task" + projectID, projectID, -1);
    }

    let hostTien = "http://103.160.2.51:8080/pmf/pmf/project";
    $scope.load_all_ac_mem = function(pid) {
        var url = `${hostTien}/` + pid + `/ac-members`;
        $http.get(url).then(resp => {
            $scope.ac_members = resp.data;
        }).catch(error => {
            console.log("Error", error);
        });
    };

    $scope.load_all_mem = function(pid) {
        var url = `${hostTien}/` + pid + `/members`;
        $http.get(url).then(resp => {
            $scope.members = resp.data;
        }).catch(error => {
            console.log("Error", error);
        });
    };

    $scope.load_all_subtask = async function(pid) {
        var url = `${hostTien}/${pid}/subtask-all`;
        await $http.get(url).then(resp => {
            $scope.subtasks = resp.data;
        }).catch(error => {
            console.log("Error", error);
        });
    };

    $scope.load_all_task_assigned = function(pid) {
        var url = `${hostTien}/${pid}/task-assigned`;
        $http.get(url).then(resp => {
            $scope.act_task = resp.data;
        }).catch(error => {
            console.log("Error", error);
        });
    };

    $scope.load_all_subtask_assigned = function(pid) {
        var url = `${hostTien}/${pid}/subtask-assigned`;
        $http.get(url).then(resp => {
            $scope.act_subtask = resp.data;
        }).catch(error => {
            console.log("Error", error);
        });
    };

    $scope.getTaskID = async function(subid) {
        var taskID = -1;
        await $scope.subtasks.forEach(function(item) {
            if (item.subID == subid) {
                taskID = item.task.taskID;
                return;
            }
        })
        return taskID;
    }

    $scope.arrange_task_assigned = function(tid) {
        var worker = [];
        try {
            $scope.act_task.forEach(function(item) {
                if (item.objectID == tid) {
                    worker = item;
                }
            });
        } catch (err) {

        }
        return worker;

    }

    $scope.arrange_subtask_assigned = function(subid) {
        var worker = [];
        try {
            $scope.act_subtask.forEach(function(item) {
                if (item.objectID == subid) {
                    worker = item;
                }
            })
        } catch (err) {

        }
        return worker;

    }

    $scope.check_role_member = function() {
        var user = [];
        try {
            $scope.members.forEach(function(item) {
                if (item.account.username == username) {
                    user = item;
                    return;
                }
            })
        } catch (err) {

        }
        return user;
    }
    }
})

app.controller("homeController", ($scope, $http, $timeout, $interval) => {
    let host = "http://103.160.2.51:8080/pmf/pmf/Home";

    //Lay gia tri so luong task da hoan thanh cua user
    $scope.countTask_completed = async function() {
        var url = `http://103.160.2.51:8080/pmf/pmf/Report/countTask/${username}/4`;
        $scope.completedTask = (await $http.get(url)).data;
    };

    //Lay ho va ten cua user
    $scope.load_fullname = function() {
        var url = `${host}/helloName/${username}`;
        $http.get(url).then(resp => {
            $scope.fullname = resp.data;
        }).catch(error => {
            console.log("fullname Error", error);
        });
    };

    
    $scope.projectActivePercent = 0
    $scope.projectUnactivePercent = 0
    $scope.taskHighPercent = 0
    $scope.taskMediumPercent = 0
    $scope.taskLowPercent = 0
        //Hien thi so luong project cua user theo statusID
    $scope.load_projectData = async function() {
        var url1 = `${host}/showProject/${username}/1`;
        var url2 = `${host}/showProject/${username}/2`;

        $scope.projectActiveData = (await $http.get(url1)).data
        $scope.projectUnactiveData = (await $http.get(url2)).data

        let allProjectPercent = $scope.projectActiveData.length + $scope.projectUnactiveData.length
        $scope.projectActivePercent = $scope.projectActiveData.length * 100 / allProjectPercent
        $scope.projectUnactivePercent = $scope.projectUnactiveData.length * 100 / allProjectPercent
    };

    $scope.redirectToProject = (projectID) => {
        sessionStorage.getItem("p1", projectID)
        window.location.href = "http://103.160.2.51:8080/projectmanagement/template/client/task.html"
    }

    //Hien thi so luong task cua user theo priorityID
    $scope.load_taskData = async function() {
        var url1 = `${host}/showTask/${username}/1`;
        var url2 = `${host}/showTask/${username}/2`;
        var url3 = `${host}/showTask/${username}/3`;


        $scope.taskHighData = (await $http.get(url1)).data
        $scope.taskMediumData = (await $http.get(url2)).data
        $scope.taskLowData = (await $http.get(url3)).data




        let allTaskPercent = $scope.taskHighData.length + $scope.taskMediumData.length + $scope.taskLowData.length
        $scope.taskHighPercent = $scope.taskHighData.length * 100 / allTaskPercent
        $scope.taskMediumPercent = $scope.taskMediumData.length * 100 / allTaskPercent
        $scope.taskLowPercent = $scope.taskLowData.length * 100 / allTaskPercent

    };

    $scope.load_taskData();
    $scope.load_fullname();
    $scope.countTask_completed();
    $scope.load_projectData();
    $scope.helloUser = helloUser();
    let date = new Date()
    let days = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
    ];
    let months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];
    $scope.dateNow = `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}!!`
})

//REPORT CONTROLLER
app.controller("reportController", function($scope, $http, $timeout) {
    const ctx3 = document.getElementById("chart-column-custom").getContext("2d");
    const ctx = document.getElementById("chart-line-custom").getContext("2d");

    let host = "http://103.160.2.51:8080/pmf/pmf/Report";
    $scope.data_barChart = [];
    $scope.data_lineChart = [];

    //Lay gia tri so luong task da hoan thanh cua user
    $scope.countTask = async function(id) {
        var url = `${host}/countTask/${username}/${id}`;
        await $http.get(url).then(resp => {
            if (id == 4) {
                $scope.completedTask = resp.data;
                $scope.completed_of_total = $scope.valueOfPart($scope.completedTask);
                console.log("completedTask Sucess", resp);
            } else if (id == 1) {
                $scope.incompleteTask = resp.data;
                $scope.incomplete_of_total = $scope.valueOfPart($scope.incompleteTask);
                console.log("completedTask Sucess", resp);
            } else if (id == 3) {
                $scope.highTask = resp.data;
                $scope.high_of_total = $scope.valueOfPart($scope.highTask);
                console.log("completedTask Sucess", resp);
            }
        }).catch(error => {
            console.log("completedTask Error", error);
        });
    };

    //Lay gia tri tong so luong task cua user
    $scope.totalTask = function() {
        var url1 = `${host}/totalTask/${username}`;

        $http.get(url1).then(resp => {
            $scope.taskTotal = resp.data;
            console.log("taskTotal Sucess", resp);
        }).catch(error => {
            console.log("taskTotal Error", error);
        });

        var url2 = `${host}/countProject/${username}`;
        $http.get(url2).then(resp => {
            $scope.projectTotal = resp.data;
            console.log("projectTotal Sucess", resp);
        }).catch(error => {
            console.log("projectTotal Error", error);
        });
    };

    //Tinh phan tram so luong task trong tong cac task
    $scope.valueOfPart = function(value) {
        return Math.round((value * 100) / $scope.taskTotal);
    };

    //CHART SECOND
    $scope.line_chart = async function() {

        nameLabelLine = [];
        valueLabelLine = [];

        $scope.hotName = (await $http.get(`${host}/showHotProjectName/${username}`)).data;
        $scope.hotData = (await $http.get(`${host}/showHotProject/${username}`)).data;

        nameLabelLine = $scope.hotName;
        valueLabelLine = $scope.hotData;

        const myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: nameLabelLine,
                datasets: [{
                    label: 'Task',
                    backgroundColor: 'rgb(255,255,225,1)',
                    borderColor: 'rgb(96,117,225)',
                    data: valueLabelLine,
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                        }
                    }]
                }
            },
        });
    }

    //CHART THIRTH
    $scope.chartThirth = async function() {

        var i = 0;
        project = [];
        $scope.total = (await $http.get(`${host}/totalTask/${username}`)).data;
        $scope.project = (await $http.get(`${host}/countTaskInProject/${username}`)).data;

        for (i; i < $scope.project.length; i++) {
            var data = Math.round(($scope.project[i].value / $scope.total) * 100);
            element = {
                name: $scope.project[i].name,
                y: data,
            }
            project.push(element);
        }
        $scope.datePre = new Date();

        Highcharts.chart('container1', {
            chart: {
                type: 'pie'
            },
            title: {
                text: 'Percent Of Task In Each Project. '
            },
            subtitle: {
                text: $scope.datePre
            },

            accessibility: {
                announceNewData: {
                    enabled: true
                },
                point: {
                    valueSuffix: '%'
                }
            },

            plotOptions: {
                series: {
                    dataLabels: {
                        enabled: true,
                        format: '{point.name}: {point.y:.1f}%'
                    }
                }
            },

            tooltip: {
                headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
            },

            series: [{
                name: "Browsers",
                colorByPoint: true,
                data: project,
            }],

        });
    }

    //CHART FOURTH
    $scope.chartFourth = async function() {

        projectName = [];
        priorityHighData = [];
        priorityMediumData = [];
        priorityLowData = [];

        $scope.projectName = (await $http.get(`${host}/showProjectName/${username}`)).data;
        $scope.priorityHighData = (await $http.get(`${host}/countTask_Priority/${username}/1`)).data;
        $scope.priorityMediumData = (await $http.get(`${host}/countTask_Priority/${username}/2`)).data;
        $scope.priorityLowData = (await $http.get(`${host}/countTask_Priority/${username}/3`)).data;

        projectName = $scope.projectName;
        priorityHighData = $scope.priorityHighData;
        priorityMediumData = $scope.priorityMediumData;
        priorityLowData = $scope.priorityLowData;

        console.log("Low ", priorityLowData);
        console.log("High ", priorityHighData);

        Highcharts.chart('container2', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Priority Average Task'
            },
            subtitle: {
                text: 'Source: WorldClimate.com'
            },
            xAxis: {
                categories: projectName,
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Task'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:.1f} task</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            series: [{
                color: 'rgba(15,52,96,255)',
                name: 'High',
                data: priorityHighData,

            }, {
                color: 'rgb(30,129,176)',
                name: 'Medium',
                data: priorityMediumData,

            }, {
                color: 'rgb(171,219,227)',
                name: 'Low',
                data: priorityLowData,

            }]
        });
    }

    //Bieu do cot
    $scope.bar_chart = async function() {

        valueLabelBar = [];

        $scope.activePr = (await $http.get(`${host}/countProjectStatus/${username}/1`)).data;
        $scope.unactivePr = (await $http.get(`${host}/countProjectStatus/${username}/2`)).data;
        $scope.totalPr = $scope.activePr + $scope.unactivePr;
        $scope.active = Math.round(($scope.activePr * 100) / $scope.projectTotal);

        valueLabelBar.push($scope.totalPr);
        valueLabelBar.push($scope.activePr);
        valueLabelBar.push($scope.unactivePr);

        const myChart3 = new Chart(ctx3, {
            type: 'bar',
            data: {
                labels: ['Total', 'Active', 'Unactive'],
                datasets: [{
                    label: 'Project',
                    backgroundColor: 'rgb(96,117,225)',
                    borderColor: 'rgb(96,117,225)',
                    data: valueLabelBar,
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                        }
                    }]
                }
            },
        });
    }

    $scope.runReport = async function() {
        $scope.totalTask();
        $scope.countTask(4);
        $scope.countTask(1);
        $scope.countTask(3);
        $scope.chartFourth();
        $scope.chartThirth();
        $scope.bar_chart();
        $scope.line_chart();
    }
    $scope.runReport();
})
app.controller("projectController", function($scope, $http) {
    let host = "http://103.160.2.51:8080/pmf/pmf/project";
    $scope.load_all_security = function() {
        var url = `${host}/project-security`;
        $http.get(url).then(resp => {
            $scope.security = resp.data;
            console.log("Sucess", resp);
        }).catch(error => {
            console.log("Error", error);
        });
    };

    $scope.load_all_pj = async function() {
        var url = `http://103.160.2.51:8080/pmf/pmf/Project/getAllProjectsRelevantToAccount/${username}`;
        await $http.get(url).then(resp => {
            $scope.pjs = resp.data;
            console.log("Sucess", resp);
        }).catch(error => {
            console.log("Error", error);
        });
    };


    $scope.check_pj_name = function(name) {
        var check = true;
        $scope.pjs.forEach(function(item) {
            if (item.projectName == name) {
                check = false;
                return;
            }
        })

        return check;
    }
    $scope.load_all_security();

    $scope.create_project = async function() {
        var urll = `${host}/project-create`;

        await $scope.load_all_pj();
        alert($scope.pjs.length)
        var check = await $scope.check_pj_name($scope.project_name);
        if (check == false) {
            alert("Tên dự án đã tồn tại");
            return;
        }
        var infor = [$scope.project_name, $scope.team_name, $scope.selected_security, username];
        $.ajax({
            url: urll,
            type: 'POST',
            contentType: "application/json",
            data: JSON.stringify(infor),
            success: function(res) {
                sessionStorage.setItem("pi", res.projectID);
                location.replace("http://103.160.2.51:8080/projectmanagement/template/client/task.html");
            },
            error: function(resp) {
                console.log(JSON.stringify(infor));
                console.log('ga qua ban oi')
            }
        });
    }


})
app.controller("taskController", function($scope, $http, $compile, $rootScope, $timeout) {
    let host = "http://103.160.2.51:8080/pmf/pmf/project";
    $rootScope.project = [];
    $scope.user_assigned = [];
    $scope.pi = sessionStorage.getItem("pi");

    firestore.collection("task" + sessionStorage.getItem("pi")).onSnapshot(function(snapshot) {
        if (firsttime_task === true) {
            firsttime_task = false;
            return;
        }
        snapshot.docChanges().forEach(async function(change) {
            if (change.type === "added") {
                var notification = change.doc.data();
                if(notification.message.includes("has been shut down by Project Owner") === true){
                    var pj = await $scope.findOneProject(notification.projectID);
                    sendNotification(notification.title + "<br>" + " Project: " + pj.projectName + "", notification.message, notification.createdTime);
                    var check = await $rootScope.checkAuthorization(notification.projectID);
                    if(check === false){
                        setTimeout(function() {
                            window.location.href = "http://103.160.2.51:8080/projectmanagement/template/client/home.html"
                        }, 4000);
                    }
                    return;
                }
                if(notification.message.includes("has been active by Project Owner") === true){
                    var pj = await $scope.findOneProject(notification.projectID);
                    await $rootScope.load_all_project();
                    sendNotification(notification.title + "<br>" + " Project: " + pj.projectName + "", notification.message, notification.createdTime);
                    return;
                }
                await $scope.load_all_mem();
                await $scope.load_all_ac_mem();
                await $scope.load_all_section();
                await $scope.load_all_task();
                $scope.$apply();
                await $scope.load_all_task_assigned();
                await $scope.load_all_subtask();
                await $scope.load_all_subtask_assigned();
                if (notification.taskID !== -1) {
                    await $scope.load_spec_subtask(notification.taskID);
                    await $scope.load_all_comment(notification.taskID)
                    $scope.$apply();
                    $scope.task = await $scope.findOneTask(notification.taskID);
                    $scope.$apply();
                    await $scope.prepareProcessBarModal();
                }
                load_page();
                // if($("#taskModal").data('bs.modal')?._isShown === true){
                //   await $scope.openModal(notification.taskID);
                // }       
                if (notification.message.length > 0) {
                    var pj = await $scope.findOneProject(notification.projectID);
                    sendNotification(notification.title + "<br>" + " Project: " + pj.projectName + "", notification.message, notification.createdTime);
                }
            }
            if (change.type === "modified") {

            }
            if (change.type === "removed") {

            }
        });
    });

    //Lay ho va ten cua user
    $scope.load_user = function() {
        var url = `http://103.160.2.51:8080/pmf/pmf/account/getFindOne/${username}`;
        $http.get(url).then(resp => {
            $scope.user = resp.data;
        }).catch(error => {
            console.log("fullname Error", error);
        });
    };

    $rootScope.$on("CallParentMethod", async function() {

        await $scope.load_all_subtask();
        await $scope.load_all_ac_mem();
        await $scope.load_all_mem();
        await $scope.load_all_task_assigned();
        await $scope.load_all_subtask_assigned();
    });
    $scope.load_all_ac_mem = function() {
        var url = `${host}/` + sessionStorage.getItem("pi") + `/ac-members`;
        $http.get(url).then(resp => {
            $scope.ac_members = resp.data;
        }).catch(error => {
            console.log("Error", error);
        });
    };


    $scope.load_all_mem = function() {
        var url = `${host}/` + sessionStorage.getItem("pi") + `/members`;
        $http.get(url).then(resp => {
            $scope.members = resp.data;
        }).catch(error => {
            console.log("Error", error);
        });
    };

    $scope.load_all_task = function() {
        var url = `${host}/` + $scope.pi + `/task-all`;
        $http.get(url).then(resp => {
            $scope.tasks = configurationDeadline(resp.data);
        }).catch(error => {
            console.log("Error", error);
        });
    };

    $scope.load_all_subtask = async function() {
        var url = `${host}/${$scope.pi}/subtask-all`;
        await $http.get(url).then(resp => {
            $scope.subtasks = resp.data;
        }).catch(error => {
            console.log("Error", error);
        });
    };

    $scope.load_all_pj = async function() {
        var url = `http://103.160.2.51:8080/pmf/pmf/Project/getAllProjectsRelevantToAccount/${username}`;
        await $http.get(url).then(resp => {
            $scope.pjs = resp.data;
            projects = resp.data;
        }).catch(error => {
            console.log("Error", error);
        });
    };

    $scope.findOneProject = function(pid) {
        var pj = null;
        try {
            $scope.pjs.forEach(function(item) {
                if (item.projectID == pid) {
                    pj = item;
                    return;
                }
            });
        } catch (err) {

        }
        return pj;
    }
    $scope.findOneTask = function(taskID) {
        var task = null;
        try {
            $scope.tasks.forEach(function(item) {
                if (item.taskID == taskID) {
                    task = item;
                    return;
                }
            });
        } catch (err) {

        }
        return task;
    }

    $scope.findOneSubTask = function(subID) {
        var task = null;
        try {
            $scope.subtasks.forEach(function(item) {
                if (item.subID == subID) {
                    task = item;
                    return;
                }
            });
        } catch (err) {

        }
        return task;
    }
    $scope.load_all_section = function() {
        var url = `${host}/` + $scope.pi + `/section-all`;
        $http.get(url).then(resp => {
            $scope.sections = resp.data;
            $rootScope.project = resp.data[0].project;
        }).catch(error => {
            console.log("Error", error);
        });
    };

    

    $scope.load_all_task_priority = function() {
        var url = `${host}/task-priority`;
        $http.get(url).then(resp => {
            $scope.tasks_priority = resp.data;
        }).catch(error => {
            console.log("Error", error);
        });
    };

    $scope.load_all_task_status = function() {
        var url = `${host}/task-status`;
        $http.get(url).then(resp => {
            $scope.tasks_status = resp.data;
        }).catch(error => {
            console.log("Error", error);
        });
    };


    $scope.load_all_task_assigned = function() {
        var url = `${host}/${sessionStorage.getItem("pi")}/task-assigned`;
        $http.get(url).then(resp => {
            $scope.act_task = resp.data;
        }).catch(error => {
            console.log("Error", error);
        });
    };

    $scope.load_all_subtask_assigned = function() {
        var url = `${host}/${sessionStorage.getItem("pi")}/subtask-assigned`;
        $http.get(url).then(resp => {
            $scope.act_subtask = resp.data;
        }).catch(error => {
            console.log("Error", error);
        });
    };

    $scope.check_if_in_project = async function(username) {
        var check = false;
        try {
            await $scope.members.forEach(function(item) {
                if (item.username == username) {
                    check = true;
                    return;
                }
            })
        } catch (err) {

        }
        return check;
    }
    $scope.arrange_task_assigned = function(tid) {
        var worker = [];
        try {
            $scope.act_task.forEach(async function(item) {
                if (item.objectID == tid) {
                    worker = item;
                    return;
                }
            })
        } catch (err) {

        }
        return worker;

    }

    $scope.arrange_subtask_assigned = function(subid) {
        var worker = [];
        try {
            $scope.act_subtask.forEach(async function(item) {
                if (item.objectID == subid) {
                    worker = item;
                    if (await $scope.check_if_in_project(item.username) === false) {
                        worker = [];
                        return;
                    }
                    return;
                }
            })
        } catch (err) {

        }
        return worker;

    }

    $scope.get_the_owner = function() {
        var user = [];
        try {
            $scope.members.forEach(function(item) {
                if (item.team_role.roleID == 1) {
                    user = item;
                    return;
                }
            })
        } catch (err) {

        }
        return user;;
    }

    $scope.check_role_member = function() {
        var user = [];
        try {
            $scope.members.forEach(function(item) {
                if (item.account.username == username) {
                    user = item;
                    return;
                }
            })
        } catch (err) {

        }
        return user;

    }

    $rootScope.check_all_role_member = async function() {
        var user = [];
        try {
            await $scope.members.forEach(function(item) {
                if (item.account.username == username) {
                    user = item;
                    return;
                }
            })
        } catch (err) {

        }
        return user;

    }

    $scope.load_spec_subtask = async function(taskID) {
        $scope.spec_subtask = [];
        try {
            await $scope.subtasks.forEach(function(item) {
                if (item.task.taskID == taskID) {
                    $scope.spec_subtask.push(item);

                }
            })

        } catch (err) {

        }

        $scope.prepareProcessBarModal();
    }

    $scope.load_all_comment = async function(tid) {
        var url = `${host}/` + $scope.pi + `/${tid}/comments`;
        await $http.get(url).then(resp => {
            $scope.comments = configuration(resp.data);
        }).catch(error => {
            console.log("Error", error);
        });
    };

    $scope.load_all_act_one_task = async function(tid) {
        var url = `${host}/` + $scope.pi + `/${tid}/activities-one-task`;
        await $http.get(url).then(resp => {
            $scope.act_one_task = configuration(resp.data);
        }).catch(error => {
            console.log("Error", error);
        });
    };

    $scope.load_all_section();
    $scope.load_all_task();
    $scope.load_all_subtask();
    $scope.load_all_task_priority();
    $scope.load_all_task_status();

    $scope.load_user();
    $scope.load_all_ac_mem();
    $scope.load_all_mem();
    $scope.load_all_task_assigned();
    $scope.load_all_subtask_assigned();
    $scope.load_all_pj();
    $scope.display_subtask = function(taskID) {
        var newSubTask = [];
        var check = false;
        try {
            $scope.subtasks.forEach(function(item) {
                if (item.task.taskID == taskID) newSubTask.push(item);
            })

            if (newSubTask.length == 0) return check;

            newSubTask.forEach(function(item) {
                var sub = $scope.arrange_subtask_assigned(item.subID);

                if (sub.activity_category.categoryID == 12 && sub.username == username) {
                    check = true;
                    return;
                }
            })
        } catch (err) {

        }
        return check;

    }



    $scope.create_project = function() {
        location.replace("http://103.160.2.51:8080/projectmanagement/template/client/createProject/createProject_2.html");
    }



    //handle drag and drop tasks update
    $scope.handle_tasks_drop = async function(positions) {

        var index_task = 0;
        var index_section = 0;
        await positions.forEach(function(p) {
            index_task = $scope.tasks.findIndex(tk => tk.taskID == parseInt(p[0]) && tk.section.sectionID == parseInt(p[2]));
            index_section = $scope.sections.findIndex(sec => sec.sectionID == parseInt(p[2]));
            $scope.tasks[index_task].taskNumber = parseInt(p[1]);
            $scope.tasks[index_task] = angular.copy($scope.tasks[index_task])
            $scope.sections[index_section] = angular.copy($scope.sections[index_section])
        })

        $scope.sections.sort(function(a, b) { return a.sectionNumber - b.sectionNumber });
        $scope.tasks.sort(function(a, b) { return a.taskNumber - b.taskNumber });
        $scope.$apply();
        await sendAPINoti("", "task" + sessionStorage.getItem("pi"), parseInt(sessionStorage.getItem("pi")), "");
    }

    //handle drag and drop 1 task update
    $scope.handle_task_drop = async function(positions) {

            var index_task = $scope.tasks.findIndex(tk => tk.taskID == parseInt(positions[0][0]));
            var index_section = $scope.sections.findIndex(sec => sec.sectionID == parseInt(positions[0][3]));
            var section_new = angular.copy($scope.sections[index_section]);
            var old_section_id = parseInt(positions[0][2])
            var position = parseInt(positions[0][1]);
            var new_section_id = parseInt(positions[0][3]);


            var check_exist = $scope.tasks.findIndex(tk => tk.taskNumber == position && tk.section.sectionID == new_section_id);
            if (check_exist != -1) {
                await $scope.tasks.forEach(function(tk) {
                    if (tk.section.sectionID == new_section_id &&
                        tk.taskNumber >= position) {
                        tk.taskNumber = tk.taskNumber + 1;
                    }
                })
            }
            $scope.tasks[index_task].section = section_new;
            $scope.tasks[index_task].taskNumber = parseInt(positions[0][1]);




            $scope.tasks[index_task] = angular.copy($scope.tasks[index_task]);
            var index_task_old = $scope.sections.findIndex(sec => sec.sectionID == old_section_id);
            var index_task_new = $scope.sections.findIndex(sec => sec.sectionID == new_section_id);

            $scope.$apply();
            messageForMoveTaskToAnotherSection = "Task " + $scope.tasks[index_task].taskName +
                " has been moved from section " + $scope.sections[index_task_old].sectionName + " to section " + $scope.sections[index_task_new].sectionName
            await sendAPINoti(messageForMoveTaskToAnotherSection, "task" + sessionStorage.getItem("pi"), $scope.tasks[index_task].projectID, $scope.tasks[index_task].taskID);
        }
        //handle drag and drop sections update
    $scope.handle_sections_drop = async function(positions) {
        var index_section = 0;
        var index_task = [];
        positions.forEach(function(p) {
            index_section = $scope.sections.findIndex(sec => sec.sectionID == parseInt(p[0]));
            index_task = $scope.tasks.find(tk => tk.section.sectionID == parseInt(p[0]));
            $scope.sections[index_section].sectionNumber = parseInt(p[1]);
            $scope.sections[index_section] = angular.copy($scope.sections[index_section]);
            $scope.tasks.forEach(function(tk) {
                if (tk.section.sectionID == p[0]) {
                    tk.section = angular.copy($scope.sections[index_section]);
                }
            })

        })


        $scope.tasks.sort(function(a, b) { return a.taskNumber - b.taskNumber });
        $scope.sections.sort(function(a, b) { return a.sectionNumber - b.sectionNumber });

        $scope.$apply();
        await sendAPINoti("", "task" + sessionStorage.getItem("pi"), parseInt(sessionStorage.getItem("pi")), "");
    }

    $scope.prepareProcessBarModal = function() {
        // get box count
        var count = 0;
        var checked = 0;

        function countBoxes() {
            count = $(".process-checkbox").length;
            console.log(count);
        }

        countBoxes();
        $(".process-checkbox").click(countBoxes);

        // count checks

        function countChecked() {
            checked = $(".process-checkbox:checked").length;

            var percentage = parseInt(((checked / count) * 100), 10);
            // $(".progressbar-bar").progressbar({
            //     value: percentage
            // });
            $scope.valueForProgressBar = percentage;
            var gb = document.getElementById("progress-bar");
            gb.style.width = percentage + "%";
        }

        countChecked();

        $(".process-checkbox").off('click').click(async function(event) {
            var sub = await $scope.arrange_subtask_assigned(parseInt($(this).attr('id')));
            var val = $(this).val() == 'true' ? 0 : 1;
            var infor = [parseInt($(this).attr('id')), val];

            if ($scope.check_role_member().team_role.roleID != 1) {
                if (sub.length == 0) {
                    alert('Access denied !');
                    setTimeout(function() {
                        $(this).removeAttr('checked');
                    }, 0);

                    event.preventDefault();
                    event.stopPropagation();
                    return;
                }

                if (!(sub.activity_category.categoryID == 13 && sub.username == username)) {
                    alert('Access denied !');
                    setTimeout(function() {
                        $(this).removeAttr('checked');
                    }, 0);

                    event.preventDefault();
                    event.stopPropagation();
                    return;
                }
            }
            var subtask = await $scope.findOneSubTask(infor[0]);


            var st = $(this).val() == 'false' ? "check" : "uncheck";
            var message1 = "Do you want " + st + " the subtask " + subtask.discription + " ?";
            $scope.openConfirmModal(message1, "");
            var $bar = $(this);

            event.preventDefault();
            event.stopPropagation();
            $('#confirm').off('click').on('click', async function() {
                $('#confirmModal').modal("hide");
                await $.ajax({
                    url: 'http://103.160.2.51:8080/pmf/pmf/project/subtask-check',
                    type: 'PUT',
                    contentType: "application/json",
                    data: JSON.stringify(infor),
                    success: function(res) {

                    },
                    error: function(resp) {
                        console.log('CHUYEN TASK KO OK')
                    }
                });

                var task = await $scope.findOneTask(parseInt($bar.attr('data-task-id')))
                await $scope.load_all_subtask();
                await $scope.load_spec_subtask(parseInt($bar.attr('data-task-id')));
                $scope.$apply();
                await $scope.prepareProcessBarModal();
                countChecked();
                sendNotification("The Sub task " + subtask.discription, "Successful change", new Date());
                await sendAPINoti("", "task" + sessionStorage.getItem("pi"), task.projectID, task.taskID);

            })

            $('#disconfirm,#disconfirmicon').off('click').on('click', function() {
                $('#confirmModal').modal("hide");
            })

        });

    }


    $scope.openModal = function(taskID) {
        var index = $scope.tasks.findIndex(tk => tk.taskID == taskID);
        $scope.task = $scope.tasks[index];

        //Khởi chạy data cho phần download của Hùng
        taskID_for_file = $scope.task.taskID;
        projectID_for_file = $scope.task.projectID;
        deadline_for_file = $scope.task.plannedEndDate;
        $scope.load_list_file($scope.task.projectID, $scope.task.taskID);
        sessionStorage.setItem("taskID",$scope.task.taskID);
        $scope.openCommentModal($scope.task.taskID);
        $scope.openActModal($scope.task.taskID)
            //Het

        if ($scope.task.plannedStartDate == null) {
            $("#start-date-modal").val("")
            $("#end-date-modal").prop("min", $("#start-date-modal").val());
        } else {
            const d = new Date($scope.task.plannedStartDate)
            $("#start-date-modal").val(new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().substring(0, 16));
            $("#end-date-modal").prop("min", $("#start-date-modal").val());
        }

        if ($scope.task.plannedEndDate == null) {
            $("#end-date-modal").val("")
        } else {
            const d = new Date($scope.task.plannedEndDate)
            $("#end-date-modal").val(new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().substring(0, 16));
        }

        var startDate = $("#start-date-modal").val();
        var endDate = $("#end-date-modal").val();
        $("#start-date-modal").off('change').change(async function() {

            var message1 = "You are changing Start date to ";
            var message2 = $("#start-date-modal").val().replace("T", " ");
            $scope.openConfirmModal(message1, message2);
            $('#confirm').off('click').on('click', async function() {
                startDate = $("#start-date-modal").val();
                $('#confirmModal').modal("hide");
                $scope.task.plannedStartDate = new Date(startDate);
                $scope.task.plannedEndDate = null;
                await $.ajax({
                    url: `http://103.160.2.51:8080/pmf/pmf/project/16/${username}/update-one-task`,
                    type: 'PUT',
                    contentType: "application/json",
                    data: JSON.stringify($scope.task),
                    success: function(res) {
                        $scope.$apply();
                    },
                    error: function(resp) {
                        console.log('CHUYEN TASK KO OK')
                    }
                });

                $("#end-date-modal").prop("min", $("#start-date-modal").val());
                $("#end-date-modal").val("");
                endDate = $("#end-date-modal").val(); //clear end date input when start date changes
                sendNotification($scope.task.taskName, "Successful change", new Date());
                await sendAPINoti("", "task" + sessionStorage.getItem("pi"), $scope.task.projectID, $scope.task.taskID);
            })

            $('#disconfirm,#disconfirmicon').off('click').on('click', function() {
                $("#start-date-modal").val(startDate);
                $('#confirmModal').modal("hide");
            })
        });
        $("#end-date-modal").off('change').change(async function(e) {
            if (startDate === "") {
                $("#end-date-modal").val("")
                sendNotification($scope.task.taskName, "Need to set Start date", new Date());
                return;
            }
            var message1 = "You are changing End date to ";
            var message2 = $("#end-date-modal").val().replace("T", " ");
            $scope.openConfirmModal(message1, message2);
            $('#confirm').off('click').on('click', async function() {
                endDate = $("#end-date-modal").val();
                $('#confirmModal').modal("hide");
                $scope.task.plannedEndDate = new Date(endDate);
                $scope.tasks[index].deadline = timeDeadline($scope.tasks[index].task_status.statusID, $scope.tasks[index].plannedStartDate, $scope.tasks[index].plannedEndDate);
                await $.ajax({
                    url: `http://103.160.2.51:8080/pmf/pmf/project/17/${username}/update-one-task`,
                    type: 'PUT',
                    contentType: "application/json",
                    data: JSON.stringify($scope.task),
                    success: function(res) {
                        $scope.$apply();
                    },
                    error: function(resp) {
                        console.log('CHUYEN TASK KO OK')
                    }
                });
                sendNotification($scope.task.taskName, "Successful change", new Date());
                await sendAPINoti("", "task" + sessionStorage.getItem("pi"), $scope.task.projectID, $scope.task.taskID);
            })

            $('#disconfirm,#disconfirmicon').off('click').on('click', function() {
                $("#end-date-modal").val(endDate);
                $('#confirmModal').modal("hide");
            })
        });
        $scope.load_spec_subtask(taskID);
        $('#taskModal').modal('show');

    }

    $scope.openConfirmModal = function(message1, message2) {
        $('#confirmModal').modal({ backdrop: 'static', keyboard: false });
        $('#confirmForm').val('');
        $('#confirmModal').modal("show");
        $('#titleConfirm1').text(message1);
        $('#titleConfirm2').text(message2);
    }

    $scope.pushTaskElement = async function(task, element) {
        $scope.tasks.push(task);
        $(element).remove();
        $scope.$apply();
        messageForMoveTaskToAnotherSection = "Task " + task.taskName + " has been created";
        await sendAPINoti(messageForMoveTaskToAnotherSection, "task" + sessionStorage.getItem("pi"), task.projectID, task.taskID);
    }


    $scope.pushSectionElement = async function(section, element) {
        $scope.sections.push(section);
        $scope.$apply();
        messageForMoveTaskToAnotherSection = "Section " + section.sectionName + " has been created";
        await sendAPINoti(messageForMoveTaskToAnotherSection, "task" + sessionStorage.getItem("pi"), parseInt(sessionStorage.getItem("pi")), "");
    }


    // $scope.delete_section = async function(section_id) {
    //     var index_section = $scope.sections.findIndex(sec => sec.sectionID == section_id);
    //     messageForMoveTaskToAnotherSection = "Section " + $scope.sections[index_section].sectionName + " has been deleted";
    //     $scope.sections.splice(index_section, 1);


    //     $scope.task_deleted = $scope.tasks;
    //     console.log($scope.tasks)
    //     console.log($scope.task_deleted)
    //     $scope.tasks.forEach(function(item) {
    //         if (item.section.sectionID == section_id) {

    //             $scope.tasks.splice($scope.tasks.indexOf(item), 1);
    //             console.log(item)
    //         }
    //     })


    //     console.log($scope.task_deleted)
    //     $scope.sections.sort(function(a, b) { return a.sectionNumber - b.sectionNumber });
    //     $scope.tasks.sort(function(a, b) { return a.taskNumber - b.taskNumber });
    //     $scope.$apply();

    //     await sendAPINoti(messageForMoveTaskToAnotherSection, "task" + sessionStorage.getItem("pi"), parseInt(sessionStorage.getItem("pi")), "");
    // }

    //for button
    $scope.change_section = async function(section, task) {
        var index_task = $scope.tasks.findIndex(tk => tk.taskID == task.taskID);
        var old_section_id = $scope.tasks[index_task].section.sectionID;
        var old_position = $scope.tasks[index_task].taskNumber;
        var new_section_id = section.sectionID;

        $scope.tasks.forEach(function(tk) {
            if (tk.section.sectionID == old_section_id && tk.taskNumber > old_position) {
                tk.taskNumber = tk.taskNumber - 1;
            } else if (tk.section.sectionID == new_section_id) {
                tk.taskNumber = tk.taskNumber + 1;
            }
        })

        $scope.tasks[index_task].section = section;
        $scope.tasks[index_task].taskNumber = 1;

        var index_task_old = $scope.sections.findIndex(sec => sec.sectionID == old_section_id);
        var index_task_new = $scope.sections.findIndex(sec => sec.sectionID == new_section_id);
        $scope.sections[index_task_old] = angular.copy($scope.sections[index_task_old])
        $scope.sections[index_task_new] = angular.copy($scope.sections[index_task_new])


        $scope.tasks.sort(function(a, b) { return a.taskNumber - b.taskNumber });

        await $.ajax({
            url: 'http://103.160.2.51:8080/pmf/pmf/project/task-update-btn',
            type: 'PUT',
            contentType: "application/json",
            data: JSON.stringify($scope.tasks),
            success: function(res) {
                console.log('CHUYEN TASK OK')
            },
            error: function(resp) {
                console.log('CHUYEN TASK KO OK')
            }
        });
        $scope.$apply();
        messageForMoveTaskToAnotherSection = "Task " + $scope.tasks[index_task].taskName +
            " has been moved from section " + $scope.sections[index_task_old].sectionName + " to section " + $scope.sections[index_task_new].sectionName
        await sendAPINoti(messageForMoveTaskToAnotherSection, "task" + sessionStorage.getItem("pi"), $scope.tasks[index_task].projectID, $scope.tasks[index_task].taskID);
    }

    $scope.change_section_name = function(id, name) {
        var index_section = $scope.sections.findIndex(sec => sec.sectionID == id);
        $scope.sections[index_section].sectionName = name;
        $scope.tasks.forEach(function(task) {
            if (task.section.sectionID == id) {
                task.section = angular.copy($scope.sections[index_section]);
            }
        })
        $scope.$apply();
    }

    $scope.change_priority = async function(priority, task) {
        var index_pr = $scope.tasks_priority.findIndex(pr => pr.priorityID == priority.priorityID);
        var index_task = $scope.tasks.findIndex(tk => tk.taskID == task.taskID);
        var message1 = "You are changing Priority to ";
        var message2 = $scope.tasks_priority[index_pr].priorityName;
        $scope.openConfirmModal(message1, message2);

        $('#confirm').off('click').on('click', async function() {
            $('#confirmModal').modal("hide");
            $scope.tasks[index_task].task_priority = $scope.tasks_priority[index_pr];

            await $.ajax({
                url: `http://103.160.2.51:8080/pmf/pmf/project/18/${username}/update-one-task`,
                type: 'PUT',
                contentType: "application/json",
                data: JSON.stringify($scope.tasks[index_task]),
                success: function(res) {

                },
                error: function(resp) {
                    console.log('CHUYEN TASK KO OK')
                }
            });
            $scope.$apply();
            sendNotification($scope.task.taskName, "Successful change", new Date());
            await sendAPINoti("", "task" + sessionStorage.getItem("pi"), $scope.tasks[index_task].projectID, $scope.tasks[index_task].taskID);
        })

        $('#disconfirm,#disconfirmicon').off('click').on('click', function() {
            $('#confirmModal').modal("hide");
        })
    }

    $scope.change_status = async function(status, task) {


        if(status.statusID == 4 && $scope.check_role_member().team_role.roleID != 1){
            sendNotification(task.taskName, "<span class='text-danger'>Access denied !</span>", new Date());
            return;
        }

        if( ! (($scope.check_role_member().team_role.roleID == 2 
        && $scope.arrange_task_assigned(task.taskID).length != 0
        && $scope.arrange_task_assigned(task.taskID).activity_category.categoryID == 10
        && $scope.arrange_task_assigned(task.taskID).username == username) || ($scope.check_role_member().team_role.roleID == 1))){
            sendNotification(task.taskName, "<span class='text-danger'>Access denied !</span>", new Date());
            return;
        }

        var index_st = $scope.tasks_status.findIndex(st => st.statusID == status.statusID);
        var index_task = $scope.tasks.findIndex(tk => tk.taskID == task.taskID);
        var message1 = "You are changing Status to ";
        var message2 = $scope.tasks_status[index_st].statusName;
        $scope.openConfirmModal(message1, message2);

        $('#confirm').off('click').on('click', async function() {
            $('#confirmModal').modal("hide");
            $scope.tasks[index_task].task_status = $scope.tasks_status[index_st];
            $scope.tasks[index_task].deadline = timeDeadline($scope.tasks[index_task].task_status.statusID, $scope.tasks[index_task].plannedStartDate, $scope.tasks[index_task].plannedEndDate)
            await $.ajax({
                url: `http://103.160.2.51:8080/pmf/pmf/project/19/${username}/update-one-task`,
                type: 'PUT',
                contentType: "application/json",
                data: JSON.stringify($scope.tasks[index_task]),
                success: function(res) {


                },
                error: function(resp) {
                    console.log('CHUYEN TASK KO OK')
                }
            });
            $scope.$apply();
            sendNotification($scope.task.taskName, "Successful change", new Date());
            await sendAPINoti("", "task" + sessionStorage.getItem("pi"), $scope.tasks[index_task].projectID, $scope.tasks[index_task].taskID);
        })

        $('#disconfirm,#disconfirmicon').off('click').on('click', function() {
            $('#confirmModal').modal("hide");
        })
    }

    $scope.change_description = async function(task) {
        var index_task = $scope.tasks.findIndex(tk => tk.taskID == task.taskID);

        $scope.tasks[index_task].discription = angular.copy($scope.task.discription);
        await $.ajax({
            url: `http://103.160.2.51:8080/pmf/pmf/project/20/${username}/update-one-task`,
            type: 'PUT',
            contentType: "application/json",
            data: JSON.stringify($scope.tasks[index_task]),
            success: function(res) {
                console.log('CHUYEN TASK OK')
            },
            error: function(resp) {
                console.log('CHUYEN TASK KO OK')
            }
        });
        $scope.$apply();
        sendNotification($scope.task.taskName, "Successful change", new Date());
        await sendAPINoti("", "task" + sessionStorage.getItem("pi"), $scope.tasks[index_task].projectID, $scope.tasks[index_task].taskID);
    }


    $scope.rename_section = async function(section) {
        var message1 = "You are changing the name of section ";
        var message2 = section.sectionName;
        $scope.openConfirmModal(message1, message2);

        $('#confirm').off('click').on('click', async function() {
            if ($('#confirmForm').val().length <= 0) {
                sendNotification(message2, "<span class='text-danger'>Required to enter the new name</span>", new Date());
                return;
            }
            $('#confirmModal').modal("hide");
            var infor = [username,sessionStorage.getItem("pi"),section.sectionID,message2,$('#confirmForm').val()]
            var index = await  $scope.sections.findIndex(item => item.sectionID == section.sectionID);
            $scope.sections[index].sectionName = $('#confirmForm').val()
            await $.ajax({
                url: `http://103.160.2.51:8080/pmf/pmf/project/update-section-name`,
                type: 'PUT',
                contentType: "application/json",
                data: JSON.stringify(infor),
                success: function(res) {
                    $scope.$apply();
                },
                error: function(resp) {
                    console.log('CHUYEN TASK KO OK')
                }
            });
            var message = "The name of the section " +message2+" has been changed to " + $('#confirmForm').val()
            await sendAPINoti(message, "task" + sessionStorage.getItem("pi"), sessionStorage.getItem("pi"), -1);
        })

        $('#disconfirm,#disconfirmicon').off('click').on('click', function() {
            $('#confirmModal').modal("hide");
        })
    }

    $scope.rename_task = async function(task) {
        var message1 = "You are changing the name of task ";
        var message2 = task.taskName;
        $scope.openConfirmModal(message1, message2);

        $('#confirm').off('click').on('click', async function() {
            if ($('#confirmForm').val().length <= 0) {
                sendNotification(message2, "<span class='text-danger'>Required to enter the new name</span>", new Date());
                return;
            }
            $('#confirmModal').modal("hide");
            var infor = [username,sessionStorage.getItem("pi"),task.taskID,message2,$('#confirmForm').val()]
            var index = await  $scope.tasks.findIndex(item => item.taskID == task.taskID);
            $scope.tasks[index].taskName = $('#confirmForm').val()
            await $.ajax({
                url: `http://103.160.2.51:8080/pmf/pmf/project/update-task-name`,
                type: 'PUT',
                contentType: "application/json",
                data: JSON.stringify(infor),
                success: function(res) {
                    $scope.$apply();
                },
                error: function(resp) {
                    console.log('CHUYEN TASK KO OK')
                }
            });
            var message = "The name of the task " +message2+" has been changed to " + $('#confirmForm').val()
            await sendAPINoti(message, "task" + sessionStorage.getItem("pi"), sessionStorage.getItem("pi"), task.taskID);
        })

        $('#disconfirm,#disconfirmicon').off('click').on('click', function() {
            $('#confirmModal').modal("hide");
        })
    }

    $scope.rename_subtask = async function(sub) {
        var message1 = "You are changing the name of subtask ";
        var message2 = sub.discription;
        $scope.openConfirmModal(message1, message2);

        $('#confirm').off('click').on('click', async function() {
            if ($('#confirmForm').val().length <= 0) {
                sendNotification(message2, "<span class='text-danger'>Required to enter the new name</span>", new Date());
                return;
            }
            $('#confirmModal').modal("hide");
            var infor = [username,sessionStorage.getItem("pi"),sub.subID,message2,$('#confirmForm').val()]
            var index = await  $scope.subtasks.findIndex(item => item.subID == sub.subID);
            $scope.subtasks[index].discription = $('#confirmForm').val()
            await $.ajax({
                url: `http://103.160.2.51:8080/pmf/pmf/project/update-subtask-name`,
                type: 'PUT',
                contentType: "application/json",
                data: JSON.stringify(infor),
                success: function(res) {
                    $scope.$apply();
                },
                error: function(resp) {
                    console.log('CHUYEN TASK KO OK')
                }
            });
            var message = "The name of the subtask " +message2+" has been changed to " + $('#confirmForm').val()
            await sendAPINoti(message, "task" + sessionStorage.getItem("pi"), sessionStorage.getItem("pi"), sub.task.taskID);
        })

        $('#disconfirm,#disconfirmicon').off('click').on('click', function() {
            $('#confirmModal').modal("hide");
        })
    }

    $scope.checkBeforeDeleteSection = async function(sec){
        var check = false;
        await $.ajax({
            url: `http://103.160.2.51:8080/pmf/pmf/project/${sec.sectionID}/check-delete-section`,
            type: 'GET',
            contentType: "application/json",
            success: function(res) {
                check = res;
            },
            error: function(resp) {
                console.log('CHUYEN TASK KO OK');
            }
        });
        return check;

    }
    $scope.delete_section = async function(sec) {
        var message1 = "You are deleting section";
        var message2 = sec.sectionName;
        $scope.openConfirmModal(message1, message2);

        $('#confirm').off('click').on('click', async function() {
            if ($('#confirmForm').val().length <= 0) {
                sendNotification(message2, "<span class='text-danger'>Required to enter the reason</span>", new Date());
                return;
            }
            var check = await $scope.checkBeforeDeleteSection(sec);
            if(check === false){
                sendNotification(message2, "<span class='text-danger'>At least 2 sections exist and clear all tasks of this section</span>", new Date());
                return;
            }
            
            $('#confirmModal').modal("hide");
            var infor = [username,sessionStorage.getItem("pi"),sec.sectionID,$('#confirmForm').val()]
            var index = await  $scope.sections.findIndex(item => item.sectionID == sec.sectionID);
            
            await $.ajax({
                url: `http://103.160.2.51:8080/pmf/pmf/project/delete-section`,
                type: 'DELETE',
                contentType: "application/json",
                data: JSON.stringify(infor),
                success: function(res) {
                    $scope.$apply();
                },
                error: function(resp) {
                    console.log('CHUYEN TASK KO OK')
                }
            });
            var message = "The section " +message2+" has been deleted by Project Owner (" + username +")";
            await sendAPINoti(message, "task" + sessionStorage.getItem("pi"), sessionStorage.getItem("pi"), -1);
        })

        $('#disconfirm,#disconfirmicon').off('click').on('click', function() {
            $('#confirmModal').modal("hide");
        })
    }

    $scope.checkBeforeDeleteTask = async function(task){
        var check = false;
        await $.ajax({
            url: `http://103.160.2.51:8080/pmf/pmf/project/${task.taskID}/check-delete-task`,
            type: 'GET',
            contentType: "application/json",
            success: function(res) {
                check = res;
            },
            error: function(resp) {
                console.log('CHUYEN TASK KO OK');
            }
        });
        return check;

    }
    $scope.delete_task = async function(task) {
        var message1 = "You are deleting task";
        var message2 = task.taskName;
        $scope.openConfirmModal(message1, message2);

        $('#confirm').off('click').on('click', async function() {
            if ($('#confirmForm').val().length <= 0) {
                sendNotification(message2, "<span class='text-danger'>Required to enter the reason</span>", new Date());
                return;
            }
            var check = await $scope.checkBeforeDeleteTask(task);
            if(check === false){
                sendNotification(message2, "<span class='text-danger'>Need cancel assigned person and clear all subtasks of this task</span>", new Date());
                return;
            }
            

            $('#confirmModal').modal("hide");
            var infor = [username,sessionStorage.getItem("pi"),task.taskID,$('#confirmForm').val()]
            
            
            await $.ajax({
                url: `http://103.160.2.51:8080/pmf/pmf/project/delete-task`,
                type: 'DELETE',
                contentType: "application/json",
                data: JSON.stringify(infor),
                success: function(res) {
                    $scope.$apply();
                },
                error: function(resp) {
                    console.log('CHUYEN TASK KO OK')
                }
            });
            var message = "The task " +message2+" has been deleted by Project Owner (" + username +")";
            await sendAPINoti(message, "task" + sessionStorage.getItem("pi"), sessionStorage.getItem("pi"), task.taskID);
            $('#taskModal').modal("hide");
        })

        $('#disconfirm,#disconfirmicon').off('click').on('click', function() {
            $('#confirmModal').modal("hide");
        })
    }

    $scope.checkBeforeDeleteSubTask = async function(sub){
        var check = false;
        await $.ajax({
            url: `http://103.160.2.51:8080/pmf/pmf/project/${sub.subID}/check-delete-subtask`,
            type: 'GET',
            contentType: "application/json",
            success: function(res) {
                check = res;
            },
            error: function(resp) {
                console.log('CHUYEN TASK KO OK');
            }
        });
        return check;

    }
    $scope.delete_subtask = async function(sub) {
        var message1 = "You are deleting subtask";
        var message2 = sub.discription;
        $scope.openConfirmModal(message1, message2);

        $('#confirm').off('click').on('click', async function() {
            if ($('#confirmForm').val().length <= 0) {
                sendNotification(message2, "<span class='text-danger'>Required to enter the reason</span>", new Date());
                return;
            }
            var check = await $scope.checkBeforeDeleteSubTask(sub);
            if(check === false){
                sendNotification(message2, "<span class='text-danger'>Required to cancel assigned person of this subtask</span>", new Date());
                return;
            }
            

            $('#confirmModal').modal("hide");
            var infor = [username,sessionStorage.getItem("pi"),sub.subID,$('#confirmForm').val()]
            
            
            await $.ajax({
                url: `http://103.160.2.51:8080/pmf/pmf/project/delete-subtask`,
                type: 'DELETE',
                contentType: "application/json",
                data: JSON.stringify(infor),
                success: function(res) {
                    $scope.$apply();
                },
                error: function(resp) {
                    console.log('CHUYEN TASK KO OK')
                }
            });
            var message = "The subtask " +message2+" has been deleted by Project Owner (" + username +")";
            await sendAPINoti(message, "task" + sessionStorage.getItem("pi"), sessionStorage.getItem("pi"), sub.task.taskID);
            
        })

        $('#disconfirm,#disconfirmicon').off('click').on('click', function() {
            $('#confirmModal').modal("hide");
        })
    }


    $scope.checkBeforeDeleteAllSubTask = async function(task){
        var check = false;
        await $.ajax({
            url: `http://103.160.2.51:8080/pmf/pmf/project/${task.taskID}/check-delete-all-subtask`,
            type: 'GET',
            contentType: "application/json",
            success: function(res) {
                check = res;
            },
            error: function(resp) {
                console.log('CHUYEN TASK KO OK');
            }
        });
        return check;

    }
    $scope.delete_all_subtask = async function(task) {
        var message1 = "You are deleting all subtask of task";
        var message2 = task.taskName;
        $scope.openConfirmModal(message1, message2);

        $('#confirm').off('click').on('click', async function() {
            if ($('#confirmForm').val().length <= 0) {
                sendNotification(message2, "<span class='text-danger'>Required to enter the reason</span>", new Date());
                return;
            }

            if($scope.spec_subtask.length == 0){
                sendNotification(message2, "<span class='text-danger'>There is not any subtask</span>", new Date());
                return;
            }
            var check = await $scope.checkBeforeDeleteAllSubTask(task);
            if(check === false){
                sendNotification(message2, "<span class='text-danger'>Required to cancel assigned person of this subtask</span>", new Date());
                return;
            }
            
            
            $('#confirmModal').modal("hide");
            var infor = [username,sessionStorage.getItem("pi"),task.taskID,$('#confirmForm').val()]
            
            
            await $.ajax({
                url: `http://103.160.2.51:8080/pmf/pmf/project/delete-all-subtask`,
                type: 'DELETE',
                contentType: "application/json",
                data: JSON.stringify(infor),
                success: function(res) {
                    $scope.$apply();
                },
                error: function(resp) {
                    console.log('CHUYEN TASK KO OK')
                }
            });
            var message = "All subtasks of the task " +message2+" has been deleted by Project Owner (" + username +")"+" with reason '"+$('#confirmForm').val()+"'";;
            await sendAPINoti(message, "task" + sessionStorage.getItem("pi"), sessionStorage.getItem("pi"), task.taskID);
            
        })

        $('#disconfirm,#disconfirmicon').off('click').on('click', function() {
            $('#confirmModal').modal("hide");
        })
    }

    $scope.checkBeforeCancelAllSubTask = async function(task){
        var check = false;
        await $.ajax({
            url: `http://103.160.2.51:8080/pmf/pmf/project/${task.taskID}/check-cancel-all-subtask`,
            type: 'GET',
            contentType: "application/json",
            success: function(res) {
                check = res;
            },
            error: function(resp) {
                console.log('CHUYEN TASK KO OK');
            }
        });
        return check;

    }
    $scope.cancel_all_subtask = async function(task) {
        var message1 = "You are canceling all subtask of task";
        var message2 = task.taskName;
        $scope.openConfirmModal(message1, message2);

        $('#confirm').off('click').on('click', async function() {
            if ($('#confirmForm').val().length <= 0) {
                sendNotification(message2, "<span class='text-danger'>Required to enter the reason</span>", new Date());
                return;
            }

            if($scope.spec_subtask.length == 0){
                sendNotification(message2, "<span class='text-danger'>There is not any subtask</span>", new Date());
                return;
            }
            var check = await $scope.checkBeforeCancelAllSubTask(task);
            if(check === false){
                sendNotification(message2, "<span class='text-danger'>Required to have assigned person on these subtasks</span>", new Date());
                return;
            }
            
            $('#confirmModal').modal("hide");
            var infor = [username,sessionStorage.getItem("pi"),task.taskID,$('#confirmForm').val()]
            
            
            await $.ajax({
                url: `http://103.160.2.51:8080/pmf/pmf/project/cancel-all-subtask`,
                type: 'POST',
                contentType: "application/json",
                data: JSON.stringify(infor),
                success: function(res) {
                    $scope.$apply();
                },
                error: function(resp) {
                    console.log('CHUYEN TASK KO OK')
                }
            });
            var message = "All subtasks of the task " 
            +message2+" has been canceled by Project Owner (" + username +")"
            +" with reason '"+$('#confirmForm').val()+"'";
            await sendAPINoti(message, "task" + sessionStorage.getItem("pi"), sessionStorage.getItem("pi"), task.taskID);
            
        })

        $('#disconfirm,#disconfirmicon').off('click').on('click', function() {
            $('#confirmModal').modal("hide");
        })
    }


    $rootScope.openModalListMember = async function(project) {
        $scope.myselfRP = sessionStorage.getItem("user");
        var urlMB = `http://103.160.2.51:8080/pmf/pmf/Team_Members/getListMemberProject/${project.projectID}`;
        $http.get(urlMB).then(async resp => {
            $scope.listProjectMember = await resp.data;
            $rootScope.checkClickRP = false;
            console.log(resp.data);
            console.log(resp.data.length);
            if(resp.data.length % 4 == 0){
                $scope.totalPage = Math.floor(resp.data.length / 4);
            }else{
                $scope.totalPage = Math.floor(resp.data.length / 4) + 1;
            }
            $('#modalListMember').modal('show');
            console.log("Load List Member Success!");
        }).catch(error => {
            console.log("Load List Member Error!", error);
        });
    }

    $scope.loadListMember = function(project){
        var urlMB = `http://103.160.2.51:8080/pmf/pmf/Team_Members/getListMemberProject/${project.projectID}`;
        $http.get(urlMB).then(async resp => {
            $scope.listProjectMember = await resp.data;
            $rootScope.checkClickRP = false;
            console.log(resp.data);
            console.log(resp.data.length);
            if(resp.data.length % 4 == 0){
                $scope.totalPage = Math.floor(resp.data.length / 4);
            }else{
                $scope.totalPage = Math.floor(resp.data.length / 4) + 1;
            }
            $('#searchMember').val("")
            console.log("Load List Member Success!");
        }).catch(error => {
            console.log("Load List Member Error!", error);
        });
    }

    $scope.findMember = function(project){
        $scope.searchMember = $('#searchMember').val()
        console.log($scope.searchMember);
        if ($scope.searchMember.trim().length > 0) {
            var urlMB = `http://103.160.2.51:8080/pmf/pmf/Team_Members/getMemberProject/${project.projectID}/${$scope.searchMember}`;
            $http.get(urlMB).then(async resp => {
                $scope.listProjectMember = await resp.data;
                $rootScope.checkClickRP = false;

                if(resp.data.length % 4 == 0){
                    $scope.totalPage = Math.floor(resp.data.length / 4);
                }else{
                    $scope.totalPage = Math.floor(resp.data.length / 4) + 1;
                }
    
                $('#modalListMember').modal('show');
                console.log("Load List Member Success!");
            }).catch(error => {
                console.log("Load List Member Error!", error);
            });
        }else{
            $scope.loadListMember(project);
        }
    }

    //Cac nut index xu li phan trang trong modalListMember
    $scope.index = 0;
    $timeout(function() {
        $scope.pageNumber = 1;
    }, 710);

    $scope.first = function() {
        $scope.index = 0;
        $scope.pageNumber = 1;
    }
    
    $scope.prev = function() {
        if ($scope.index > 4) {
            $scope.index -= 4;
            $scope.pageNumber -= 1;
        } else {
            $scope.pageNumber = 1;
            $scope.index = 0;
        }

    }

    $scope.number = function(ff) {
        $scope.index = 4 * (ff-1);
        $scope.pageNumber = ff;
    }
    
    $scope.next = function() {
        if ($scope.index <= $scope.listProjectMember.length - 5) {
            $scope.index += 4;
            $scope.pageNumber += 1;
        }

    }
    $scope.last = function() {
        $scope.index = $scope.listProjectMember.length - 4;
        $scope.pageNumber = Math.floor($scope.listProjectMember.length / 4) + 1;
    }

    $rootScope.removeMember = async function(pid, member) {
        var message1 = "You are removing the member ";
        var message2 = member;
        $scope.openConfirmModal(message1, message2);

        $('#confirm').off('click').on('click', async function() {

            if ($('#confirmForm').val().length <= 0) {
                sendNotification("Removing member", "<span class='text-danger'>Required to enter your reason</span>", new Date());
                return;
            }
            $('#confirmModal').modal("hide");
            var reason = $('#confirmForm').val();
            var info = [pid, username, member, reason];

            await $.ajax({
                url: `http://103.160.2.51:8080/pmf/pmf/project/remove-member`,
                type: 'DELETE',
                contentType: "application/json",
                data: JSON.stringify(info),
                success: function(res) {
                    var index = $scope.listProjectMember.findIndex(item => item.account.username == member);
                    $scope.listProjectMember.splice(index, 1);
                    console.log($scope.listProjectMember)
                    $scope.$apply();
                }
            });
            var message = "You has been removed from project with reason ' " + reason + " '";
            var messageAll = "The member " + member + " has been removed from project with reason ' " + reason + " '"
            await
            await $.when(sendAPINoti(message, member, sessionStorage.getItem("pi"), -1),
                sendAPINoti(messageAll, "task" + sessionStorage.getItem("pi"), sessionStorage.getItem("pi"), -1)).done(function() {

            });
        })

        $('#disconfirm,#disconfirmicon').off('click').on('click', function() {
            $('#confirmModal').modal("hide");
        })
    }
    
    $rootScope.openModalAllSubtask = async function(tid) {
        $scope.load_spec_subtask(tid);
        $('#modalAllSubtask').modal('show');
    }

    $rootScope.openModalSubTask = async function(sid) {
        var urlSub = `http://103.160.2.51:8080/pmf/pmf/Task_Sub/getTask_Sub/${sid}`;
        $http.get(urlSub).then(resp => {
            $scope.subTaskDetail = resp.data;
            $('#modalAllSubtask').modal('hide');
            $('#modalSubtask').modal('show');
            console.log("subTaskDetail Success!");
        }).catch(error => {
            console.log("subTaskDetail Error!", error);
        });
    }

    $scope.renameSubtask = async function(id,name){
        var message1 = "You are changing the name of subtask " + name;
        var message2 = "Please enter new subtask name";
        $scope.openConfirmModal(message1, message2);
        $('#confirm').off('click').on('click', async function() {

            if ($('#confirmForm').val().length <= 0) {
                sendNotification("Rename subtask", "Required to enter subtask name", new Date());
                return;
            }
            $('#confirmModal').modal("hide");
            var newName = $('#confirmForm').val();
            var info = [id, newName];

            await $.ajax({
                url: `http://103.160.2.51:8080/pmf/pmf/Task_Sub/rename`,
                type: 'PUT',
                contentType: "application/json",
                data: JSON.stringify(info),
                success: function(res) {
                    var index = $scope.spec_subtask.findIndex(item => item.subID == id);
                    $scope.spec_subtask[index].discription = newName;
                    console.log($scope.spec_subtask[index].discription);
                    $scope.$apply();
                }
            });
            var message = "You has been renamed subtask '" + name + "' to '"+newName+"'";
            var messageAll = "The subtask name '" + name + "' has been renamed to '" + newName + "'"
            await
            await $.when(sendAPINoti(message, id, sessionStorage.getItem("pi"), -1),
                sendAPINoti(messageAll, "task" + sessionStorage.getItem("pi"), sessionStorage.getItem("pi"), -1)).done(function() {

            });
        })

        $('#disconfirm,#disconfirmicon').off('click').on('click', function() {
            $('#confirmModal').modal("hide");
        })
    }


    $rootScope.backToTask = function(tid) {
        $('#modalSubtask').modal("hide");
        $rootScope.openModalAllSubtask(tid);
    }

    $rootScope.backToTaskForAllSubtask = function(tid) {
        $('#modalAllSubtask').modal("hide");
    }

    $scope.openModalInvite = async function(project) {
        console.log("Project Id: ", project.projectID);
        var urlMB = `http://103.160.2.51:8080/pmf/pmf/Team_Members/getListMemberProject/${project.projectID}`;
        $http.get(urlMB).then(resp => {
            $scope.listProjectMember = resp.data;
            console.log("Project Id: ", project.projectID);
            $('#inviteModal').modal('show');
            console.log("Load List Member Success!");
        }).catch(error => {
            console.log("Load List Member Error!", error);
        });
    }

    $scope.selectedCat = function() {
        $scope.selectedC = $('#sttAssignee').find(":selected").val();
     }


    $scope.showMemberRP_Assignee = async function(project, username) {
        
        var urlRP3 = `http://103.160.2.51:8080/pmf/pmf/Activity/getAllActivitiesRelevantToAssignedInfor3/${project.projectID}/${username}`;

        $scope.listAssignee = (await $http.get(`${urlRP3}`)).data
        $rootScope.checkClickRP = true
        $rootScope.listAssigneeNumber = await $scope.listAssignee.length;
        $scope.showMemberRP_Overdue(project, username);
    }

    $scope.showMemberRP_Overdue = async function(project, username) {
        
        var urlRP4 = `http://103.160.2.51:8080/pmf/pmf/Activity/getAllActivitiesRelevantToTaskOverdue/${project.projectID}/${username}`;
        $scope.listOverdue = (await $http.get(`${urlRP4}`)).data
        $rootScope.checkClickRP = true
        console.log($scope.listOverdue)
        $rootScope.listOverdueNumber = await $scope.listOverdue.length;
    }

    $scope.showMemberRP_SubTask = async function(project, username){
        var urlRP2 = `http://103.160.2.51:8080/pmf/pmf/Activity/getAllActivitiesRelevantToSubTaskAssignedInfor3/${project.projectID}/${username}`;
        var chart2 = [];
        $http.get(urlRP2).then(async resp => {
            chart2 = resp.data;
            console.log("Project Id: ", project.projectID);
            // Data retrieved from https://olympics.com/en/olympic-games/beijing-2022/medals
       await Highcharts.chart('container', {
        chart: {
            type: 'pie',
            options3d: {
                enabled: true,
                alpha: 45
            }
        },
        title: {
            text: 'Total Subtask Of Member From Assigned'
        },
        subtitle: {
            text: '3D donut in Highcharts'
        },
        plotOptions: {
            pie: {
                innerSize: 100,
                depth: 45
            }
        },
        series: [{
            name: 'Sub task',
            data: [
                ['Incomplete', chart2[0]],
                ['Completed', chart2[1]],
            ]
        }]
    });
    if (chart2[0] == 0 && chart2[1] == 0) {
        $rootScope.checkClickRPPie = false;
    } else {
        $rootScope.checkClickRPPie = true;
    }
           
            console.log("Load List Member Success!");
        }).catch(error => {
            console.log("Load List Member Error!", error);
        });
        $rootScope.checkClickRP = true;
        
    }

    $scope.showMemberRP_Task = async function(project, username){
        var urlRP = `http://103.160.2.51:8080/pmf/pmf/Activity/getAllActivitiesRelevantToTaskAssignedInfor3/${project.projectID}/${username}`;
        var chart = (await $http.get(`${urlRP}`)).data

        $rootScope.checkClickRP = true;
        // Data retrieved from https://gs.statcounter.com/browser-market-share#monthly-202201-202201-bar

        // Create the chart
        Highcharts.chart('container2', {
            chart: {
                type: 'column'
            },
            title: {
                align: 'left',
                text: 'Browser market shares. January, 2022'
            },
            subtitle: {
                align: 'left',
                text: 'Click the columns to view versions. Source: <a href="http://statcounter.com" target="_blank">statcounter.com</a>'
            },
            accessibility: {
                announceNewData: {
                    enabled: true
                }
            },
            xAxis: {
                type: 'category'
            },
            yAxis: {
                title: {
                    text: 'Total percent market share'
                }

            },
            legend: {
                enabled: false
            },
            plotOptions: {
                series: {
                    borderWidth: 0,
                    dataLabels: {
                        enabled: true,
                        format: '{point.y} Task'
                    }
                }
            },

            tooltip: {
                headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
            },

            series: [{
                name: "Browsers",
                colorByPoint: true,
                data: [{
                        name: "On track",
                        y: chart[0],
                    },
                    {
                        name: "At risk",
                        y: chart[1],
                    }, {
                        name: "Of track",
                        y: chart[2],
                    },
                    {
                        name: "Approve",
                        y: chart[3],
                    },
                ]
            }],
        });
        if (chart[0] == 0 && chart[1] == 0 && chart[2] == 0 && chart[3] == 0) {
            $rootScope.checkClickRPCol = false;
        } else {
            $rootScope.checkClickRPCol = true;
        }
        $('#myTab button[data-target="#profile"]').tab('show')
        $scope.showMemberRP_SubTask(project, username);
        $scope.showMemberRP_Assignee(project, username);
    } 


    $rootScope.shut_down_project = async function(project) {
        var message ="";
        var message1 = "You are shutting down the project ";
        var message2 = project.projectName;
        $scope.openConfirmModal(message1, message2);

        $('#confirm').off('click').on('click', async function() {

            if ($('#confirmForm').val().length <= 0) {
                sendNotification("Shutting down", "<span class='text-danger'>Required to enter your reason</span>", new Date());
                return;
            }
            $('#confirmModal').modal("hide");
            var reason = $('#confirmForm').val();
            var info = [project.projectID, username, reason];
            await $.ajax({
                url: 'http://103.160.2.51:8080/pmf/pmf/project/project-close',
                type: 'PUT',
                contentType: "application/json",
                data: JSON.stringify(info),
                success: async function(res) {
                    var index = await $rootScope.projects.findIndex(pj => res.projectID == pj.projectID)
                    $rootScope.projects[index].project_status = res.project_status;
                    $rootScope.project.project_status = res.project_status;
                    message = "The Project ( "+$rootScope.projects[index].projectName+" ) has been shut down by Project Owner ( "+username+" )";
                    $scope.$apply();
                },
                error: function(resp) {
                    console.log('CHUYEN TASK KO OK')
                }
            });
            
            await sendAPINoti(message, "task" + sessionStorage.getItem("pi"), sessionStorage.getItem("pi"), -1)
        })

        $('#disconfirm,#disconfirmicon').off('click').on('click', function() {
            $('#confirmModal').modal("hide");
        })
    }
    $rootScope.open_project = async function(project) {
        var message ="";
        var message1 = "You are activating the project ";
        var message2 = project.projectName;
        $scope.openConfirmModal(message1, message2); 
        $('#confirm').off('click').on('click', async function() {

            $('#confirmModal').modal("hide");
            var info = [project.projectID, username];

            await $.ajax({
                url: 'http://103.160.2.51:8080/pmf/pmf/project/project-open',
                type: 'PUT',
                contentType: "application/json",
                data: JSON.stringify(info),
                success: function(res) {
                    var index = $rootScope.projects.findIndex(pj => res.projectID == pj.projectID)
                    $rootScope.projects[index].project_status = res.project_status;
                    $rootScope.project.project_status = res.project_status;
                    message = "The Project ( "+$rootScope.projects[index].projectName+" ) has been active by Project Owner ( "+username+" )";
                    $scope.$apply();
                    
                    console.log('CHUYEN TASK OK')
                },
                error: function(resp) {
                    console.log('CHUYEN TASK KO OK')
                }
            });
            
            await sendAPINoti(message, "task" + sessionStorage.getItem("pi"), sessionStorage.getItem("pi"), -1);
        })

        $('#disconfirm,#disconfirmicon').off('click').on('click', function() {
            $('#confirmModal').modal("hide");
        })
    }


    //Assign task
    $scope.assigned_task_to_so = async function(member, taskID, projectID) {
        if ($scope.check_role_member().team_role.roleID != 1) {
            sendNotification("Authorization", "<span class='text-danger'>Access denied !</span>", new Date());
            return;
        }
        var task = await $scope.findOneTask(taskID);
        if (task.plannedEndDate == null) {
            sendNotification("Task condition", "Need to set deadline", new Date());
            return;
        }

        var infor = [username, member, taskID, projectID]
        await $.ajax({
            url: 'http://103.160.2.51:8080/pmf/pmf/project/task-assigned',
            type: 'POST',
            contentType: "application/json",
            data: JSON.stringify(infor),
            success: async function(res) {
                await $scope.load_all_task_assigned();
                $scope.arrange_task_assigned(taskID);
                $scope.$apply();
            },
            error: function(resp) {
                console.log('Assign ko ok')
            }
        });


        var mesage = "New task " + task.taskName + " for you to handle";
        await $.when(sendAPINoti(mesage, member, projectID, taskID), sendAPINoti("", "task" + sessionStorage.getItem("pi"), projectID, taskID)).done(function() {

        });

    }
    $scope.return_image = function(username) {
        var image = null;
        try {
            $scope.ac_members.forEach(function(u) {
                if (u.username == username) {
                    image = u.image;
                    return;
                }
            })
        } catch (err) {

        }
        return image;
    }

    $rootScope.accept_task_assigned = async function(taskID, projectID) {
        var task = await $scope.findOneTask(taskID);
        var infor = [username, taskID, projectID];

        await $.ajax({
            url: 'http://103.160.2.51:8080/pmf/pmf/project/accept-task-assigned',
            type: 'POST',
            contentType: "application/json",
            data: JSON.stringify(infor),
            success: async function(res) {
                // await $scope.load_all_task_assigned();
                // await $scope.arrange_task_assigned(taskID);
                // await $rootScope.changeViewPrivate(projectID, 2);
                // await $rootScope.change_section_pi(projectID);
                // $scope.$apply();
            },
            error: function(resp) {
                console.log('Assign ko ok')
            }
        });
        var owner = await $scope.get_the_owner();
        var mesage = "Acepted to receive the task" + task.taskName;
        await $.when(sendAPINoti(mesage, owner.account.username, projectID, taskID), sendAPINoti("", "task" + sessionStorage.getItem("pi"), projectID, taskID)).done(function() {

        });
    }


    $rootScope.refuse_task_assgined = async function(taskID, projectID) {
            var task = await $scope.findOneTask(taskID);
            var message1 = "You are refusing to receive the task";
            var message2 = task.taskName;
            $scope.openConfirmModal(message1, message2);
            $('#confirm').off('click').on('click', async function() {


                if ($('#confirmForm').val().length <= 0) {
                    sendNotification(task.taskName, "<span class='text-danger'>Required to enter your reason</span>", new Date());
                    return;
                }
                $('#confirmModal').modal("hide");
                var reason = $('#confirmForm').val();
                $('#confirmForm').val("");
                var infor = [username, taskID, projectID, reason];
                var mesage = "Refused to receive the task " + task.taskName + " with reason ' " + reason + " '";
                await $.ajax({
                    url: 'http://103.160.2.51:8080/pmf/pmf/project/refuse-task-assigned',
                    type: 'POST',
                    contentType: "application/json",
                    data: JSON.stringify(infor),
                    success: async function(res) {
                        // await $scope.load_all_task_assigned();
                        // await $scope.arrange_task_assigned(taskID);
                        // await $rootScope.changeViewPrivate(projectID, 2);
                        // await $rootScope.change_section_pi(projectID);
                        // $scope.$apply();
                    },
                    error: function(resp) {
                        console.log('Assign ko ok')
                    }
                });
                var owner = await $scope.get_the_owner();
                await $.when(sendAPINoti(mesage, owner.account.username, projectID, taskID), sendAPINoti("", "task" + sessionStorage.getItem("pi"), projectID, taskID)).done(function() {});

            })

            $('#disconfirm,#disconfirmicon').off('click').on('click', function() {
                $('#confirmModal').modal("hide");
                $('#confirmForm').val("")
            })

        }

        //Cancel task
        $rootScope.cancel_task_assgined = async function(taskID, projectID) {
            var task = await $scope.findOneTask(taskID);
            var message1 = "You are canceling the assigning task";
            var message2 = task.taskName;
            $scope.openConfirmModal(message1, message2);
            $('#confirm').off('click').on('click', async function() {


                if ($('#confirmForm').val().length <= 0) {
                    sendNotification(task.taskName, "<span class='text-danger'>Required to enter your reason</span>", new Date());
                    return;
                }
                $('#confirmModal').modal("hide");
                var reason = $('#confirmForm').val();
                $('#confirmForm').val("");
                var member = await $scope.arrange_task_assigned(taskID).username;
                var infor = [username, taskID, projectID, reason,member];
                var mesage = "Canceled the assigning task " + task.taskName + " with reason ' " + reason + " '";
                await $.ajax({
                    url: 'http://103.160.2.51:8080/pmf/pmf/project/cancel-task-assigned',
                    type: 'POST',
                    contentType: "application/json",
                    data: JSON.stringify(infor),
                    success: async function(res) {
                        // await $scope.load_all_task_assigned();
                        // await $scope.arrange_task_assigned(taskID);
                        // await $rootScope.changeViewPrivate(projectID, 2);
                        // await $rootScope.change_section_pi(projectID);
                        // $scope.$apply();
                    },
                    error: function(resp) {
                        console.log('Assign ko ok')
                    }
                });
                
                await $.when(sendAPINoti(mesage, member, projectID, taskID), sendAPINoti("", "task" + sessionStorage.getItem("pi"), projectID, taskID)).done(function() {});

            })

            $('#disconfirm,#disconfirmicon').off('click').on('click', function() {
                $('#confirmModal').modal("hide");
                $('#confirmForm').val("")
            })

        }
        //Assign subtask
    $scope.assigned_subtask_to_so = async function(member, subtaskID, projectID, taskID) {
        if ($scope.check_role_member().team_role.roleID != 1) {
            sendNotification("Authorization", "<span class='text-danger'>Access denied !</span>", new Date());
            return;
        }
        var infor = [username, member, subtaskID, projectID];

        await $.ajax({
            url: 'http://103.160.2.51:8080/pmf/pmf/project/subtask-assigned',
            type: 'POST',
            contentType: "application/json",
            data: JSON.stringify(infor),
            success: async function(res) {
                await $scope.load_all_subtask_assigned();
                $scope.arrange_subtask_assigned(subtaskID);
                $scope.$apply();
            },
            error: function(resp) {
                console.log('Assign ko ok')
            }
        });

        var subtask = await $scope.findOneSubTask(subtaskID);
        var mesage = "New subtask " + subtask.discription + " for you to handle";
        await $.when(sendAPINoti(mesage, member, projectID, taskID), sendAPINoti("", "task" + sessionStorage.getItem("pi"), projectID, taskID)).done(function() {

        });
    };

    $rootScope.accept_subtask_assigned = async function(subID, projectID, taskID) {
        var infor = [username, subID, projectID];

        await $.ajax({
            url: 'http://103.160.2.51:8080/pmf/pmf/project/accept-subtask-assigned',
            type: 'POST',
            contentType: "application/json",
            data: JSON.stringify(infor),
            success: async function(res) {
                // await $scope.load_all_subtask_assigned();
                // await $scope.arrange_subtask_assigned(subID);
                // await $scope.display_subtask(taskID);
                // await $rootScope.changeViewPrivate(projectID, 3);
                // await $rootScope.change_section_pi(projectID);
                // $scope.$apply();
            },
            error: function(resp) {
                console.log('Assign ko ok')
            }
        });
        var subtask = await $scope.findOneSubTask(subID);
        var owner = await $scope.get_the_owner();
        var mesage = "Acepted to receive the subtask" + subtask.discription;
        await $.when(sendAPINoti(mesage, owner.account.username, projectID, taskID), sendAPINoti("", "task" + sessionStorage.getItem("pi"), projectID, taskID)).done(function() {});

    }

    $rootScope.refuse_subtask_assgined = async function(subID, projectID, taskID) {



        var subtask = await $scope.findOneSubTask(subID);
        var message1 = "You are refusing to receive the subtask";
        var message2 = subtask.discription;
        $scope.openConfirmModal(message1, message2);
        $('#confirm').off('click').on('click', async function() {


            if ($('#confirmForm').val().length <= 0) {
                sendNotification(subtask.discription, "<span class='text-danger'>Required to enter your reason</span>", new Date());
                return;
            }
            $('#confirmModal').modal("hide");
            var reason = $('#confirmForm').val();
            $('#confirmForm').val("");
            var infor = [username, subID, projectID, reason];
            var mesage = "Refused to receive the subtask " + subtask.discription + " with reason ' " + reason + " '";
            await $.ajax({
                url: 'http://103.160.2.51:8080/pmf/pmf/project/refuse-subtask-assigned',
                type: 'POST',
                contentType: "application/json",
                data: JSON.stringify(infor),
                success: async function(res) {
                    // await $scope.load_all_subtask_assigned();
                    // await $scope.arrange_subtask_assigned(subID);
                    // await $scope.display_subtask(taskID);
                    // await $rootScope.changeViewPrivate(projectID, 3);
                    // await $rootScope.change_section_pi(projectID);
                    // $scope.$apply();
                },
                error: function(resp) {
                    console.log('Assign ko ok')
                }
            });
            var owner = await $scope.get_the_owner();
            await $.when(sendAPINoti(mesage, owner.account.username, projectID, taskID), sendAPINoti("", "task" + sessionStorage.getItem("pi"), projectID, taskID)).done(function() {});

        })

        $('#disconfirm,#disconfirmicon').off('click').on('click', function() {
            $('#confirmModal').modal("hide");
            $('#confirmForm').val("")
        })

    }


    $rootScope.cancel_subtask_assgined = async function(subID, projectID, taskID) {



        var subtask = await $scope.findOneSubTask(subID);
        var message1 = "You are canceling the assgining subtask";
        var message2 = subtask.discription;
        $scope.openConfirmModal(message1, message2);
        $('#confirm').off('click').on('click', async function() {


            if ($('#confirmForm').val().length <= 0) {
                sendNotification(subtask.discription, "<span class='text-danger'>Required to enter your reason</span>", new Date());
                return;
            }
            $('#confirmModal').modal("hide");
            var reason = $('#confirmForm').val();
            $('#confirmForm').val("");
            var member = await $scope.arrange_subtask_assigned(subID).username;
            var infor = [username, subID, projectID, reason,member];
            var mesage = "Canceled the assigning subtask " + subtask.discription + " with reason ' " + reason + " '";
            await $.ajax({
                url: 'http://103.160.2.51:8080/pmf/pmf/project/cancel-subtask-assigned',
                type: 'POST',
                contentType: "application/json",
                data: JSON.stringify(infor),
                success: async function(res) {
                    // await $scope.load_all_subtask_assigned();
                    // await $scope.arrange_subtask_assigned(subID);
                    // await $scope.display_subtask(taskID);
                    // await $rootScope.changeViewPrivate(projectID, 3);
                    // await $rootScope.change_section_pi(projectID);
                    // $scope.$apply();
                },
                error: function(resp) {
                    console.log('Assign ko ok')
                }
            });
            await $.when(sendAPINoti(mesage, member, projectID, taskID), sendAPINoti("", "task" + sessionStorage.getItem("pi"), projectID, taskID)).done(function() {});

        })

        $('#disconfirm,#disconfirmicon').off('click').on('click', function() {
            $('#confirmModal').modal("hide");
            $('#confirmForm').val("")
        })

    }



    $scope.create_subtask = async function() {
        if ($scope.check_role_member().team_role.roleID == 2) {
            alert('Access denied!');
            return;
        }
        var infor = [$('#createSubTask').attr('data-task-id'), $('#createSubTask').val()];
        $('#createSubTask').val('');
        await $.ajax({
            url: 'http://103.160.2.51:8080/pmf/pmf/project/subtask-create',
            type: 'POST',
            contentType: "application/json",
            data: JSON.stringify(infor),
            success: async function(res) {
                await $scope.load_all_subtask();
                await $scope.load_spec_subtask(res.task.taskID);
                $scope.$apply();
                $scope.prepareProcessBarModal();
            },
            error: function(resp) {
                console.log('Assign ko ok')
            }
        });
        var task = await $scope.findOneTask(parseInt($('#createSubTask').attr('data-task-id')));
        messageForMoveTaskToAnotherSection = "The Subtask " + $('#createSubTask').val() + " has been created";
        await sendAPINoti(messageForMoveTaskToAnotherSection, "task" + sessionStorage.getItem("pi"), task.projectID, task.taskID);
    }

    $scope.openCommentModal = async function(tid) {
        //$('#taskModal').modal('hide');
        await $scope.load_all_comment(tid);
        await $('#createComment').attr('data-task-id', tid);
        //$('#commentTaskModal').modal('show');
    }

    $scope.openActModal = async function(tid) {
        //$('#taskModal').modal('hide');
        await $scope.load_all_act_one_task(tid);
        //$('#actTaskModal').modal('show');
    }


    $scope.create_comment = async function() {

        var infor = [$scope.pi, $('#createComment').attr('data-task-id'), $('#createComment').val(), username];
        $('#createComment').val('');

        await $.ajax({
            url: 'http://103.160.2.51:8080/pmf/pmf/project/comment-create',
            type: 'POST',
            contentType: "application/json",
            data: JSON.stringify(infor),
            success: async function(res) {
                await $scope.load_all_comment($('#createComment').attr('data-task-id'));
                $scope.$apply();
            },
            error: function(resp) {
                console.log('Assign ko ok')
            }
        });
    }

    // $scope.backToTask = function(tid) {
    //         $('#commentTaskModal').modal('hide');
    //         $('#actTaskModal').modal('hide');
    //         $scope.openModal(tid);
    //     }
        //Phan Upload va Download file cua Hung
        //Load danh sach cac task_file da submit vao Task Modal
    $scope.load_list_file = function(projectID, taskID) {
        var urlFile = `http://103.160.2.51:8080/pmf/pmf/Task_File/getListInTask/${projectID}/${taskID}`;
        $http.get(urlFile).then(resp => {
            $scope.list_file_download = resp.data;
            console.log("Load List File Sucess", resp);
        }).catch(error => {
            console.log("Load List File  Error", error);
        });
    };

    //Download task_file dua theo fileID
    $scope.downloadFile = function(id) {
        var urlFile = `https://drive.google.com/file/d/${id}/view`;
        window.open(urlFile, 'Downloading');
    }

    //Luu du lieu task_fike vao db
    var taskID_for_file;
    $scope.save_taskFile = function(codeID) {
        if (task_file != null) {
            var today = new Date();
            var deadline = new Date(deadline_for_file);
            var status;
            if (deadline_for_file != null) {
                if (today <= deadline) {
                    status = true;
                } else {
                    status = false
                }
            } else {
                status = true;
            }
            $scope.taskFile = {
                name: task_file.name,
                status: status,
                code: codeID,
                project: {
                    projectID: projectID_for_file
                },
                task: {
                    taskID: taskID_for_file
                },
                account: {
                    username: username
                },
            }
            var item = angular.copy($scope.taskFile);
            var url = `http://103.160.2.51:8080/pmf/pmf/Task_File/saveFile`;
            $http.post(url, item).then(resp => {
                $scope.list_file_download.push(resp.data);
                console.log("Save Task File Success!");
            }).catch(error => {
                console.log("Save Task File Error!", error);
            });
        } else {
            alert("Please Choose The File To Upload!");
        }
    };

    //Upload file len Google Drive
    var task_file;
    $scope.upload_taskFile = function() {
        if (task_file != null) {
            alert("Uploading...")
            var url = `http://103.160.2.51:8080/pmf/pmf/Task_File/upload`;
            var form = new FormData();
            form.append("file", task_file);
            $http.post(url, form, {
                transformRequest: angular.identity,
                headers: { 'Content-type': undefined }
            }).then(resp => {
                $('#fileUploadInput').val(null);
                alert("Upload File Success!");
                $scope.save_taskFile(resp.data.code);
                console.log("Upload File Success", resp);
            }).catch(error => {
                alert("Upload File Error! Please try again!");
                console.log("Upload File Error", error);
            });
        } else {
            alert("Please choose your file!");
        }
    }

    $scope.fileUp = function(file) {
        if (file[0].size >= 20971520) {
            $('#fileUploadInput').val(null);
            alert("File's size exceeds the configured maximum (20Mb)!");
        } else {
            task_file = file[0];
        }
    }
});
app.controller("navbarController", ($scope, $http, $timeout, $interval, $controller) => {
    let hostNha = "http://103.160.2.51:8080/pmf";
    //Nhã làm
    $scope.search = ''
    $scope.searchInvitation = ''
    $scope.account = []
    $scope.task = []
    $scope.projects = []
    $scope.team = []
    $scope.tasksub = []
    $scope.accountInvitation = []
        //Get data user after login
    $scope.areThereAnyResult = () => {
        return (
            $scope.account.length <= 0 &&
            $scope.task.length <= 0 &&
            $scope.projects.length <= 0 &&
            $scope.team.length <= 0 &&
            $scope.tasksub.length <= 0
        )
    }
    $scope.findData = function() {
        var username = sessionStorage.getItem("user");
        if (username != undefined || username != null || username != '') {
            if ($scope.search.trim().length > 0) {
                console.log($scope.search)
                    //Find account
                $http.get(`${hostNha}/pmf/account/${$scope.search}/${username}`).then(resp => {
                        $scope.account = resp.data;
                    })
                    //Find task
                $http.get(`${hostNha}/pmf/task/${$scope.search}/${username}`).then(resp => {
                        $scope.task = resp.data;
                    })
                    //Find project
                $http.get(`${hostNha}/pmf/project/${$scope.search}/${username}`).then(resp => {
                        $scope.project = resp.data;
                    })
                    //Find team
                $http.get(`${hostNha}/pmf/team/${$scope.search}/${username}`).then(resp => {
                        $scope.team = resp.data;
                    })
                    //Find subtask
                $http.get(`${hostNha}/pmf/tasksub/${$scope.search}/${username}`).then(resp => {
                    $scope.tasksub = resp.data;

                })
            }
        } else {
            alert("You are not logged in try again later!");
            window.location.href = "http://103.160.2.51:8080/projectmanagement/template/pages/samples/login.html";
        }
    }

    //Get data user after login
    $scope.findDataInvitation = function() {
        $scope.searchInvitation = $('#search3').val();
        if ($scope.searchInvitation.trim().length > 0) {
            //Find account
            $http.get(`${hostNha}/pmf/Account/getAccount`).then(resp => {
                $scope.accountInvitation = resp.data;
            })
        }
    }

    $scope.forTagChip = function(project) {
        $scope.openModalInvite(project);
        $scope.myself = sessionStorage.getItem("user");
        tagInput();
    }
    $scope.resetElementInput = function() {
        $scope.searchInvitation = '';
        $scope.accountInvitation = '';
    }

    $scope.getAllTagInput = async function() {
        var arr = [];
        if ($('.tag').length == 0) return;
        await $('.tag').each(function(index, value) {
            arr.push($(this).attr('data-email'))
        });
        let hostNotification = `http://103.160.2.51:8080/pmf/pmf/project/${sessionStorage.getItem("pi")}/invitation`;
        await $.ajax({
            url: hostNotification,
            type: 'POST',
            contentType: "application/json",
            data: JSON.stringify(arr),
            success: (res) => {
                $('.tag').remove();
            },
            error: (err) => {
                console.log(err)
            }
        });

    }
})

const areThereNewNotification = async(list) => {
    var check = false;
    for (let i = 0; i < list.length; i++) {
        let result = await getNotification(list[i].projectID)
        if (list[i].numberOfNotification != result.length) {
            check = true
        }
    }
    return check
}
const projectNormalConfiguration = async(list) => {
    for (let i = 0; i < list.length; i++) {
        list[i].projectNotification = 0
        let notification = await getNotification(list[i].projectID)
        list[i].numberOfNotification = notification.length
    }
    return list;
}
const projectConfiguration = async(projectList, list) => {
    for (let i = 0; i < list.length; i++) {
        let notification = await getNotification(list[i].projectID)
        list[i].projectNotification = (notification.length - projectList[i].numberOfNotification) + projectList[i].projectNotification
        list[i].numberOfNotification = notification.length
    }
    return list;
}
const getNotification = async(projectID) => {
    let hostNotification = "http://103.160.2.51:8080/pmf/pmf";
    const notificationList = await $.ajax({
        url: `${hostNotification}/Activity/getActivitiesRelevantToProjectAndAccount/${projectID}/${sessionStorage.getItem('user')}`,
        type: 'GET',
        contentType: "application/json",
        error: (err) => {
            console.log(err)
        }
    });
    return notificationList;
}


//Client
const getNotificationInvitation = async(projectID) => {
    let hostNotification = "http://103.160.2.51:8080/pmf/pmf";
    const notificationList = await $.ajax({
        url: `${hostNotification}/Activity/getAllActivitiesRelevantToInvitationInfor/${projectID}/${sessionStorage.getItem('user')}`,
        type: 'GET',
        contentType: "application/json",
        error: (err) => {
            console.log(err)
        },
        success: (res) => {
            console.log(res)
        }
    });
    return notificationList;
}


const getNotificationTaskAssigned = async(projectID) => {
    let hostNotification = "http://103.160.2.51:8080/pmf/pmf";
    const notificationList = await $.ajax({
        url: `${hostNotification}/Activity/getAllActivitiesRelevantToTaskAssignedInfor/${projectID}/${sessionStorage.getItem('user')}`,
        type: 'GET',
        contentType: "application/json",
        error: (err) => {
            console.log(err)
        }
    });
    return notificationList;
}

const getNotificationSubTaskAssigned = async(projectID) => {
    let hostNotification = "http://103.160.2.51:8080/pmf/pmf";
    const notificationList = await $.ajax({
        url: `${hostNotification}/Activity/getAllActivitiesRelevantToSubTaskAssignedInfor/${projectID}/${sessionStorage.getItem('user')}`,
        type: 'GET',
        contentType: "application/json",
        error: (err) => {
            console.log(err)
        }
    });
    return notificationList;
}


//Admin
const getNotificationInvitationAdmin = async(projectID) => {
    let hostNotification = "http://103.160.2.51:8080/pmf/pmf";
    const notificationList = await $.ajax({
        url: `${hostNotification}/Activity/getAllActivitiesRelevantToInvitationInforAdmin/${projectID}`,
        type: 'GET',
        contentType: "application/json",
        error: (err) => {
            console.log(err)
        }
    });
    return notificationList;
}


const getNotificationTaskAssignedAdmin = async(projectID) => {
    let hostNotification = "http://103.160.2.51:8080/pmf/pmf";
    const notificationList = await $.ajax({
        url: `${hostNotification}/Activity/getAllActivitiesRelevantToTaskAssignedInforAdmin/${projectID}`,
        type: 'GET',
        contentType: "application/json",
        error: (err) => {
            console.log(err)
        }
    });
    return notificationList;
}

const getNotificationSubTaskAssignedAdmin = async(projectID) => {
    let hostNotification = "http://103.160.2.51:8080/pmf/pmf";
    const notificationList = await $.ajax({
        url: `${hostNotification}/Activity/getAllActivitiesRelevantToSubTaskAssignedInforAdmin/${projectID}`,
        type: 'GET',
        contentType: "application/json",
        error: (err) => {
            console.log(err)
        }
    });
    return notificationList;
}
const configuration = (list) => {
    for (let i = 0; i < list.length; i++) {
        const d = new Date(list[i].startDate)
        list[i].startDate = timeSince(d)
    }
    return list.reverse()
}

const configurationDeadline = (list) => {
    for (let i = 0; i < list.length; i++) {

        list[i].deadline = timeDeadline(list[i].task_status.statusID, list[i].plannedStartDate, list[i].plannedEndDate);
    }
    return list;
}

function timeDeadline(status, dateStart, dateEnd) {
    if (dateEnd == null) return true;
    const start = new Date(dateStart);
    const end = new Date(dateEnd);
    if (end <= new Date() && (status != 4 && status != 3)) {
        return false;
    }
    return true;
}

function timeSince(date) {
    var seconds = Math.floor((new Date() - date) / 1000);
    var interval = seconds / 31536000;
    var time;
    if (interval > 1) {
        time = Math.floor(interval);
        time = time === 0 || time === 1 ? time + ' year ago' : time + ' years ago';
        return time;
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        time = Math.floor(interval);
        time = time === 0 || time === 1 ? time + ' month ago' : time + ' months ago';
        return time;
    }
    interval = seconds / 86400;
    if (interval > 1) {
        time = Math.floor(interval);
        time = time === 0 || time === 1 ? time + ' day ago' : time + ' days ago';
        return time;
    }
    interval = seconds / 3600;
    if (interval > 1) {
        time = Math.floor(interval);
        time = time === 0 || time === 1 ? time + ' hour ago' : time + ' hours ago';
        return time;
    }
    interval = seconds / 60;
    if (interval > 1) {
        time = Math.floor(interval);
        time = time === 0 || time === 1 ? time + ' minute ago' : time + ' minutes ago';
        return time;
    }
    time = Math.floor(interval);
    time = time === 0 || time === 1 ? time + ' second ago' : time + ' seconds ago';
    return time;
}
//Hello
function helloUser() {
    var day = new Date();
    var hr = day.getHours();
    var hello;
    if (hr >= 0 && hr < 12) {
        hello = "Good Morning!";
    } else if (hr == 12) {
        hello = "Good Noon!";
    } else if (hr >= 12 && hr <= 17) {
        hello = "Good Afternoon!";
    } else {
        hello = "Good Evening!"
    }
    return hello;
}

function readURL(input) {
    alert("Your profile has been changed")
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function(e) {
            $('#avatarProfile').attr('src', e.target.result);
        }

        reader.readAsDataURL(input.files[0]);
    }
}

function tagInput() {
    // Plugin Constructor
    var TagsInput = function(opts) {
        this.options = Object.assign(TagsInput.defaults, opts);
        this.init();
    }

    // Initialize the plugin
    TagsInput.prototype.init = function(opts) {
        this.options = opts ? Object.assign(this.options, opts) : this.options;

        if (this.initialized)
            this.destroy();

        if (!(this.orignal_input = document.getElementById(this.options.selector))) {
            console.error("tags-input couldn't find an element with the specified ID");
            return this;
        }

        this.arr = [];
        this.wrapper = document.createElement('div');
        this.input = document.createElement('input');
        // this.input.placeholder="Type name here..";
        init(this);
        initEvents(this);

        this.initialized = true;
        return this;
    }

    // Add Tags
    TagsInput.prototype.addTag = function(string) {

        if (this.anyErrors(string))
            return;

        this.arr.push(string);
        var tagInput = this;

        var tag = document.createElement('span');
        tag.className = this.options.tagClass;
        tag.innerText = string;
        tag.setAttribute('data-email', string);
        tag.style.margin = "0px";
        tag.style.margin = "5px";
        var closeIcon = document.createElement('a');
        closeIcon.innerHTML = '&times;';

        // delete the tag when icon is clicked
        closeIcon.addEventListener('click', function(e) {
            e.preventDefault();
            var tag = this.parentNode;

            for (var i = 0; i < tagInput.wrapper.childNodes.length; i++) {
                if (tagInput.wrapper.childNodes[i] == tag)
                    tagInput.deleteTag(tag, i);
            }
        })


        tag.appendChild(closeIcon);
        this.wrapper.insertBefore(tag, this.input);
        this.orignal_input.value = this.arr.join(',');

        return this;
    }

    // Delete Tags
    TagsInput.prototype.deleteTag = function(tag, i) {
        tag.remove();
        this.arr.splice(i, 1);
        this.orignal_input.value = this.arr.join(',');
        return this;
    }

    // Delete All Tags
    TagsInput.prototype.deleteAllTag = function() {
        var length = $('.tags-input-wrapper').length;
        if (length > 1) {
            $('.tags-input-wrapper').not(':last(2)').remove();
        }

    }

    // Make sure input string have no error with the plugin
    TagsInput.prototype.anyErrors = function(string) {
        if (this.options.max != null && this.arr.length >= this.options.max) {
            console.log('max tags limit reached');
            return true;
        }

        if (!this.options.duplicate && this.arr.indexOf(string) != -1) {
            console.log('duplicate found " ' + string + ' " ')
            return true;
        }

        var pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!pattern.test(string)) {
            $('#patternEmail').css("display", "block")
            return true;
        }

    }

    // Add tags programmatically 
    TagsInput.prototype.addData = function(array) {
        var plugin = this;

        array.forEach(function(string) {
            plugin.addTag(string);
        })
        return this;
    }

    // Get the Input String
    TagsInput.prototype.getInputString = function() {
        return this.arr.join(',');
    }


    // destroy the plugin
    TagsInput.prototype.destroy = function() {
        this.orignal_input.removeAttribute('hidden');

        delete this.orignal_input;
        var self = this;

        Object.keys(this).forEach(function(key) {
            if (self[key] instanceof HTMLElement)
                self[key].remove();

            if (key != 'options')
                delete self[key];
        });

        this.initialized = false;
    }

    // Private function to initialize the tag input plugin
    function init(tags) {
        tags.wrapper.append(tags.input);
        tags.wrapper.classList.add(tags.options.wrapperClass);
        tags.orignal_input.setAttribute('hidden', 'true');
        tags.orignal_input.parentNode.insertBefore(tags.wrapper, tags.orignal_input);
    }

    // initialize the Events
    function initEvents(tags) {
        tags.wrapper.addEventListener('click', function() {
            tags.input.focus();
        });


        tags.input.addEventListener('keyup', function(e) {

            var str = tags.input.value.trim();
            if (str.length > 0) $('#patternEmail').css("display", "none");
            angular.element(document.getElementById('navController')).scope().findDataInvitation();
            if (!!(~[9, 13].indexOf(e.keyCode))) {
                e.preventDefault();
                tags.input.value = "";
                if (str != "")
                    tags.addTag(str);
            }

        });

        tags.input.setAttribute('id', 'search3');
        tags.input.style.width = "160px";
        tags.input.style.margin = "0px";
        tags.input.style.marginTop = "3px";
        tags.input.style.marginBottom = "3px";
        tags.input.placeholder = "Enter username or email address";
    }

    // Set All the Default Values
    TagsInput.defaults = {
        selector: '',
        wrapperClass: 'tags-input-wrapper',
        tagClass: 'tag',
        max: null,
        duplicate: false,

    }

    window.TagsInput = TagsInput;
    window.hrefAddTagNone = hrefAddTagNone;
    window.hrefAddTagOne = hrefAddTagOne;

    function hrefAddTagNone() {
        tagInput1.addData([$('#none').attr('data-value')]);
        $('#search3').val('');
        angular.element(document.getElementById('navController')).scope().findDataInvitation();
    }

    function hrefAddTagOne(element) {

        tagInput1.addData([$(element).attr('data-email')])
        $('#search3').val('');
        angular.element(document.getElementById('navController')).scope().findDataInvitation();
    }

    var tagInput1 = new TagsInput({
        selector: 'search2',
        duplicate: false,
        max: 10
    });
    tagInput1.deleteAllTag();

    $('#patternEmail').css("display", "none");

}

const checkForMaintenance = async() => {
    const value = await ($.ajax({
        url: `http://103.160.2.51:8080/pmf/pmf/maintaince`,
        type: 'GET',
        contentType: "application/json",
    }))

    let startDate = new Date(value.startDate);
    let endDate = new Date(value.endDate);
    let today = new Date();

    if (today > startDate && today < endDate) {
        window.location.href = "http://103.160.2.51:8080/projectmanagement/template/pages/samples/error-404.html";
    } else {
        if (value.statusWeb == true) {
            document.getElementById('importantNotification').classList.remove('d-none')
            document.getElementById("maintainanceNotification").innerHTML = "Lưu ý!! Hệ thống sẽ bắt đầu bảo trì trong vòng " + (timeSince(new Date(value.startDate)).replace('-', '')).replace('trước', '') + ". Xin hãy lưu lại mọi chỉnh sửa trước thời gian trên"
        }
    }
}



function sendNotification(title, message, time) {

    var timeStr = moment(time).format("HH:mm:ss YYYY-MM-DD");
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": true,
        "progressBar": true,
        "positionClass": "toast-top-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }

    toastr["info"]("<span class='font-weight-bold'>From: " + title + "<br>" + "Description: " + message + "<br>" + "Time: " + timeStr + "</span>");
    console.log(toastr)
}


async function sendAPINoti(messageNoti, userIDNoti, projectIDNoti, taskIDNoti) {
    return await $.post("http://103.160.2.51:3000/sendNotification", {
            title: username,
            message: messageNoti,
            userID: userIDNoti,
            projectID: projectIDNoti,
            taskID: taskIDNoti
        },
        function(data, status) {

        });
}

function load_page() {

    $('.sgroup').sortable({
        tolerance: "pointer",
        scroll: true,
        scrollSensitivity: 100,
        scrollSpeed: 100,
        distance: 1,
        revert: '200',
        update: function(event, ui) {
            $(this).children().each(function(index) {
                if ($(this).attr('data-position') != (index + 1)) {
                    $(this).attr('data-position', (index + 1)).addClass('updated');
                }
            });
            saveNewSections();
        }
    });
    $('.tgroup').sortable({
        connectWith: '.tgroup',
        placeholder: 'increase-task',
        tolerance: "pointer",
        revert: '200',
        scroll: true,
        scrollSensitivity: 100,
        scrollSpeed: 100,
        start: function(event, ui) {
            $(ui.placeholder).hide(300);
            ui.placeholder.html("Drop in here");
        },
        change: function(e, ui) {
            $(ui.placeholder).hide().show(300);
        },
        update: function(event, ui) {

            $(this).children().each(function(index) {
                if ($(this).attr('data-position') != (index + 1)) {
                    $(this).attr('data-position', (index + 1)).addClass('updated');
                }
            });
            saveNewTask(ui.item);

        },
        stop: function(event, ui) {
            ui.item.addClass('update-section-in-task');
            insertTask(ui.item);
        },



    });
    $('.tgroup').on('mousedown', function() {
        $('.tgroup').each(function(index) {
            if ($(this).height() == 0) {
                $(this).addClass('increase-task2');
            }
        });
    }).on('mouseup', function() {
        $('.tgroup').each(function(index) {
            $(this).removeClass('increase-task2');
        });
    })

}

async function findOneProjectGen(pid) {
    var pj = null;
    try {
        await projects.forEach(function(item) {
            if (item.projectID == pid) {
                pj = item;
                return;
            }
        });
    } catch (err) {

    }
    return pj;
}
///Nha Thanh create meeting 
//Add new meeting

var api = null;

function createNewLinkMeet() {
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var stringLength = 30;

    function pickRandom() {
        return possible[Math.floor(Math.random() * possible.length)];
    }
    var randomString = Array.apply(null, Array(stringLength)).map(pickRandom).join('');

    var domain = "meet.jit.si";
    var options = {
        "roomName": randomString
    };
    api = new JitsiMeetExternalAPI(domain, options);

    api.dispose();
    return randomString;
};

const setBg = () => {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    return "#" + randomColor;
}

function backroundForMember() {
    var member = document.getElementsByClassName("members");
    for (let i = 0; i < member.length; i++) {
        member[i].style.backgroundColor = setBg();
    }
}

var ii = 100;
$("#noti").hide();

function alerNottification() {
    if (ii == 100) {
        $("#noti").show(300);
        var width = 90;
        var id = setInterval(frame, 25);

        function frame() {
            if (width <= 0) {
                clearInterval(id);
                $("#noti").hide(300);
                ii = 100;
                id.clearInterval();
            } else {
                width--;
            }
        }

    }
}
;

window.addEventListener('offline',function(){
    $('#myModalDisconnect').modal('show');
})

window.addEventListener('online',function(){
    $('#myModalReconnect').modal('show');
})

app.controller("create-meeting", ($scope, $http) => {
    var username_Meeting = sessionStorage.getItem("user");
    var hostNhaThanh = "http://103.160.2.51:8080/pmf/pmf";
    //Variable
    $scope.members = [];
    $scope.meetings = [];
    $scope.meeting = {};
    $scope.meeting.account = {};
    $scope.meeting.sc = {};
    $scope.today = new Date();
    //Function
    $scope.loadData = function() {
        $http.get(`${hostNhaThanh}/username/schedule/${sessionStorage.getItem("user")}`).then(resp => {
            $scope.meetings = resp.data;
        });
        $http.get(`${hostNhaThanh}/nhathanh/get/projectOfUser/${sessionStorage.getItem("user")}`).then(resp => {
            $scope.projectOfUser = resp.data;
        });
    };
    $scope.loadData();
    $scope.member = function(value) {
        $http.get(`${hostNhaThanh}/nhathanh/member/all/${value}`).then(resp => {
            $scope.members = resp.data;
        });
    }
    $scope.saveMeeting = function() {
        $scope.meeting.username = "https://meet.jit.si/" + createNewLinkMeet();
        $http.post(`${hostNhaThanh}/create/meeting`, $scope.meeting).then(resp => {
            alerNottification();
            console.log(resp.data);
            $scope.loadData();
        });
    }


});

function h6_into_input(element) {
    var parent = $($($($(element).parent()).parent()).parent()).parent().attr('id');
    $(element).replaceWith(function () {
        
        return "<input type='text' id='"+ parent + "' class='rplhi handle' placeholder='New section'"+ 
        " name='columne-name'  onfocusout='input_into_h6(this)' value='" 
                + $(this).html() + "'/>";
    });
    $('.rplhi').focus();
    $('.rplhi').removeClass('rplhi');
}
  async function input_into_h6(element) {
    var pi = $('.sgroup').attr('data-project-id');
    if($(element).val() == "") $(element).val('Untitled section');
    $(element).replaceWith(function () {
        return "<h6 onclick='h6_into_input(this)'>" + $(this).val() + "</h6>";
    });
    var id = $(element).attr('id');
    var infor = [$(element).val(),id,pi];

    await $.ajax({
        url: 'http://103.160.2.51:8080/pmf/pmf/project/section-name',
        type: 'PUT',
        contentType: "application/json",
        data: JSON.stringify(infor),
        success:async function(res){
            await angular.element(document.getElementById('taskController')).scope().change_section_name(id,$(element).val());
            await sendAPINoti("", "task" + sessionStorage.getItem("pi"), sessionStorage.getItem("pi"), -1);
        },
        error:function(resp){
            console.log($(element).val())
            console.log('ga qua ban oi')
        }
    }); 
  }

  function h4_into_input(element) {
    var parent = $(element).attr('data-task-id');
    $(element).replaceWith(function () {
        
        return "<input type='text' id='"+ parent + "' class='rplhi handle' placeholder='New task name'"+ 
        " name='columne-name'  onfocusout='input_into_h4(this)' value='" 
                + $(this).html() + "'/>";
    });
    $('.rplhi').focus();
    $('.rplhi').removeClass('rplhi');
 }

 async function input_into_h4(element) {
    var id = $(element).attr('id')
    if($(element).val() == "") alert("Vui long nhap ten task");
    $(element).replaceWith(function () {
        return "<h4 data-task-id='"+id+"' class='task-name m-0' onclick='h4_into_input(this)'>" + $(this).val() + "</h4>";
    });
    var id = $(element).attr('id');


    // await $.ajax({
    //     url: 'http://103.160.2.51:8080/pmf/pmf/project/section-name',
    //     type: 'PUT',
    //     contentType: "application/json",
    //     data: JSON.stringify(infor),
    //     success:async function(res){
    //         await angular.element(document.getElementById('taskController')).scope().change_section_name(id,$(element).val());
    //         await sendAPINoti("", "task" + sessionStorage.getItem("pi"), sessionStorage.getItem("pi"), -1);
    //     },
    //     error:function(resp){
    //         console.log($(element).val())
    //         console.log('ga qua ban oi')
    //     }
    // }); 
  }