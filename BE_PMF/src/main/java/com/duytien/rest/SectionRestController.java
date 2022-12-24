package com.duytien.rest;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.duytien.Dao.ActivityDAO;
import com.duytien.Dao.Activity_CategoryDAO;
import com.duytien.Dao.AssignedDAO;
import com.duytien.Dao.ProjectDAO;
import com.duytien.Dao.SectionDAO;
import com.duytien.Dao.TaskDAO;
import com.duytien.Dao.Task_SubDAO;
import com.duytien.Model.Activity;
import com.duytien.Model.Activity_Category;
import com.duytien.Model.Assigned;
import com.duytien.Model.AssignedID;
import com.duytien.Model.Project;
import com.duytien.Model.Section;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;


@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
public class SectionRestController {
	@Autowired
	SectionDAO secDAO;
	
	@Autowired
	TaskDAO taskDAO;
	
	@Autowired
	Task_SubDAO subDAO;
	
	@Autowired
	ProjectDAO pjDAO;
	
	@Autowired
	ActivityDAO actDAO;
	
	@Autowired
	Activity_CategoryDAO cateDAO;
	
	@Autowired
	AssignedDAO assDAO;
	
	
	
	@GetMapping("/pmf/project/{pi}/section-all")
	public List<Section> getAllSec(@PathVariable("pi") Integer projectID){
		return secDAO.findAllByProject(projectID,Sort.by("sectionNumber").ascending());
	}
	
	@PostMapping("/pmf/project/section-update")
	public void updateSection(@RequestBody ArrayList<ArrayList<Integer>> str) throws JsonMappingException, JsonProcessingException{
		for(int i = 0; i < str.size();i++) {
			ArrayList<Integer> mainAra = str.get(i);
			System.out.println("SO A: " + mainAra.get(0));
			System.out.println("SO B: " + mainAra.get(1));
			secDAO.updateSectionPosition(mainAra.get(1), mainAra.get(0),mainAra.get(2));
		}
		
	}
	
	@PostMapping("/pmf/project/section-create")
	public Section createSection(@RequestBody ArrayList<Object> str) throws JsonMappingException, JsonProcessingException{
		Section section = new Section();
		section.setSectionName(String.valueOf(str.get(0)));
		section.setSectionNumber(Integer.parseInt(String.valueOf(str.get(1))));
		section.setProject(pjDAO.findById(Integer.parseInt(String.valueOf(str.get(2)))).get());
		
		return secDAO.save(section);

	}
	
	@PutMapping("/pmf/project/section-name")
	public void changeNameSection(@RequestBody ArrayList<Object> str) throws JsonMappingException, JsonProcessingException{
		secDAO.updateSectionName(String.valueOf(str.get(0)), Integer.parseInt(String.valueOf(str.get(1))),Integer.parseInt(String.valueOf(str.get(2))));
	}
	
	@PutMapping("/pmf/project/update-section-name")
	public void changeNameSection2(@RequestBody ArrayList<Object> str) throws JsonMappingException, JsonProcessingException{
		Section section = secDAO.findSectionByProject
				(Integer.parseInt(String.valueOf(str.get(1))), Integer.parseInt(String.valueOf(str.get(2))));
		section.setSectionName(String.valueOf(str.get(4)));
		section = secDAO.save(section);

		Activity_Category category = cateDAO.findById(24).get();
		Activity act = new Activity();
		//Task
		act.setObjectID(section.getSectionID());
		//Tên activity
		act.setActivityName("The Project Owner("+String.valueOf(str.get(0)) +  ") has changed the name of the section " 
		+ String.valueOf(str.get(3)) + " to '" + String.valueOf(str.get(4))+"'");
		//Ngày giao task
		act.setStartDate(new Date()); 
		act.setUsername(null);
		act.setProjectID(Integer.parseInt(String.valueOf(str.get(1))));
		act.setActivity_category(category);
		
		act = actDAO.save(act);
		
		
		
		//Tạo Assigned (Chủ thể hoạt động)
		Assigned ass = new Assigned();
		ass.setStartDate(new Date());
		ass.setAssignedID(new AssignedID(String.valueOf(str.get(0)),act.getActivityID()));
		ass.setActivity(act);
		assDAO.save(ass);
	}
	
	@DeleteMapping("/pmf/project/section-delete")
	public void deleteSection(@RequestBody ArrayList<Object> str) throws JsonMappingException, JsonProcessingException{
		subDAO.deleteAllSubTaskBySection(Integer.parseInt(String.valueOf(str.get(0))),Integer.parseInt(String.valueOf(str.get(1))));
		taskDAO.deleteAllTaskBySection(Integer.parseInt(String.valueOf(str.get(0))),Integer.parseInt(String.valueOf(str.get(1))));
		secDAO.deleteAllSectionByProject(Integer.parseInt(String.valueOf(str.get(0))),Integer.parseInt(String.valueOf(str.get(1))));
	}
	
	@GetMapping("/pmf/project/{sid}/check-delete-section")
	public Boolean checkBeforeDelete(@PathVariable("sid") Integer sid) {
		Section section = secDAO.findById(sid).get();
		Project p =  section.getProject();
		if(p.getSection().size() == 1 || section.getTask().size() != 0) {
			return false;
		}
		
		return true;
	}
	@DeleteMapping("/pmf/project/delete-section")
	public void deleteSection2(@RequestBody ArrayList<Object> str) throws JsonMappingException, JsonProcessingException{
		Section section = secDAO.findById(Integer.parseInt(String.valueOf(str.get(2)))).get();
		
		Activity_Category category = cateDAO.findById(27).get();
		Activity act = new Activity();
		//Task
		act.setObjectID(section.getSectionID());
		//Tên activity
		act.setActivityName("The Project Owner("+String.valueOf(str.get(0)) +  ") has deleted the section " 
		+ section.getSectionName() + " with reason '"+String.valueOf(str.get(3))+"'");
		//Ngày giao task
		act.setStartDate(new Date()); 
		act.setUsername(null);
		act.setProjectID(Integer.parseInt(String.valueOf(str.get(1))));
		act.setActivity_category(category);
		
		
		secDAO.delete(section);
		act = actDAO.save(act);
		
		
		
		//Tạo Assigned (Chủ thể hoạt động)
		Assigned ass = new Assigned();
		ass.setStartDate(new Date());
		ass.setAssignedID(new AssignedID(String.valueOf(str.get(0)),act.getActivityID()));
		ass.setActivity(act);
		assDAO.save(ass);
	}
}
