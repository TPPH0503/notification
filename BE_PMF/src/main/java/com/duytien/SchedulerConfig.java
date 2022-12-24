package com.duytien;

import java.util.List;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import com.duytien.Dao.TaskDefinitionDAO;
import com.duytien.Model.TaskDefinition;
import com.duytien.service.TaskDefinitionBean;
import com.duytien.service.TaskSchedulingService;


@Component
public class SchedulerConfig {
	@Autowired
	TaskDefinitionDAO dao;
	@Autowired
	TaskSchedulingService service;
	
	
	@PostConstruct
    public void init() {
        List<TaskDefinition> list = dao.getScheduleByStatus(1);
        for(TaskDefinition sc : list) {
        	TaskDefinitionBean bean = new TaskDefinitionBean();
    		bean.setTaskDefinition(sc);
    		service.scheduleATask(sc.getJobID(), bean, sc.getCronExpress());
        }
    }
}
