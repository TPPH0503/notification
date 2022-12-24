//package com.duytien.Controller;
//
//import java.util.Date;
//import java.util.UUID;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PathVariable;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//import com.duytien.Model.TaskDefinition;
//import com.duytien.service.TaskDefinitionBean;
//import com.duytien.service.TaskSchedulingService;
//import com.fasterxml.jackson.annotation.ObjectIdGenerators.UUIDGenerator;
//
//
//@RestController
//@RequestMapping(path = "/schedule")
//public class JobSchedulingController {
//
//    @Autowired
//    private TaskSchedulingService taskSchedulingService;
//
//    @Autowired
//    private TaskDefinitionBean taskDefinitionBean;
//
//    @PostMapping(path="/taskdef", consumes = "application/json", produces="application/json")
//    public void scheduleATask(@RequestBody TaskDefinition taskDefinition) {
//        taskDefinitionBean.setTaskDefinition(taskDefinition);
//        taskSchedulingService.scheduleATask(UUID.randomUUID().toString(), taskDefinitionBean, taskDefinition.getCronExpress());
//    }
//
//    @GetMapping(path="/remove/{jobid}")
//    public void removeJob(@PathVariable String jobid) {
//        taskSchedulingService.removeScheduledTask(jobid);
//    }
//}