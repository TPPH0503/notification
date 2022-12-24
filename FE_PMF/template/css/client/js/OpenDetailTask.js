//Notification by NhaThanh
const firebaseConfig = {
    apiKey: "AIzaSyCqYQUxX3U8LaMEUVdH_hkRbIWGvVa1gqI",
    authDomain: "notification-nha-20f65.firebaseapp.com",
    projectId: "notification-nha-20f65",
    storageBucket: "notification-nha-20f65.appspot.com",
    messagingSenderId: "130809452983",
    appId: "1:130809452983:web:80ab6ea0af927144e7b032",
    measurementId: "G-CYEY3W38W1"
};
//End Notification
firebase.initializeApp(firebaseConfig);

var firestore = firebase.firestore();
const settings = { timestampsInSnapshots: true };
firestore.settings(settings);

const configurationDeadline = (list) => {
    for (let i = 0; i < list.length; i++) {

        list[i].deadline = timeDeadline(list[i].task_status.statusID, list[i].plannedStartDate, list[i].plannedEndDate);
    }
    return list;
}


const app = angular.module("OpenTask", []);
app.controller("taskController", function($scope, $http, $compile, $rootScope) {
    let host = "http://103.160.2.51:8080/pmf/pmf/project";
    $rootScope.project = [];
    $scope.user_assigned = [];
    sessionStorage.setItem("user", "user111");
    sessionStorage.setItem("pi", 2);
    $scope.pi = sessionStorage.getItem("pi");

    firestore.collection("task" + sessionStorage.getItem("pi")).onSnapshot(function(snapshot) {
        if (firsttime_task === true) {
            firsttime_task = false;
            return;
        }
        snapshot.docChanges().forEach(async function(change) {
            if (change.type === "added") {
                var notification = change.doc.data();
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

    // $rootScope.load_all_project = function() {
    //     var url = `http://103.160.2.51:8080/pmf/pmf/Project/getAllProjectsRelevantToAccount/${username}`;
    //     $http.get(url).then(resp => {
    //         $scope.projects = resp.data;
    //     }).catch(error => {
    //         console.log("Error", error);
    //     });
    // };

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
        location.replace("http://127.0.0.1:5501http://103.160.2.51:8080/projectmanagement/template/client/createProject/createProject_2.html");
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
        $('#confirmModal').modal({ backdrop: 'static', keyboard: false })
        $('#confirmModal').modal("show");
        $('#titleConfirm1').text(message1)
        $('#titleConfirm2').text(message2)
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


    $scope.delete_section = async function(section_id) {
        var index_section = $scope.sections.findIndex(sec => sec.sectionID == section_id);
        messageForMoveTaskToAnotherSection = "Section " + $scope.sections[index_section].sectionName + " has been deleted";
        $scope.sections.splice(index_section, 1);


        $scope.task_deleted = $scope.tasks;
        console.log($scope.tasks)
        console.log($scope.task_deleted)
        $scope.tasks.forEach(function(item) {
            if (item.section.sectionID == section_id) {

                $scope.tasks.splice($scope.tasks.indexOf(item), 1);
                console.log(item)
            }
        })


        console.log($scope.task_deleted)
        $scope.sections.sort(function(a, b) { return a.sectionNumber - b.sectionNumber });
        $scope.tasks.sort(function(a, b) { return a.taskNumber - b.taskNumber });
        $scope.$apply();

        await sendAPINoti(messageForMoveTaskToAnotherSection, "task" + sessionStorage.getItem("pi"), parseInt(sessionStorage.getItem("pi")), "");
    }

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

    $rootScope.openModalListMember = async function(project) {
        console.log("Project Id: ", project.projectID);
        var urlMB = `http://103.160.2.51:8080/pmf/pmf/Team_Members/getListMemberProject/${project.projectID}`;
        $http.get(urlMB).then(resp => {
            $scope.listProjectMember = resp.data;
            console.log("Project Id: ", project.projectID);
            $rootScope.checkClickRP = false;
            $('#modalListMember').modal('show');
            console.log("Load List Member Success!");
        }).catch(error => {
            console.log("Load List Member Error!", error);
        });
    }

    $rootScope.removeMember = async function(pid, member) {
        var message1 = "You are removing the member ";
        var message2 = member;
        $scope.openConfirmModal(message1, message2);

        $('#confirm').off('click').on('click', async function() {

            if ($('#confirmForm').val().length <= 0) {
                sendNotification("Removing member", "Required to enter your reason", new Date());
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

    $rootScope.showMemberRP = async function(project, username) {

        var urlRP = `http://103.160.2.51:8080/pmf/pmf/Activity/getAllActivitiesRelevantToTaskAssignedInfor3/${project.projectID}/${username}`;
        var urlRP2 = `http://103.160.2.51:8080/pmf/pmf/Activity/getAllActivitiesRelevantToSubTaskAssignedInfor3/${project.projectID}/${username}`;
        var urlRP3 = `http://103.160.2.51:8080/pmf/pmf/Activity/getAllActivitiesRelevantToAssignedInfor3/${project.projectID}/${username}`;

        var chart = (await $http.get(`${urlRP}`)).data
        var chart2 = (await $http.get(`${urlRP2}`)).data
        $scope.listAssignee = (await $http.get(`${urlRP3}`)).data
        $scope.listAssigneeNumber = $scope.listAssignee.length;
        $scope.sttFilter = [{
                name: 'Assigned',
                value: 1,
            },
            {
                name: 'Accepted',
                value: 2,
            },
            {
                name: 'Decline',
                value: 3,
            },
        ];

        console.log("Chart cot", chart);
        console.log("Chart tron", chart2);

        if (chart2[0] == 0 && chart2[1] == 0) {
            $rootScope.checkClickRPPie = false;
        } else {
            $rootScope.checkClickRPPie = true;
        }
        if (chart[0] == 0 && chart[1] == 0 && chart[2] == 0 && chart[3] == 0) {
            $rootScope.checkClickRPCol = false;
        } else {
            $rootScope.checkClickRPCol = true;
        }

        $rootScope.checkClickRP = true;

        // Data retrieved from https://olympics.com/en/olympic-games/beijing-2022/medals
        Highcharts.chart('container', {
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
    }



    $rootScope.shut_down_project = async function(project) {
        console.log(project)
        await $.ajax({
            url: 'http://103.160.2.51:8080/pmf/pmf/project/project-close',
            type: 'PUT',
            contentType: "application/json",
            data: JSON.stringify(project),
            success: function(res) {
                var index = $scope.projects.findIndex(pj => res.projectID == pj.projectID)
                $scope.projects[index].project_status = res.project_status;
                $rootScope.project.project_status = res.project_status;
                $scope.$apply();
                alert("Close project successed!")
                console.log('CHUYEN TASK OK')
            },
            error: function(resp) {
                console.log('CHUYEN TASK KO OK')
            }
        });
        $scope.$apply();
    }
    $rootScope.open_project = async function(project) {
        await $.ajax({
            url: 'http://103.160.2.51:8080/pmf/pmf/project/project-open',
            type: 'PUT',
            contentType: "application/json",
            data: JSON.stringify(project),
            success: function(res) {
                var index = $scope.projects.findIndex(pj => res.projectID == pj.projectID)
                $scope.projects[index].project_status = res.project_status;
                $rootScope.project.project_status = res.project_status;
                $scope.$apply();
                alert("Open project successed!")
                console.log('CHUYEN TASK OK')
            },
            error: function(resp) {
                console.log('CHUYEN TASK KO OK')
            }
        });
        $scope.$apply();
    }


    //Assign task
    $scope.assigned_task_to_so = async function(member, taskID, projectID) {
        if ($scope.check_role_member().team_role.roleID != 1) {
            sendNotification("Authorization", "Access denied", new Date());
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
                await $scope.load_all_task_assigned();
                await $scope.arrange_task_assigned(taskID);
                await $rootScope.changeViewPrivate(projectID, 2);
                await $rootScope.change_section_pi(projectID);
                $scope.$apply();
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
                    sendNotification(task.taskName, "Required to enter your reason", new Date());
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
                        await $scope.load_all_task_assigned();
                        await $scope.arrange_task_assigned(taskID);
                        await $rootScope.changeViewPrivate(projectID, 2);
                        await $rootScope.change_section_pi(projectID);
                        $scope.$apply();
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
        //Assign subtask
    $scope.assigned_subtask_to_so = async function(member, subtaskID, projectID, taskID) {
        if ($scope.check_role_member().team_role.roleID != 1) {
            sendNotification("Authorization", "Access denied", new Date());
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
                await $scope.load_all_subtask_assigned();
                await $scope.arrange_subtask_assigned(subID);
                await $scope.display_subtask(taskID);
                await $rootScope.changeViewPrivate(projectID, 3);
                await $rootScope.change_section_pi(projectID);
                $scope.$apply();
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
                sendNotification(subtask.discription, "Required to enter your reason", new Date());
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
                    await $scope.load_all_subtask_assigned();
                    await $scope.arrange_subtask_assigned(subID);
                    await $scope.display_subtask(taskID);
                    await $rootScope.changeViewPrivate(projectID, 3);
                    await $rootScope.change_section_pi(projectID);
                    $scope.$apply();
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

    $scope.backToTask = function(tid) {
            $('#commentTaskModal').modal('hide');
            $('#actTaskModal').modal('hide');
            $scope.openModal(tid);
        }
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
            alert("File's size exceeds the configured maximum (20Mb)!");
        } else {
            task_file = file[0];
        }
    }
});