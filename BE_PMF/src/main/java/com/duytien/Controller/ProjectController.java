package com.duytien.Controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.duytien.Dao.*;
import com.duytien.Model.*;

@CrossOrigin("*")
@RestController
public class ProjectController {
    @Autowired
    ProjectDAO ProjectDAO;
    @Autowired
    AccountDAO accDAO;
    @Autowired
    ActivityDAO actDAO;
    @GetMapping("/pmf/Project/getProject")
    public List<Project> getListProject() {
        List<Project> Project = ProjectDAO.findAll();
        return Project;
    }
    
    @GetMapping("/pmf/Project/findProject/{data}")
	public List<Project> findProject(@PathVariable("data") String data) {
		List<Project> pr = ProjectDAO.findProject(data);
		return pr;
	}
	
    @GetMapping("/pmf/Project/getProject/{id}")
    public Project getProject(@PathVariable("id") int id) {
        return ProjectDAO.findById(id).get();
    }

    @GetMapping("/pmf/Project/getAllProjectsRelevantToAccount/{id}")
    public List<Project> getAllProjectsRelevantToAccount(@PathVariable("id") String id) {
        return ProjectDAO.getAllProjectsRelevantToAccount(id);	
    }
    
    @GetMapping("/pmf/Project/getAllProjectsRelevantToAccountPrivate/{id}")
    public List<Project> getAllProjectsRelevantToAccountPrivate(@PathVariable("id") String id) {
    	Account acc = accDAO.findById(id).get();
    	List<Integer> listID = ProjectDAO.getAllProjectsRelevantToAccountPrivate(id,acc.getEmail());
    	
    	List<Project> listPJ = new ArrayList<>();
    	for(Integer pid : listID ) {
    		List<Activity> list = actDAO.getAllActivitiesRelevantToInvitationInfor(pid,id,acc.getEmail());
    		if(list.size() == 0) {
    			listPJ.add(ProjectDAO.findById(pid).get());
    			continue;
    		}
    		int last  = list.get(list.size() - 1).getActivity_category().getCategoryID();
    		if((list.size() != 0 && last  == 8) || (list.size() != 0 && last  == 21)) continue;
    		listPJ.add(ProjectDAO.findById(pid).get());
    	}
        return listPJ;
    }
    
    @GetMapping("/pmf/Project/{pid}/{username}/checkUserInProject")
    public boolean checkUserInProject(@PathVariable("pid") Integer pid,
    		@PathVariable("username") String username) {

    	Project pj = ProjectDAO.checkUserInProject(username, pid);
    	
    	
        return pj != null ? true : false;
    }
}
