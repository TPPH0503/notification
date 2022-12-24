package com.duytien.rest;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
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
import com.duytien.Model.Activity_Category;
import com.duytien.Model.Assigned;
import com.duytien.Model.AssignedID;
import com.duytien.Model.Project;
import com.duytien.Model.Project_Security;
import com.duytien.Model.Task;
import com.duytien.Model.Task_Sub;
import com.duytien.Model.Team_Members;
import com.duytien.Model.Team_MembersID;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
public class TeamRestController {
	

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
	Team_MembersDAO tmsDAO;
	@Autowired
	Team_RoleDAO roleDAO;
	
	@Autowired
	ActivityDAO actDAO;
	
	@Autowired
	Activity_CategoryDAO cateDAO;
	@Autowired
	AssignedDAO assDAO;
	
	@Autowired
	static Team_MembersDAO tmDAO;
	@Autowired
	static ProjectDAO pDAO;
	
	@GetMapping("/pmf/project/{pid}/ac-members")
	public List<Account> getListMem(@PathVariable("pid") Integer pid){
		
		return tmsDAO.getListTeamMember(pid);
	}
	
	@GetMapping("/pmf/project/{pid}/members")
	public List<Team_Members> getListMemOnly(@PathVariable("pid") Integer pid){
		
		return tmsDAO.getListTeamMemberOnly(pid);
	}
	
	@GetMapping("/pmf/project/{pid}/invitation")
	public List<Activity> getInvitation(@PathVariable("pid") Integer pid){

		return actDAO.getAllActivitiesRelevantToInvitation(pid);
	}
	
	@PostMapping("/pmf/project/{pid}/invitation")
	public void inviteSomeOne(@RequestBody ArrayList<String> obj,@PathVariable("pid") Integer pid) {
		Project pj = pjDAO.findById(pid).get();
		List<Team_Members> tms = tmsDAO.getListTeamMemberOnly(pid);
		List<Team_Members> owner = tms.stream()
                .filter(entry -> entry.getTeam_role().getRoleID() == 1)
                .collect(Collectors.toList());
		String message = "";
		for(String email : obj) {
			Account ac = accDAO.getAccountByEmail(email);	
			Activity act = new Activity();
			if(ac != null) {
				Team_Members tm = tmsDAO.getMemberByUsername(ac.getUsername(),pj.getTeam().getTeamID());
				if(tms.contains(tm) == false) {

					act.setUsername(ac.getUsername());
					message = "Project Owner("+owner.get(0).getAccount().getUsername() +  ") has invited user ("+ ac.getUsername() +  ") to project " 
							+ pj.getProjectName();
				}
			}else {
				act.setUsername(email);
				message = "Project Owner("+owner.get(0).getAccount().getUsername() +  ") has invited user ("+ email +  ") to project " 
						+ pj.getProjectName();
			}
			
			
			
			Activity_Category category = cateDAO.findById(6).get();
			
			
			

			//Tên activity
			act.setActivityName(message);
			//Ngày giao task
			act.setStartDate(new Date());
			
			act.setProjectID(pj.getProjectID());
			act.setActivity_category(category);
			
			act = actDAO.save(act);
			

			
			//Tạo Assigned (Chủ thể hoạt động)
			Assigned ass = new Assigned();
			ass.setStartDate(new Date());
			ass.setAssignedID(new AssignedID(owner.get(0).getAccount().getUsername(),act.getActivityID()));
			ass.setActivity(act);
			assDAO.save(ass);
			
		}
	}
	
	
	
	@PostMapping("/pmf/project/accept-invitation")
	public void acceptAssignedSubTask(@RequestBody ArrayList<Object> obj){
		
		Project pj = pjDAO.findById(Integer.parseInt(String.valueOf(obj.get(1)))).get();
		Account ac = accDAO.findById(String.valueOf(obj.get(0))).get();
		
		Team_Members mem = new Team_Members();
		mem.setTeam_membersID(new Team_MembersID(pj.getTeam().getTeamID(), ac.getUsername()));
		mem.setAccount(ac);
		mem.setTeam(pj.getTeam());
		mem.setTeam_role(roleDAO.findById(2).get());
		tmsDAO.save(mem);
		
		Activity_Category category = cateDAO.findById(7).get();
		
		
		Activity act = new Activity();

		//Tên activity
		act.setActivityName("User ("+String.valueOf(obj.get(0)) +  ") has accepted to join in the project  " 
		+ pj.getProjectName());
		//Ngày đồng ý
		act.setStartDate(new Date());

		act.setUsername(String.valueOf(obj.get(0)));
		act.setProjectID(Integer.parseInt(String.valueOf(obj.get(1))));
		act.setActivity_category(category);
		
		act = actDAO.save(act);
		

		
		//Tạo Assigned (Chủ thể hoạt động)
		Assigned ass = new Assigned();
		ass.setStartDate(new Date());
		ass.setAssignedID(new AssignedID(String.valueOf(obj.get(0)),act.getActivityID()));
		ass.setActivity(act);
		assDAO.save(ass);
		

	}
	
	
	@PostMapping("/pmf/project/refuse-invitation")
	public void refuseAssignedSubTask(@RequestBody ArrayList<Object> obj){
		
		Project pj = pjDAO.findById(Integer.parseInt(String.valueOf(obj.get(1)))).get();
		Activity_Category category = cateDAO.findById(8).get();
		
		
		Activity act = new Activity();

		//Tên activity
		act.setActivityName("User ("+String.valueOf(obj.get(0)) +  ") has refused to join in the project " 
		+ pj.getProjectName());
		//Ngày giao task
		act.setStartDate(new Date());

		act.setUsername(String.valueOf(obj.get(0)));
		act.setProjectID(Integer.parseInt(String.valueOf(obj.get(1))));
		act.setActivity_category(category);
		
		act = actDAO.save(act);
		

		
		//Tạo Assigned (Chủ thể hoạt động)
		Assigned ass = new Assigned();
		ass.setStartDate(new Date());
		ass.setAssignedID(new AssignedID(String.valueOf(obj.get(0)),act.getActivityID()));
		ass.setActivity(act);
		assDAO.save(ass);
		

	}
	
	
	@DeleteMapping("/pmf/project/remove-member")
	public void removeMember(@RequestBody ArrayList<Object> obj)throws JsonMappingException, JsonProcessingException{
		
		Project pj = pjDAO.findById(Integer.parseInt(String.valueOf(obj.get(0)))).get();
		
		tmsDAO.deleteMemberInProject(pj.getTeam().getTeamID(), String.valueOf(obj.get(2)));
		
		Activity_Category category = cateDAO.findById(21).get();
		
		
		Activity act = new Activity();

		//Tên activity
		act.setActivityName("Project Owwner ("+String.valueOf(obj.get(1)) +  ") has removed the member " 
		+ String.valueOf(obj.get(2)) + " with reason ' " + String.valueOf(obj.get(3))+ " '");
		//Ngày giao task
		act.setStartDate(new Date());
		act.setDiscription(String.valueOf(obj.get(3)));
		act.setUsername(String.valueOf(obj.get(2)));
		act.setProjectID(Integer.parseInt(String.valueOf(obj.get(0))));
		act.setActivity_category(category);
		
		act = actDAO.save(act);
		

		
		//Tạo Assigned (Chủ thể hoạt động)
		Assigned ass = new Assigned();
		ass.setStartDate(new Date());
		ass.setAssignedID(new AssignedID(String.valueOf(obj.get(1)),act.getActivityID()));
		ass.setActivity(act);
		assDAO.save(ass);
		
		

	}
	
	
	public static Boolean checkIfMember(Project pj, Account acc) {
		System.out.println(pj.getTeam().getTeam_members().toString());
		
		return false;
	}
}
