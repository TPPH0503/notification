package com.duytien.rest;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.duytien.Dao.AccountDAO;
import com.duytien.Dao.ActivityDAO;
import com.duytien.Dao.Activity_CategoryDAO;
import com.duytien.Dao.AssignedDAO;
import com.duytien.Dao.ProjectDAO;
import com.duytien.Dao.Project_SecurityDAO;
import com.duytien.Dao.Project_StatusDAO;
import com.duytien.Dao.SectionDAO;
import com.duytien.Dao.TeamDAO;
import com.duytien.Dao.Team_MembersDAO;
import com.duytien.Dao.Team_RoleDAO;
import com.duytien.Model.Account;
import com.duytien.Model.Activity;
import com.duytien.Model.Assigned;
import com.duytien.Model.AssignedID;
import com.duytien.Model.Project;
import com.duytien.Model.Project_Security;
import com.duytien.Model.Project_Status;
import com.duytien.Model.Section;
import com.duytien.Model.Team;
import com.duytien.Model.Team_Members;
import com.duytien.Model.Team_MembersID;
import com.duytien.Model.Team_Role;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
public class ProjectRestController {
	@Autowired
	TeamDAO teamDAO;
	@Autowired
	Project_StatusDAO psDAO;
	@Autowired
	Project_SecurityDAO pseDAO;
	@Autowired
	ProjectDAO pjDAO;
	@Autowired
	SectionDAO secDAO;
	@Autowired
	AccountDAO accDAO;
	@Autowired
	ActivityDAO actDAO;
	@Autowired
	Activity_CategoryDAO act_cateDAO;
	@Autowired
	Team_MembersDAO tmsDAO;
	@Autowired
	Team_RoleDAO roleDAO;
	@Autowired
	AssignedDAO assDAO;
	
	@GetMapping("/pmf/project/project-security")
	public List<Project_Security> getList(){
		return pseDAO.findAll();
	}
	
	@GetMapping("/pmf/project/project-all")
	public List<Project> getAllProject(){
		return pjDAO.findAll();
	}
	
	@PostMapping("/pmf/project/project-create")
	public Project create(@RequestBody ArrayList<Object> infor) {
		
		Account acc = accDAO.findById(String.valueOf(infor.get(3))).get();
		Team_Role role = roleDAO.findById(1).get();
		//Team làm dự án
		Team team = new Team();
		team.setTeamName(String.valueOf(infor.get(1)));
		team = teamDAO.save(team);
		
		Team_MembersID tmsid = new Team_MembersID(team.getTeamID(),acc.getUsername());
		
		//Member
		Team_Members tms = new Team_Members();
		tms.setTeam_membersID(tmsid);
		tms.setTeam(team);
		tms.setAccount(acc);
		tms.setTeam_role(role);
		tms = tmsDAO.save(tms);
		
		//Bảo mật dự án
		Project_Security pse = new Project_Security(); 
		pse = pseDAO.findById(Integer.parseInt(String.valueOf(infor.get(2)))).get();
		
		//Trạng thái dự án
		Project_Status ps = new Project_Status();
		ps = psDAO.findById(1).get();
		
		//Tạo dự án
		Project pj = new Project();
		pj.setProjectName(String.valueOf(infor.get(0)));
		pj.setCreateDate(new Date());
		pj.setProject_status(ps);
		pj.setProject_security(pse);
		pj.setTeam(team);
		pj = pjDAO.save(pj);
		
		//Tạo section
		Section sec = new Section();
		sec.setSectionName("Untitled section");
		sec.setSectionNumber(1);
		sec.setProject(pj);
		secDAO.save(sec);
		
		//Lịch sử hoạt động
		Activity act = new Activity();
		act.setActivity_category(act_cateDAO.findById(1).get());
		act.setActivityName("Project (" + infor.get(0) + ") has created by user ("+ acc.getUsername()+")");
		act.setStartDate(new Date());
		act.setUsername(acc.getUsername());
		act.setProjectID(pj.getProjectID());
		act = actDAO.save(act);	
		
		//Tạo Assigned (Chủ thể hoạt động)
		Assigned ass = new Assigned();
		ass.setStartDate(new Date());
		ass.setAssignedID(new AssignedID(acc.getUsername(),act.getActivityID()));
		ass.setActivity(act);
		assDAO.save(ass);
		
		return pj;
	}
	
	
	@PutMapping("/pmf/project/project-close")
	public Project closeProject(@RequestBody ArrayList<Object> info) {
		Project_Status ps = psDAO.findById(2).get();
		
		Project pj = pjDAO.findById(Integer.parseInt(String.valueOf(info.get(0)))).get();
		Account acc = accDAO.findById(String.valueOf(info.get(1))).get();
		
		pj.setProject_status(ps);
		
		//Lịch sử hoạt động
		Activity act = new Activity();
		act.setActivity_category(act_cateDAO.findById(97).get());
		act.setObjectID(2);
		act.setActivityName("Project " + pj.getProjectName() 
		+ " has been shut down by Project Owner(" + acc.getUsername() + ") with reason '"+String.valueOf(info.get(2))+"'");
		act.setDiscription(String.valueOf(info.get(2)));
		act.setStartDate(new Date());
		act.setUsername(acc.getUsername());
		act.setProjectID(pj.getProjectID());
		act = actDAO.save(act);	
		
		//Tạo Assigned (Chủ thể hoạt động)
		Assigned ass = new Assigned();
		ass.setStartDate(new Date());
		ass.setAssignedID(new AssignedID(acc.getUsername(),act.getActivityID()));
		ass.setActivity(act);
		assDAO.save(ass);
		
		return pjDAO.save(pj); 
	}
	
	@PutMapping("/pmf/project/project-open")
	public Project openProject(@RequestBody ArrayList<Object> info) {
		
		Project_Status ps = psDAO.findById(1).get();
		
		Project pj = pjDAO.findById(Integer.parseInt(String.valueOf(info.get(0)))).get();
		
		pj.setProject_status(ps);
		
		//Lịch sử hoạt động
		Activity act = new Activity();
		act.setActivity_category(act_cateDAO.findById(97).get());
		act.setObjectID(1);
		act.setActivityName("Project " + pj.getProjectName() 
		+ " has been actived by Project Owner(" + String.valueOf(info.get(1)) + ")");

		act.setStartDate(new Date());
		act.setUsername(String.valueOf(info.get(1)));
		act.setProjectID(pj.getProjectID());
		act = actDAO.save(act);	
		
		//Tạo Assigned (Chủ thể hoạt động)
		Assigned ass = new Assigned();
		ass.setStartDate(new Date());
		ass.setAssignedID(new AssignedID(String.valueOf(info.get(1)),act.getActivityID()));
		ass.setActivity(act);
		assDAO.save(ass);
		
		return pjDAO.save(pj); 
	}
	
	@GetMapping("/pmf/project/{pid}/{username}/authorization")
	public Boolean authorizingProject(@PathVariable("pid") Integer pid,
									@PathVariable("username") String username) {
		Project pj = pjDAO.findById(pid).get();
		String owner = pjDAO.checkIfOwner(pj.getTeam().getTeamID()).getAccount().getUsername();
		if(pj.getProject_status().getStatusID() == 2) {
			if(owner.equals(username) == true) {
				
				return true;
			}
			
		}else {
			return true;
		}
		
		return false;
	}
}
