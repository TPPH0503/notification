package com.duytien.Controller;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.duytien.Dao.*;
import com.duytien.Model.*;
@CrossOrigin("*")
@RestController
public class ActivityController {
    @Autowired
    ActivityDAO ActivityDAO;
    @Autowired
    ProjectDAO ProjectDAO;
    @Autowired
    AccountDAO accDAO;
    @Autowired
    TaskDAO taskDAO;
    @Autowired
    Task_SubDAO subDAO;
    
    @GetMapping("/pmf/Activity/getActivity")
    public List<Activity> getListActivity() {
        List<Activity> Activity = ActivityDAO.findAll();
        return Activity;
    }
    
    @GetMapping("/pmf/Activity/getListActivityForAdmin")
    public List<Activity> getListActivityForAdmin() {
        List<Activity> Activity = ActivityDAO.listActivityForAdmin();
        return Activity;
    }
    
    @GetMapping("/pmf/Acivity/findActivity/{data}")
    public List<Activity> findActivity(@PathVariable("data") String data) {
        List<Activity> Activity = ActivityDAO.findActivityForAdmin(data);
        return Activity;
    }
    
    @GetMapping("/pmf/Activity/getListAmountForAdmin")
    public List<Activity> getListAmountForAdmin() {
        List<Activity> Activity = ActivityDAO.listAmountForAdmin();
        return Activity;
    }
    
    @GetMapping("/pmf/Activity/findAmount/{data}")
    public List<Activity> findAmountForAdmin(@PathVariable("data") String data) {
        List<Activity> Activity = ActivityDAO.findAmountForAdmin(data);
        return Activity;
    }

    @GetMapping("/pmf/Activity/getActivitiesRelevantToProjectAndAccount/{projectid}/{username}")
    public List<Activity> getAllActivitiesRelevantToProjectAndAccount(@PathVariable("projectid") int projectID, @PathVariable("username") String username) {
        List<Activity> Activity = ActivityDAO.getAllActivitiesRelevantToProjectAndAccount(projectID, username);
        return Activity;
    }
    
    //Client
    @GetMapping("/pmf/Activity/getAllActivitiesRelevantToInvitationInfor/{projectid}/{username}")
    public List<Activity> getAllActivitiesRelevantToInvitationInfor(@PathVariable("projectid") int projectID, @PathVariable("username") String username) {
        Account acc = accDAO.findById(username).get();
    	List<Activity> Activity = ActivityDAO.getAllActivitiesRelevantToInvitationInfor(projectID, username,acc.getEmail());
        return Activity;
    }
    
    @GetMapping("/pmf/Activity/getAllActivitiesRelevantToTaskAssignedInfor/{projectid}/{username}")
    public List<Activity> getAllActivitiesRelevantToTaskAssignedInfor(@PathVariable("projectid") int projectID, @PathVariable("username") String username) {
        List<Activity> Activity = ActivityDAO.getAllActivitiesRelevantToTaskAssignedInfor(projectID, username);
        return Activity;
    }
    
    @GetMapping("/pmf/Activity/getAllActivitiesRelevantToSubTaskAssignedInfor/{projectid}/{username}")
    public List<Activity> getAllActivitiesRelevantToSubTaskAssignedInfor(@PathVariable("projectid") int projectID, @PathVariable("username") String username) {
        List<Activity> Activity = ActivityDAO.getAllActivitiesRelevantToSubTaskAssignedInfor(projectID, username);
        return Activity;
    }
    
    //Admin
    @GetMapping("/pmf/Activity/getAllActivitiesRelevantToInvitationInforAdmin/{projectid}")
    public List<Activity> getAllActivitiesRelevantToInvitationInforAdmin(@PathVariable("projectid") int projectID) {
        List<Activity> Activity = ActivityDAO.getAllActivitiesRelevantToInvitation(projectID);
        return Activity;
    }
    
    @GetMapping("/pmf/Activity/getAllActivitiesRelevantToTaskAssignedInforAdmin/{projectid}")
    public List<Activity> getAllActivitiesRelevantToTaskAssignedInforAdmin(@PathVariable("projectid") int projectID) {
        List<Activity> Activity = ActivityDAO.getAllActivitiesRelevantToTaskAssigned(projectID);
        return Activity;
    }
    
    @GetMapping("/pmf/Activity/getAllActivitiesRelevantToSubTaskAssignedInforAdmin/{projectid}")
    public List<Activity> getAllActivitiesRelevantToSubTaskAssignedInforAdmin(@PathVariable("projectid") int projectID) {
        List<Activity> Activity = ActivityDAO.getAllActivitiesRelevantToSubTaskAssigned(projectID);
        return Activity;
    }
    
    @GetMapping("/pmf/Activity/getObjectIdByUserAndCate/{username}/{cate}")
    public Integer getObjectIdByUserAndCate(@PathVariable("username") String username, @PathVariable("cate") int cate) {
    	List<Activity> activity = ActivityDAO.getObjectIdByUserAndCate(username, cate);
        return activity.get(0).getObjectID();
    }
    
    @GetMapping("/pmf/Activity/getAllActivitiesRelevantToTaskAssignedInfor3/{projectid}/{username}")
    public List<Integer> getAllActivitiesRelevantToTaskAssignedInfor3(@PathVariable("projectid") int projectID, @PathVariable("username") String username) {
    	List<Integer> list = new ArrayList<>();
    	
    	int chart1 = 0;
    	int chart2 = 0;
    	int chart3 = 0;
    	int chart4 = 0;	 
    	
    	List<Task> listTask = ProjectDAO.getAllTaskByPID(projectID);
    	
    		for(Task task : listTask) {
    			Activity act = ActivityDAO.getAllActivitiesRelevantToTaskAssignedInfor3(projectID, task.getTaskID());
    			if(act != null) {			
    				if(act.getUsername().equals(username)) {
    					if(act.getActivity_category().getCategoryID() == 10) {
    						Integer stt = ActivityDAO.getTaskStatusByProjectAndUser(projectID, act.getObjectID());
        		    		if(stt != null) {
        						if(stt == 1) {
        							chart1++;
        						}
        						else if(stt == 2){
        							chart2++;
        						}
        						else if(stt == 3){
        							chart3++;
        						}
        						else if(stt == 4){
        							chart4++;
        						}
        		    		}
    					}
    				}
    				
    			}
    			
    		} 
    		list.add(chart1);
        	list.add(chart2);
        	list.add(chart3);
        	list.add(chart4);
        return list;
    }
    
    @GetMapping("/pmf/Activity/getAllActivitiesRelevantToSubTaskAssignedInfor3/{projectid}/{username}")
    public List<Integer> getAllActivitiesRelevantToSubTaskAssignedInfor3(@PathVariable("projectid") int projectID, @PathVariable("username") String username) {
    	List<Integer> list = new ArrayList<>();
    	
    	int chart0 = 0;
    	int chart1 = 0;
    	
    	List<Task_Sub> listTask = ProjectDAO.getAllSubTaskByPID(projectID);
    	
    		for(Task_Sub task : listTask) {
    			Activity act = ActivityDAO.getAllActivitiesRelevantToSubTaskAssignedInfor3(projectID, task.getSubID());
    			if(act != null) {			
    				if(act.getUsername().equals(username)) {
    					if(act.getActivity_category().getCategoryID() == 13) {
    						Boolean stt = ActivityDAO.getSubTaskStatusByProjectAndUser(projectID, act.getObjectID());
        		    		if(stt != null) {
        						if(stt == true) {
        							chart1++;
        						}
        						else if(stt == false){
        							chart0++;
        						}
//        						System.out.println(act.getObjectID() + " - " + act.getActivityName() + " - " + act.getUsername());
        		    		}
    					}
    				}
    				
    			}
    			
    		} 
    		list.add(chart0);
    		list.add(chart1);
        return list;
    }
    
    
    @GetMapping("pmf/Activity/getAllActivitiesRelevantToAssignedInfor3/{projectid}/{username}")
    public List<Chart2> getAllActivitiesRelevantToAssignedInfor3(@PathVariable("projectid") int projectID, @PathVariable("username") String username) {
    	List<Chart2> list = new ArrayList<>();
    	
    	List<Activity> listTask = ActivityDAO.getAllActivitiesRelevantToAssignedInfor3(projectID,username);
    	
    		for(Activity act : listTask) {
    			
    			Chart2 chart = new Chart2();
    			int cate = act.getActivity_category().getCategoryID();
    			
    			if(cate == 11 || cate == 9 || cate == 10) {
    				
    				try {
    					chart.setCate(true);
    					chart.setDescription(act.getDiscription());
    					chart.setDate(act.getStartDate());
    					chart.setName(taskDAO.findById(act.getObjectID()).get().getTaskName());
    					
        				if(cate == 9) {
        					chart.setStt(1);
        				}else if(cate == 10) {
        					chart.setStt(2);
        				}else if(cate == 11) {
        					chart.setStt(3);
        				}
        				list.add(chart);
    				}catch(Exception e) {
    					
    				}
    						
    			}else if(cate == 12 || cate == 13 || cate == 14){				
    				try {
    					chart.setCate(false);
    					chart.setDescription(act.getDiscription());
    					chart.setDate(act.getStartDate());
    					chart.setName(subDAO.findById(act.getObjectID()).get().getDiscription());
    					
        				if(cate == 12) {
        					chart.setStt(1);
        				}else if(cate == 13) {
        					chart.setStt(2);
        				}else if(cate == 14) {
        					chart.setStt(3);
        				}
        				list.add(chart);
    				}catch(Exception e) {
    					
    				}
    			}
    			
    			
    		} 

        return list;
    }
    
    @GetMapping("pmf/Activity/getAllActivitiesRelevantToTaskOverdue/{projectid}/{username}")
    public List<Chart2> getAllActivitiesRelevantToTaskOverdue(@PathVariable("projectid") int projectID, @PathVariable("username") String username) {
    	
    	List<Chart2> list = new ArrayList<>();
    	
    	List<Activity> listTask2 = ActivityDAO.getAllActivitiesRelevantToAssignedInfor3(projectID,username);
    		
    		for(Activity act : listTask2) {
    			if(act.getActivity_category().getCategoryID() == 10) {
	    				Activity act1 = ActivityDAO.getAllActivitiesRelevantToTaskOverdue(projectID,act.getObjectID());
		    			Chart2 chart = new Chart2();
		    			if(act1 != null) {
		    				Task task = taskDAO.findById(act1.getObjectID()).get();
		    				System.out.println(task.getPlannedEndDate());
			    			int count = 0;
			    			if(act1.getActivityName().contains("On track") || act1.getActivityName().contains("At risk") || act1.getActivityName().contains("Off track") && act1.getStartDate().compareTo(task.getPlannedEndDate()) > 0) {
			    				for (int i = 0; i < list.size(); i++) {
									if(list.get(i).getDate() == act1.getStartDate()) {
										count++;
									}
								}
			    				try {
			    					if(count < 1) {
				    					chart.setCate(true);
				    					chart.setDescription("The planned end date of task: "+ task.getPlannedEndDate());
				    					chart.setDate(act1.getStartDate());
				    					chart.setName(taskDAO.findById(act1.getObjectID()).get().getTaskName());
				    					chart.setStt(act.getActivityID());
				        				list.add(chart);
			    					}
			    				}catch(Exception e) {
			    					
			    				}
			    						
			    			}
		    			}else {
		    				Task task = taskDAO.findById(act.getObjectID()).get();
			    			if(act.getStartDate().compareTo(task.getPlannedEndDate()) > 0) {
			    				System.out.println("oke");
			    				chart.setCate(true);
		    					chart.setDescription("The planned end date of task: "+ task.getPlannedEndDate());
		    					chart.setDate(task.getPlannedEndDate());
		    					chart.setName(taskDAO.findById(act.getObjectID()).get().getTaskName());
		    					chart.setStt(act.getActivityID());
		        				list.add(chart);
			    			}
		    			}
    			}
    		} 
        return list;
    }
}
