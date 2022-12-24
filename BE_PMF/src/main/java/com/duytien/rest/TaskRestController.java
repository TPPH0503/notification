package com.duytien.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.config.annotation.authentication.configurers.userdetails.AbstractDaoAuthenticationConfigurer;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.duytien.Dao.AccountDAO;
import com.duytien.Dao.ActivityDAO;
import com.duytien.Dao.Activity_CategoryDAO;
import com.duytien.Dao.AssignedDAO;
import com.duytien.Dao.ProjectDAO;
import com.duytien.Dao.ScheduleCategoryDAO;
import com.duytien.Dao.SectionDAO;
import com.duytien.Dao.TaskDAO;
import com.duytien.Dao.TaskDefinitionDAO;
import com.duytien.Dao.Task_FileDAO;
import com.duytien.Dao.Task_PriorityDAO;
import com.duytien.Dao.Task_StatusDAO;
import com.duytien.Dao.Task_SubDAO;
import com.duytien.Dao.Team_MembersDAO;
import com.duytien.Model.Task;
import com.duytien.Model.TaskDefinition;
import com.duytien.Model.Task_Priority;
import com.duytien.Model.Task_Status;
import com.duytien.Model.Task_Sub;
import com.duytien.Model.Team_Members;
import com.duytien.service.TaskDefinitionBean;
import com.duytien.service.TaskSchedulingService;
import com.duytien.Model.Account;
import com.duytien.Model.Activity;
import com.duytien.Model.Activity_Category;
import com.duytien.Model.Assigned;
import com.duytien.Model.AssignedID;
import com.duytien.Model.Notification;
import com.duytien.Model.Project;
import com.duytien.Model.ScheduleCategory;
import com.duytien.Model.Section;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;


@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
public class TaskRestController {
	@Autowired
	SectionDAO secDAO;
	
	@Autowired
	TaskDAO taskDAO;
	
	@Autowired
	Task_SubDAO subDAO;
	
	@Autowired
	Task_PriorityDAO tpDAO;
	
	@Autowired
	Task_StatusDAO tsDAO;
	
	@Autowired
	ActivityDAO actDAO;
	
	@Autowired
	Activity_CategoryDAO cateDAO;
	@Autowired
	AssignedDAO assDAO;
	
	@Autowired
	ProjectDAO pjDAO;
	
	 @Autowired
	 TaskSchedulingService taskSchedulingService;

//	 @Autowired
//	 TaskDefinitionBean taskDefinitionBean;
	 
	 @Autowired
	 TaskDefinitionDAO sDAO;
	 @Autowired
	 ScheduleCategoryDAO scDAO;
	
	 @Autowired
	 AccountDAO accDAO;
	 
	 @Autowired
	 Team_MembersDAO tmDAO;
	 
	 @Autowired
	 Task_FileDAO fileDAO;
	 
	@GetMapping("/pmf/project/{pi}/task-all")
	public List<Task> getAllTask(@PathVariable("pi") Integer projectID){
		return taskDAO.findAllByProject(projectID,Sort.by("taskNumber").ascending());
	}
	@GetMapping("/pmf/project/{pi}/subtask-all")
	public List<Task_Sub> getAllSubTask(@PathVariable("pi") Integer projectID){
		return subDAO.getAllSubTask(projectID);
	}
	
	@GetMapping("/pmf/project/task-priority")
	public List<Task_Priority> getAllTaskPriority(){
		return tpDAO.findAll();
	}
	@GetMapping("/pmf/project/task-status")
	public List<Task_Status> getAllTaskStatus(){
		return tsDAO.findAll();
	}
	@PostMapping("/test")
	public void newtest(@RequestBody Notification noti) {
		System.out.println(noti);
	}
	
	@GetMapping("/test")
	public void test() {
		RestTemplate restTemplate = new RestTemplate();
		final String baseUrl = "http://localhost:3000/sendNotification";
		String url = "http://localhost:8080/test";
		URI uri;
		try {
			uri = new URI(baseUrl);
			Notification noti = new Notification("Test","Test again", "user111",2, -1);
//			restTemplate.postForEntity(uri, noti, String.class);
			// create headers
			HttpHeaders headers = new HttpHeaders();
			// set `content-type` header
			headers.setContentType(MediaType.APPLICATION_JSON);
			// set `accept` header
			headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

			// build the request
			HttpEntity<Notification> entity = new HttpEntity<>(noti, headers);

			// send POST request
			ResponseEntity<String> response = restTemplate.postForEntity(uri, entity, String.class);

		} catch (URISyntaxException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	@GetMapping("/test3/{username}")
	public void check(@PathVariable("username") String username) {
		Account acc = accDAO.findById(username).get();
		List<Integer> list = pjDAO.getAllProjectsRelevantToAccountPrivate(acc.getUsername(), acc.getEmail());
		List<Project> listpj = new ArrayList<>();
		for(Integer intlist : list) {
			Project pj  = pjDAO.findById(intlist).get();
			Team_Members tm = pjDAO.checkIfOwner(pj.getTeam().getTeamID());
			if(!(acc.getUsername().equals(tm.getAccount().getUsername()))) {
				listpj.add(pj);
			}
		}
			
		for(Project pj : listpj) {
			System.out.println(pj.getProjectName() + " ");
		}
	}
	
	
	
	@PostMapping("/pmf/project/task-insert/{username}")
	public void insetTask(@RequestBody ArrayList<ArrayList<Integer>> str, @PathVariable("username")String username)throws JsonMappingException, JsonProcessingException{
		for(int i = 0; i < str.size();i++) {
			ArrayList<Integer> mainAra = str.get(i);
			taskDAO.insertTaskPosition(mainAra.get(1), mainAra.get(0),mainAra.get(2),mainAra.get(3),mainAra.get(4));
			taskDAO.deleteTaskBySection(mainAra.get(0), mainAra.get(2),mainAra.get(4));
			
			String taskName = taskDAO.findById(mainAra.get(0)).get().getTaskName();
			String oldSecName = secDAO.findById(mainAra.get(2)).get().getSectionName();
			String newSecName = secDAO.findById(mainAra.get(3)).get().getSectionName();
			
			//Lịch sử hoạt động
			Activity act = new Activity();
			act.setActivity_category(cateDAO.findById(5).get());
			act.setObjectID(mainAra.get(1));
			act.setActivityName("Task (" + taskName + ") has been moved from section (" +oldSecName+") to (" +newSecName+") by ("+username+")");
			act.setStartDate(new Date());
			act.setUsername(username);
			act.setProjectID(mainAra.get(4));
			act = actDAO.save(act);	
			
			//Tạo Assigned (Chủ thể hoạt động)
			Assigned ass = new Assigned();
			ass.setStartDate(new Date());
			ass.setAssignedID(new AssignedID(username,act.getActivityID()));
			ass.setActivity(act);
			assDAO.save(ass);
		}	
		
	}
	
	@PutMapping("/pmf/project/task-update")
	public void updateTask(@RequestBody ArrayList<ArrayList<Integer>> str) throws JsonMappingException, JsonProcessingException{
		for(int i = 0; i < str.size();i++) {
			ArrayList<Integer> mainAra = str.get(i);
			System.out.println("SO A: " + mainAra.get(0));
			System.out.println("SO B: " + mainAra.get(1));
			taskDAO.updateTaskPosition(mainAra.get(1), mainAra.get(0),mainAra.get(2),mainAra.get(3));
			
		}
		
	}
	
	
	@PostMapping("/pmf/project/task-delete")
	public void deleteTask(@RequestBody ArrayList<ArrayList<Integer>> str) throws JsonMappingException, JsonProcessingException{

		for(int i = 0; i < str.size();i++) {
			ArrayList<Integer> mainAra = str.get(i);
			taskDAO.deleteTaskBySection(mainAra.get(0), mainAra.get(1),mainAra.get(2));
		}
		

	}
	
	@PostMapping("/pmf/project/task-create")
	public Task createTask(@RequestBody ArrayList<Object> str) throws JsonMappingException, JsonProcessingException{
		Section section = secDAO.findById(Integer.parseInt(String.valueOf(str.get(2)))).get();
		Task_Priority tp  = tpDAO.findById(1).get();
		Task_Status ts = tsDAO.findById(1).get();
		
		Task task = new Task();
		task.setTaskName(String.valueOf(str.get(0)));
		task.setTaskNumber(Integer.parseInt(String.valueOf(str.get(1))));
		task.setSection(section);
		task.setProjectID(Integer.parseInt(String.valueOf(str.get(3))));
		task.setCreateDate(new Date());
		task.setTask_priority(tp);
		task.setTask_status(ts);
		return taskDAO.save(task);

	}
	
	
	@PutMapping("/pmf/project/{category}/{username}/update-one-task")
	public Task updateTaskOnly(@RequestBody Task task,@PathVariable("category") Integer cate,@PathVariable("username")
			String username) throws ParseException {
		task = taskDAO.save(task);
		Project pj = pjDAO.findById(task.getProjectID()).get();
		Activity_Category category = cateDAO.findById(cate).get();
		String message = "";
		if(cate == 16) {
			SimpleDateFormat DateFor = new SimpleDateFormat("dd-M-yyyy hh:mm:ss");
			message =  username+" changed the planned start date into " + DateFor.format(task.getPlannedStartDate());
		}else if(cate == 17) {
			SimpleDateFormat DateFor = new SimpleDateFormat("dd-M-yyyy HH:mm:ss");
			message = username+" changed the planned end date into " + DateFor.format(task.getPlannedEndDate());
		    Activity act = actDAO.getAllActivitiesRelevantToTaskAssignedInfor3(pj.getProjectID(), task.getTaskID());
		    if(act != null) {
		    	if(act.getActivity_category().getCategoryID() == 10) {
		    		String jobID = UUID.randomUUID().toString().toUpperCase();
		    		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-M-yyyy HH:mm:ss");
				    LocalDateTime datetime = LocalDateTime.parse(DateFor.format(task.getPlannedEndDate()).toString(), formatter);
				    datetime = datetime.minusMinutes(60);
				    Account acc = accDAO.findById(act.getUsername()).get();
				    String cronExpression = "0 " + datetime.getMinute() + " " 
				    						+ datetime.getHour() + " " 
				    						+ datetime.getDayOfMonth() + " "
				    						+ datetime.getMonthValue() + " ? ";
		    		ScheduleCategory sc = scDAO.findById(1).get();
		    		TaskDefinition taskDefinition = 
		    				new TaskDefinition(jobID,cronExpression,
		    						null,null,"60 minutes left until the deadline",
		    						pj,task,acc,sc,1);
		    		TaskDefinitionBean bean = new TaskDefinitionBean();
		    		bean.setTaskDefinition(taskDefinition);
		    		taskSchedulingService.scheduleATask(jobID, bean, taskDefinition.getCronExpress());
		    		sDAO.save(taskDefinition);
		    		}
		    }
	        
		    

		}else if(cate == 18) {
			message = username+" changed the priority into " + task.getTask_priority().getPriorityName();
		}else if(cate == 19) {
			message = username+" changed the status into " + task.getTask_status().getStatusName();
		}else if(cate == 20) {
			message = username+" changed the status description ";
		}
		
		
		Activity act = new Activity();
		//Task
		act.setObjectID(task.getTaskID());
		//Tên activity
		act.setActivityName(message);
		//Ngày giao task
		act.setStartDate(new Date());
		act.setUsername(username);
		act.setProjectID(pj.getProjectID());
		act.setActivity_category(category);
		
		act = actDAO.save(act);
		
		//Tạo Assigned (Chủ thể hoạt động)
		Assigned ass = new Assigned();
		ass.setStartDate(new Date());
		ass.setAssignedID(new AssignedID(username,act.getActivityID()));
		ass.setActivity(act);
		assDAO.save(ass);
		
		return task;
	}

	
	@PutMapping("/pmf/project/task-update-btn")
	public ArrayList<Task> updateTaskBtn(@RequestBody ArrayList<Task> str){
		str.forEach(task -> taskDAO.save(task));
		return str;
	}
	
	
	
	
	@GetMapping("/pmf/project/{pid}/task-assigned")
	public List<Activity> getTaskAssigned(@PathVariable("pid") Integer pid){
		List<Task> listTask = pjDAO.getAllTaskByPID(pid);
		List<Activity> list = new ArrayList<>();
		for(Task task : listTask) {
			Activity act = actDAO.getAllActivitiesRelevantToTaskAssignedInfor3(pid, task.getTaskID());
			if(act != null) {							
				//Check if username exists in project
				Project pj = pjDAO.findById(act.getProjectID()).get();
				Team_Members tm = tmDAO.getMemberByUsername(act.getUsername(),pj.getTeam().getTeamID());
				if(tm != null) {
					list.add(act);
				}
			}
		} 
		return list;
	}
	
	@GetMapping("/pmf/project/{pid}/subtask-assigned")
	public List<Activity> getSubTaskAssigned(@PathVariable("pid") Integer pid){
		List<Task_Sub> listTask = pjDAO.getAllSubTaskByPID(pid);
		List<Activity> list = new ArrayList<>();
		for(Task_Sub task : listTask) {
			Activity act = actDAO.getAllActivitiesRelevantToSubTaskAssignedInfor3(pid, task.getSubID());
			if(act != null) {
				//Check if username exists in project
				Project pj = pjDAO.findById(act.getProjectID()).get();
				Team_Members tm = tmDAO.getMemberByUsername(act.getUsername(),pj.getTeam().getTeamID());
				if(tm != null) {
					list.add(act);
				}
				
			}
		} 
		return list;
	}
	
	@GetMapping("/pmf/project/{pid}/{tid}/comments")
	public List<Activity> getSubTaskAssigned(@PathVariable("pid") Integer pid,
			@PathVariable("tid") Integer tid){
		return actDAO.getAllCommentRelevantToTask(pid,tid);
	}
	
	@GetMapping("/pmf/project/{pid}/{tid}/activities-one-task")
	public List<Activity> getAllActivitiesSpecTask(@PathVariable("pid") Integer pid,
			@PathVariable("tid") Integer tid){
		return actDAO.getSpecTaskActivities(pid,tid);
	}
	
	//Giao task
	@PostMapping("/pmf/project/task-assigned")
	public void assignTaskToSomeOne(@RequestBody ArrayList<Object> obj){
		
		Task task = taskDAO.findById(Integer.parseInt(String.valueOf(obj.get(2)))).get();
		Activity_Category category = cateDAO.findById(9).get();
		
		
		Activity act = new Activity();
		//Task
		act.setObjectID(Integer.parseInt(String.valueOf(obj.get(2))));
		//Tên activity
		act.setActivityName("The Project Owner("+String.valueOf(obj.get(0)) +  ") has handled the task " 
		+ task.getTaskName() + " for the member (" + String.valueOf(obj.get(1))+")");
		//Ngày giao task
		act.setStartDate(new Date()); 
		act.setUsername(String.valueOf(obj.get(1)));
		act.setProjectID(Integer.parseInt(String.valueOf(obj.get(3))));
		act.setActivity_category(category);
		
		act = actDAO.save(act);
		
		System.out.println(act.getActivityID());
		System.out.println(act.getActivityName());
		
		//Tạo Assigned (Chủ thể hoạt động)
		Assigned ass = new Assigned();
		ass.setStartDate(new Date());
		ass.setAssignedID(new AssignedID(String.valueOf(obj.get(0)),act.getActivityID()));
		ass.setActivity(act);
		assDAO.save(ass);
		

	}
	
	
	@PostMapping("/pmf/project/accept-task-assigned")
	public void acceptAssignedTask(@RequestBody ArrayList<Object> obj){
		
		Task task = taskDAO.findById(Integer.parseInt(String.valueOf(obj.get(1)))).get();
		Activity_Category category = cateDAO.findById(10).get();
		
		
		Activity act = new Activity();
		//Task
		act.setObjectID(Integer.parseInt(String.valueOf(obj.get(1))));
		//Tên activity
		act.setActivityName("The member ("+String.valueOf(obj.get(0)) +  ") has acepted to handle the task " 
		+ task.getTaskName() );
		//Ngày giao task
		act.setStartDate(new Date());

		act.setUsername(String.valueOf(obj.get(0)));
		act.setProjectID(Integer.parseInt(String.valueOf(obj.get(2))));
		act.setActivity_category(category);
		
		act = actDAO.save(act);
			
		//Tạo Assigned (Chủ thể hoạt động)
		Assigned ass = new Assigned();
		ass.setStartDate(new Date());
		ass.setAssignedID(new AssignedID(String.valueOf(obj.get(0)),act.getActivityID()));
		ass.setActivity(act);
		assDAO.save(ass);
		
		Project pj = pjDAO.findById(Integer.parseInt(String.valueOf(obj.get(2)))).get();
		
		SimpleDateFormat DateFor = new SimpleDateFormat("dd-M-yyyy HH:mm:ss");
		String jobID = UUID.randomUUID().toString().toUpperCase();
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-M-yyyy HH:mm:ss");
	    LocalDateTime datetime = LocalDateTime.parse(DateFor.format(task.getPlannedEndDate()).toString(), formatter);
	    datetime = datetime.minusMinutes(60);
	    Account acc = accDAO.findById(String.valueOf(obj.get(0))).get();
	    String cronExpression = "0 " + datetime.getMinute() + " " 
	    						+ datetime.getHour() + " " 
	    						+ datetime.getDayOfMonth() + " "
	    						+ datetime.getMonthValue() + " ? ";
		ScheduleCategory sc = scDAO.findById(1).get();
		TaskDefinition taskDefinition = 
				new TaskDefinition(jobID,cronExpression,
						null,null,"60 minutes left until the deadline",
						pj,task,acc,sc,1);
		TaskDefinitionBean bean = new TaskDefinitionBean();
		bean.setTaskDefinition(taskDefinition);
		taskSchedulingService.scheduleATask(jobID, bean, taskDefinition.getCronExpress());
		sDAO.save(taskDefinition);
	}
	
	
	@PostMapping("/pmf/project/refuse-task-assigned")
	public void refuseAssignedTask(@RequestBody ArrayList<Object> obj){
		
		Task task = taskDAO.findById(Integer.parseInt(String.valueOf(obj.get(1)))).get();
		Activity_Category category = cateDAO.findById(11).get();
		
		
		Activity act = new Activity();
		//Task
		act.setObjectID(Integer.parseInt(String.valueOf(obj.get(1))));
		//Tên activity
		act.setActivityName("The member ("+String.valueOf(obj.get(0)) +  ") has refused to handle the task " 
		+ task.getTaskName() + " with reason '"+String.valueOf(obj.get(3)) + " '");
		//Ngày giao task
		act.setStartDate(new Date());
		act.setDiscription(String.valueOf(obj.get(3)));
		act.setUsername(String.valueOf(obj.get(0)));
		act.setProjectID(Integer.parseInt(String.valueOf(obj.get(2))));
		act.setActivity_category(category);
		
		act = actDAO.save(act);
		

		
		//Tạo Assigned (Chủ thể hoạt động)
		Assigned ass = new Assigned();
		ass.setStartDate(new Date());
		ass.setAssignedID(new AssignedID(String.valueOf(obj.get(0)),act.getActivityID()));
		ass.setActivity(act);
		assDAO.save(ass);
		

	}
	//Cancel task
	
	@PostMapping("/pmf/project/cancel-task-assigned")
	public void cancelAssignedTask(@RequestBody ArrayList<Object> obj){
		
		Task task = taskDAO.findById(Integer.parseInt(String.valueOf(obj.get(1)))).get();
		Activity_Category category = cateDAO.findById(22).get();
		
		
		Activity act = new Activity();
		//Task
		act.setObjectID(Integer.parseInt(String.valueOf(obj.get(1))));
		//Tên activity
		act.setActivityName("Project Owner ("+String.valueOf(obj.get(0)) +  ") has canceled the assigning task " 
		+ task.getTaskName() + " with reason '"+String.valueOf(obj.get(3)) + " '");
		//Ngày giao task
		act.setStartDate(new Date());
		act.setDiscription(String.valueOf(obj.get(3)));
		act.setUsername(String.valueOf(obj.get(4)));
		act.setProjectID(Integer.parseInt(String.valueOf(obj.get(2))));
		act.setActivity_category(category);
		
		act = actDAO.save(act);
		

		
		//Tạo Assigned (Chủ thể hoạt động)
		Assigned ass = new Assigned();
		ass.setStartDate(new Date());
		ass.setAssignedID(new AssignedID(String.valueOf(obj.get(0)),act.getActivityID()));
		ass.setActivity(act);
		assDAO.save(ass);
		

	}
	
	//Giao subtask
	@PostMapping("/pmf/project/subtask-assigned")
	public void assignSubTaskToSomeOne(@RequestBody ArrayList<Object> obj){
		
		Task_Sub subtask = subDAO.findById(Integer.parseInt(String.valueOf(obj.get(2)))).get();
		Activity_Category category = cateDAO.findById(12).get();
		

		Activity act = new Activity();
		//Task
		act.setObjectID(Integer.parseInt(String.valueOf(obj.get(2))));
		//Tên activity
		act.setActivityName("The Project Owner("+String.valueOf(obj.get(0)) +  ") has handled the subtask " 
		+ subtask.getDiscription() +" của task " + subtask.getTask().getTaskName()  + " for the member (" + String.valueOf(obj.get(1))+")");
		//Ngày giao task
		act.setStartDate(new Date());
		act.setUsername(String.valueOf(obj.get(1)));
		act.setProjectID(Integer.parseInt(String.valueOf(obj.get(3))));
		act.setActivity_category(category);
		
		act = actDAO.save(act);
		
		System.out.println(act.getActivityID());
		System.out.println(act.getActivityName());
		
		//Tạo Assigned (Chủ thể hoạt động)
		Assigned ass = new Assigned();
		ass.setStartDate(new Date());
		ass.setAssignedID(new AssignedID(String.valueOf(obj.get(0)),act.getActivityID()));
		ass.setActivity(act);
		assDAO.save(ass);
		

	}
	
	//Chấp nhận subtask
	
	@PostMapping("/pmf/project/accept-subtask-assigned")
	public void acceptAssignedSubTask(@RequestBody ArrayList<Object> obj){
		
		Task_Sub subtask = subDAO.findById(Integer.parseInt(String.valueOf(obj.get(1)))).get();
		Activity_Category category = cateDAO.findById(13).get();
		
		
		Activity act = new Activity();
		//Task
		act.setObjectID(Integer.parseInt(String.valueOf(obj.get(1))));
		//Tên activity
		act.setActivityName("The member ("+String.valueOf(obj.get(0)) +  ") has acepted to handle the subtask " 
		+ subtask.getDiscription() +" of the task " + subtask.getTask().getTaskName() );
		//Ngày giao task
		act.setStartDate(new Date());
		
		act.setUsername(String.valueOf(obj.get(0)));
		act.setProjectID(Integer.parseInt(String.valueOf(obj.get(2))));
		act.setActivity_category(category);
		
		act = actDAO.save(act);
		

		
		//Tạo Assigned (Chủ thể hoạt động)
		Assigned ass = new Assigned();
		ass.setStartDate(new Date());
		ass.setAssignedID(new AssignedID(String.valueOf(obj.get(0)),act.getActivityID()));
		ass.setActivity(act);
		assDAO.save(ass);
		
		

	}
	
	//Từ chối subtask
	@PostMapping("/pmf/project/refuse-subtask-assigned")
	public void refuseAssignedSubTask(@RequestBody ArrayList<Object> obj){
		System.out.println(obj);
		Task_Sub subtask = subDAO.findById(Integer.parseInt(String.valueOf(obj.get(1)))).get();
		Activity_Category category = cateDAO.findById(14).get();
		
		
		Activity act = new Activity();
		//Task
		act.setObjectID(Integer.parseInt(String.valueOf(obj.get(1))));
		//Tên activity
		act.setActivityName("The member ("+String.valueOf(obj.get(0)) +  ") has refused to handle the subtask " 
		+ subtask.getDiscription() +" of the task " + subtask.getTask().getTaskName() 
		+ " with reason '" + String.valueOf(obj.get(3))+ " '");
		act.setDiscription(String.valueOf(obj.get(3)));
		//Ngày giao task
		act.setStartDate(new Date());

		act.setUsername(String.valueOf(obj.get(0)));
		act.setProjectID(Integer.parseInt(String.valueOf(obj.get(2))));
		act.setActivity_category(category);
		
		act = actDAO.save(act);
		
		//Tạo Assigned (Chủ thể hoạt động)
		Assigned ass = new Assigned();
		ass.setStartDate(new Date());
		ass.setAssignedID(new AssignedID(String.valueOf(obj.get(0)),act.getActivityID()));
		ass.setActivity(act);
		assDAO.save(ass);
		

	}
	
	//Cancel subtask
	@PostMapping("/pmf/project/cancel-subtask-assigned")
	public void cancelAssignedSubTask(@RequestBody ArrayList<Object> obj){
		System.out.println(obj);
		Task_Sub subtask = subDAO.findById(Integer.parseInt(String.valueOf(obj.get(1)))).get();
		Activity_Category category = cateDAO.findById(23).get();
		
		
		Activity act = new Activity();
		//Task
		act.setObjectID(Integer.parseInt(String.valueOf(obj.get(1))));
		//Tên activity
		act.setActivityName("Project Owner ("+String.valueOf(obj.get(0)) +  ") has canceled the assigning subtask " 
		+ subtask.getDiscription() +" of the task " + subtask.getTask().getTaskName() 
		+ " with reason '" + String.valueOf(obj.get(3))+ " '");
		act.setDiscription(String.valueOf(obj.get(3)));
		//Ngày giao task
		act.setStartDate(new Date());

		act.setUsername(String.valueOf(obj.get(4)));
		act.setProjectID(Integer.parseInt(String.valueOf(obj.get(2))));
		act.setActivity_category(category);
		
		act = actDAO.save(act);
		

		
		//Tạo Assigned (Chủ thể hoạt động)
		Assigned ass = new Assigned();
		ass.setStartDate(new Date());
		ass.setAssignedID(new AssignedID(String.valueOf(obj.get(0)),act.getActivityID()));
		ass.setActivity(act);
		assDAO.save(ass);
		

	}
	
	
	
	@PutMapping("/pmf/project/subtask-check")
	public Task_Sub checkboxSubtask(@RequestBody ArrayList<Integer> obj){
		Task_Sub sub = subDAO.findById(obj.get(0)).get();
		sub.setStatus(obj.get(1) == 1 ? true : false);
		return subDAO.save(sub);
	}
	
	@PostMapping("/pmf/project/subtask-create")
	public Task_Sub createSubtask(@RequestBody ArrayList<Object> obj){
		Task_Sub sub = new Task_Sub();
		Task task = taskDAO.findById(Integer.parseInt(String.valueOf(obj.get(0)))).get();
		sub.setTask(task);
		sub.setDiscription(String.valueOf(obj.get(1)));
		sub.setStatus(false);
		return subDAO.save(sub);
	}
	
	
	//Comments

	@PostMapping("/pmf/project/comment-create")
	public void comment(@RequestBody ArrayList<Object> obj){
		
		Task task = taskDAO.findById(Integer.parseInt(String.valueOf(obj.get(1)))).get();
		Activity_Category category = cateDAO.findById(15).get();
		
		
		Activity act = new Activity();
		//Task
		act.setObjectID(Integer.parseInt(String.valueOf(obj.get(1))));
		//Tên activity
		act.setActivityName("Thành viên("+String.valueOf(obj.get(3)) +  ") bình luận task " 
		+ task.getTaskName() + " với nội dung ' " + String.valueOf(obj.get(2))+" '");
		//Ngày giao task
		act.setStartDate(new Date());
		act.setUsername(String.valueOf(obj.get(3)));
		act.setProjectID(Integer.parseInt(String.valueOf(obj.get(0))));
		act.setActivity_category(category);
		act.setDiscription(String.valueOf(obj.get(2)));
		act = actDAO.save(act);
		
		
		//Tạo Assigned (Chủ thể hoạt động)
		Assigned ass = new Assigned();
		ass.setStartDate(new Date());
		ass.setAssignedID(new AssignedID(String.valueOf(obj.get(3)),act.getActivityID()));
		ass.setActivity(act);
		assDAO.save(ass);
		

		}
		
		
		@PutMapping("/pmf/project/update-task-name")
		public void changeNameTask(@RequestBody ArrayList<Object> str) throws JsonMappingException, JsonProcessingException{
			Task task = taskDAO.findTaskByProject
					(Integer.parseInt(String.valueOf(str.get(1))), Integer.parseInt(String.valueOf(str.get(2))));
			task.setTaskName(String.valueOf(str.get(4)));
			task = taskDAO.save(task);

			Activity_Category category = cateDAO.findById(25).get();
			Activity act = new Activity();
			//Task
			act.setObjectID(task.getTaskID());
			//Tên activity
			act.setActivityName("The Project Owner("+String.valueOf(str.get(0)) +  ") has changed the name of the task " 
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
		
		@PutMapping("/pmf/project/update-subtask-name")
		public void changeNameSubTask(@RequestBody ArrayList<Object> str) throws JsonMappingException, JsonProcessingException{
			Task_Sub sub = subDAO.findById(Integer.parseInt(String.valueOf(str.get(2)))).get();
			sub.setDiscription(String.valueOf(str.get(4)));
			sub = subDAO.save(sub);

			Activity_Category category = cateDAO.findById(26).get();
			Activity act = new Activity();
			//Task
			act.setObjectID(sub.getSubID());
			//Tên activity
			act.setActivityName("The Project Owner("+String.valueOf(str.get(0)) +  ") has changed the name of the subtask " 
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
		@GetMapping("/pmf/project/{tid}/check-delete-task")
		public Boolean checkBeforeDeleteTask(@PathVariable("tid") Integer tid) {
			Task task = taskDAO.findById(tid).get();
			Activity act = actDAO.getAllActivitiesRelevantToTaskAssignedInfor3(task.getProjectID(),task.getTaskID());
			if(act != null) {
				if(act.getActivity_category().getCategoryID() == 9 || act.getActivity_category().getCategoryID() == 10) {
					return false;
				}
			}
			if(task.getTask_sub().size() != 0) {
				return false;
			}
			return true;
		}
		
		@DeleteMapping("/pmf/project/delete-task")
		public void deleteTask2(@RequestBody ArrayList<Object> str) throws JsonMappingException, JsonProcessingException{
			Task task = taskDAO.findById(Integer.parseInt(String.valueOf(str.get(2)))).get();
			
			Activity_Category category = cateDAO.findById(28).get();
			Activity act = new Activity();
			//Task
			act.setObjectID(task.getTaskID());
			//Tên activity
			act.setActivityName("The Project Owner("+String.valueOf(str.get(0)) +  ") has deleted the task " 
			+ task.getTaskName() + " with reason '"+String.valueOf(str.get(3))+"'");
			//Ngày giao task
			act.setStartDate(new Date()); 
			act.setUsername(null);
			act.setProjectID(Integer.parseInt(String.valueOf(str.get(1))));
			act.setActivity_category(category);
			
			sDAO.deleteAllSheduleByTask(task.getTaskID());
			fileDAO.deleteAllTaskFileByTask(task.getTaskID());
			taskDAO.delete(task);
			act = actDAO.save(act);
			
			
			
			//Tạo Assigned (Chủ thể hoạt động)
			Assigned ass = new Assigned();
			ass.setStartDate(new Date());
			ass.setAssignedID(new AssignedID(String.valueOf(str.get(0)),act.getActivityID()));
			ass.setActivity(act);
			assDAO.save(ass);
		}
		
		@GetMapping("/pmf/project/{suid}/check-delete-subtask")
		public Boolean checkBeforeDeleteSubTask(@PathVariable("suid") Integer suid) {
			Task_Sub sub = subDAO.findById(suid).get();
			Activity act = actDAO.getAllActivitiesRelevantToSubTaskAssignedInfor3(sub.getTask().getProjectID(),sub.getSubID());
			if(act != null) {
				if(act.getActivity_category().getCategoryID() == 12 || act.getActivity_category().getCategoryID() == 13) {
					return false;
				}
			}
			return true;
		}
		
		@DeleteMapping("/pmf/project/delete-subtask")
		public void deleteSubTask2(@RequestBody ArrayList<Object> str) throws JsonMappingException, JsonProcessingException{
			Task_Sub sub = subDAO.findById(Integer.parseInt(String.valueOf(str.get(2)))).get();
			
			Activity_Category category = cateDAO.findById(29).get();
			Activity act = new Activity();
			//Task
			act.setObjectID(sub.getSubID());
			//Tên activity
			act.setActivityName("The Project Owner("+String.valueOf(str.get(0)) +  ") has deleted the subtask " 
			+ sub.getDiscription() + " with reason '"+String.valueOf(str.get(3))+"'");
			//Ngày giao task
			act.setStartDate(new Date()); 
			act.setUsername(null);
			act.setProjectID(Integer.parseInt(String.valueOf(str.get(1))));
			act.setActivity_category(category);
			

			subDAO.delete(sub);
			act = actDAO.save(act);
			
			
			
			//Tạo Assigned (Chủ thể hoạt động)
			Assigned ass = new Assigned();
			ass.setStartDate(new Date());
			ass.setAssignedID(new AssignedID(String.valueOf(str.get(0)),act.getActivityID()));
			ass.setActivity(act);
			assDAO.save(ass);
		}
		
		@GetMapping("/pmf/project/{tid}/check-delete-all-subtask")
		public Boolean checkBeforeDeleteAllSubTask(@PathVariable("tid") Integer tid) {
			Task task = taskDAO.findById(tid).get();
			List<Task_Sub> listsub = task.getTask_sub();
			if(listsub.size() != 0) {
				for(Task_Sub sub : listsub) {
					Activity act = actDAO.getAllActivitiesRelevantToSubTaskAssignedInfor3(sub.getTask().getProjectID(),sub.getSubID());
					if(act != null) {
						if(act.getActivity_category().getCategoryID() == 12 || act.getActivity_category().getCategoryID() == 13) {
							return false;
						}
					}
				}
			}else {
				return false;
			}
			return true;
		}
		
		@DeleteMapping("/pmf/project/delete-all-subtask")
		public void deleteAllSubTask2(@RequestBody ArrayList<Object> str) throws JsonMappingException, JsonProcessingException{
			Task task = taskDAO.findById(Integer.parseInt(String.valueOf(str.get(2)))).get();
			List<Task_Sub> listsub = task.getTask_sub();
			
			for(Task_Sub sub : listsub) {
				Activity_Category category = cateDAO.findById(29).get();
				Activity act = new Activity();
				//Task
				act.setObjectID(sub.getSubID());
				//Tên activity
				act.setActivityName("The Project Owner("+String.valueOf(str.get(0)) +  ") has deleted the subtask " 
				+ sub.getDiscription() + " with reason '"+String.valueOf(str.get(3))+"'");
				//Ngày giao task
				act.setStartDate(new Date()); 
				act.setUsername(null);
				act.setProjectID(Integer.parseInt(String.valueOf(str.get(1))));
				act.setActivity_category(category);
				

				subDAO.delete(sub);
				act = actDAO.save(act);
				
				
				
				//Tạo Assigned (Chủ thể hoạt động)
				Assigned ass = new Assigned();
				ass.setStartDate(new Date());
				ass.setAssignedID(new AssignedID(String.valueOf(str.get(0)),act.getActivityID()));
				ass.setActivity(act);
				assDAO.save(ass);
			}
		}
		
		@GetMapping("/pmf/project/{tid}/check-cancel-all-subtask")
		public Boolean checkBeforeCancelAllSubTask(@PathVariable("tid") Integer tid) {
			Task task = taskDAO.findById(tid).get();
			List<Task_Sub> listsub = task.getTask_sub();
			if(listsub.size() != 0) {
				for(Task_Sub sub : listsub) {
					Activity act = actDAO.getAllActivitiesRelevantToSubTaskAssignedInfor3(sub.getTask().getProjectID(),sub.getSubID());
					if(act != null) {
						if(act.getActivity_category().getCategoryID() == 12 || act.getActivity_category().getCategoryID() == 13) {
							return true;
						}
					}
				}
			}else {
				return false;
			}
			return false;
		}
		
		//Cancel subtask
		@PostMapping("/pmf/project/cancel-all-subtask")
		public void cancelAllAssignedSubTask(@RequestBody ArrayList<Object> obj){
			Task task = taskDAO.findById(Integer.parseInt(String.valueOf(obj.get(2)))).get();
			List<Task_Sub> listsub = task.getTask_sub();
			Activity_Category category = cateDAO.findById(23).get();
			for(Task_Sub subtask : listsub) {
				Activity subACT = actDAO.getAllActivitiesRelevantToSubTaskAssignedInfor3(task.getProjectID(),subtask.getSubID());
				if(subACT.getActivity_category().getCategoryID() == 12 || subACT.getActivity_category().getCategoryID() == 13) {
					Activity act = new Activity();
					//Task
					act.setObjectID(subtask.getSubID());
					//Tên activity
					act.setActivityName("Project Owner ("+String.valueOf(obj.get(0)) +  ") has canceled the assigning subtask " 
					+ subtask.getDiscription() +" of the task " + subtask.getTask().getTaskName() 
					+ " with reason '" + String.valueOf(obj.get(3))+ " '");
					act.setDiscription(String.valueOf(obj.get(3)));
					//Ngày giao task
					act.setStartDate(new Date());

					act.setUsername(subACT.getUsername());
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
			}
			
			
			

		}
		

}
