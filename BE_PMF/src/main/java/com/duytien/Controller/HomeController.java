package com.duytien.Controller;

import java.util.ArrayList;
import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.duytien.Dao.*;
import com.duytien.Model.*;

@CrossOrigin("*")
@RestController
public class HomeController {
	@Autowired
    AccountDAO accountDAO;
	
	@Autowired
    ProjectDAO projectDAO;
	
	@Autowired
    TaskDAO taskDAO;
	
	//Hien thi fullname cua 1 user
    @GetMapping("/pmf/Home/helloName/{username}")
    public Account showName(@PathVariable("username")String id) {
        return accountDAO.findById(id).get();
    }
    
    //Hien thi toan bo project cua 1 user
    @GetMapping("/pmf/Home/showProject/{username}/{stt}")
    public List<Project> showProject(@PathVariable("username")String id, @PathVariable("stt")Integer stt){
    	List<Integer> listID = projectDAO.findIdProject(id, stt);
    	
    	List<Project> list = new ArrayList<Project>();
    	for (int i = 0; i < listID.size(); i++) {
    		Project pr1 = projectDAO.findById(listID.get(i)).get();
    		Project pr2 = new Project();
    		pr2.setProjectID(pr1.getProjectID());
    		pr2.setProjectName(pr1.getProjectName());
    		pr2.setTeam(pr1.getTeam());		
    		list.add(pr2);
		}
        return list;
    }
    
    //Hien thi toan bo task cua 1 user theo statusID
    @GetMapping("/pmf/Home/showTask/{username}/{stt}")
    public List<Task> showName(@PathVariable("username")String id, @PathVariable("stt")Integer stt) {
    	List<Integer> listID = taskDAO.findIdTask(id,stt);
    	
    	List<Task> list = new ArrayList<Task>();
    	for (int i = 0; i < listID.size(); i++) {
    		Task pr1 = taskDAO.findById(listID.get(i)).get();
    		Task pr2 = new Task();
    		pr2.setTask_status(pr1.getTask_status());
    		pr2.setTaskName(pr1.getTaskName());	
    		list.add(pr2);
		}
        return list;
    }
	
}
