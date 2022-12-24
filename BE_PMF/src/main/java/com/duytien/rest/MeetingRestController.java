package com.duytien.rest;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.duytien.Dao.AccountDAO;
import com.duytien.Dao.ProjectDAO;
import com.duytien.Dao.ScheduleCategoryDAO;
import com.duytien.Dao.TaskDefinitionDAO;
import com.duytien.Dao.Team_MembersDAO;
import com.duytien.Model.Account;
import com.duytien.Model.Activity;
import com.duytien.Model.Project;
import com.duytien.Model.ScheduleCategory;
import com.duytien.Model.TaskDefinition;
import com.duytien.service.TaskDefinitionBean;
import com.duytien.service.TaskSchedulingService;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
public class MeetingRestController {
	@Autowired
	ProjectDAO prDAO;
	@Autowired
	Team_MembersDAO memDAO;
	@Autowired
	TaskDefinitionDAO meetDAO;
	@Autowired
	ScheduleCategoryDAO scheduleDAO;
	@Autowired
	AccountDAO accDAO;
	@Autowired
	TaskSchedulingService taskSchedulingService;
	
	

	// Get all projetc of user
	@GetMapping("/pmf/nhathanh/get/projectOfUser/{username}")
	public List<Project> getAllProjectOfUser(@PathVariable("username") String username) {
		List<Project> listProject = prDAO.getAllProjectsRelevantToAccount(username);
		List<Project> list = new ArrayList<>();
		for(Project pj : listProject) {
			String acc = prDAO.checkIfOwner(pj.getTeam().getTeamID()).getAccount().getUsername();
			if(acc.equals(username)) {
				list.add(pj);
			}
		}
		return list;
	}

	// Get all member of project
	@GetMapping("/pmf/nhathanh/member/all/{prId}")
	public List<Account> getAllMember(@PathVariable("prId") Integer idProject) {
		return memDAO.getListTeamMember(idProject);
	}

	// Get all value SCHEDULE
	@GetMapping("/pmf/all/schedule")
	public List<TaskDefinition> getAllSchedule() {
		return meetDAO.findAll();
	}

	// Get SCHEDULE BY USERNAME
	@GetMapping("/pmf/username/schedule/{username}")
	public List<TaskDefinition> ScheduleOfUser(@PathVariable("username") String username) {
		return meetDAO.findDataByUsername(username);
	}

	// Save new meeting
	@PostMapping("/pmf/create/meeting")
	public void create(@RequestBody Activity data) throws ParseException {
		// Get members in project
		Project pro = prDAO.findById(data.getProjectID()).get();
		List<Account> dsAc = memDAO.getListTeamMember(data.getProjectID());
		String title = data.getActivityName();
		String link = data.getUsername();
		String des = data.getDiscription();
		ScheduleCategory sc = scheduleDAO.findById(2).get();
		for (Account ac : dsAc) {
			SimpleDateFormat DateFor = new SimpleDateFormat("dd-M-yyyy HH:mm:ss");
			String jobID = UUID.randomUUID().toString().toUpperCase();
			DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-M-yyyy HH:mm:ss");
			LocalDateTime datetime = LocalDateTime.parse(DateFor.format(data.getStartDate()).toString(), formatter);
			datetime = datetime.minusMinutes(60);
			String cronExpression = "0 " + datetime.getMinute() + " " + datetime.getHour() + " "
					+ datetime.getDayOfMonth() + " " + datetime.getMonthValue() + " ? ";

			TaskDefinition taskDefinition = new TaskDefinition(jobID, cronExpression, title, link, des, pro, null, ac,
					sc, 1);
			TaskDefinitionBean bean = new TaskDefinitionBean();
			bean.setTaskDefinition(taskDefinition);
			taskSchedulingService.scheduleATask(jobID, bean, taskDefinition.getCronExpress());
			meetDAO.save(taskDefinition);
		}
	}
}
