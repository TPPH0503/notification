package com.duytien.Controller;

import java.util.ArrayList;
import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.duytien.Dao.*;
import com.duytien.Model.*;

@CrossOrigin("*")
@RestController
public class ReportController {
	@Autowired
    AccountDAO accountDAO;
	
	@Autowired
    ActivityDAO actDAO;
	
	@Autowired
	ProjectDAO proDAO;
	
	@Autowired
	TaskDAO taskDAO;
	
	
	//Hien thi so luong task theo statusID
    @GetMapping("/pmf/Report/countTask/{username}/{stt}")
    public Integer countTask(@PathVariable("username")String id, @PathVariable("stt") Integer stt) {
    	if(stt == 1) {
    		return accountDAO.countTask_Incomplete(id);
    	}else if(stt == 3) {
    		return accountDAO.countTask_High(id);
    	}else {
    		return accountDAO.countTask(id, stt);
    	}
    }
    
    //Hien thi tong so luong task 
    @GetMapping("/pmf/Report/totalTask/{username}")
    public Integer totalTask(@PathVariable("username")String id) {
    	System.out.println("SL Task: " + accountDAO.totalTask(id));
        return accountDAO.totalTask(id);
    }
    
    //Hien thi so luong task trong project dua theo username
    @GetMapping("/pmf/Report/countTaskInProject/{username}")
    public List<Chart> countTaskInProject(@PathVariable("username")String id) {
    	List<Chart> list = new ArrayList<>();
    	System.out.println(accountDAO.countTaskInProjectInteger(id).size());
    	for (int i = 0; i < accountDAO.countTaskInProjectInteger(id).size(); i++) {   
    		Chart chart = new Chart();
    		chart.setValue(accountDAO.countTaskInProjectInteger(id).get(i));
    		chart.setName(accountDAO.countTaskInProjectString(id).get(i));
    		list.add(i, chart);
		}
        return list;
    }
    
    //Hien thi tong so luong project                    
    @GetMapping("/pmf/Report/countProject/{username}")
    public Integer countProject(@PathVariable("username")String id) {
    	System.out.println("SL PJ: " + accountDAO.countProject(id));
        return accountDAO.countProject(id);
    }
   
    //Hien thi so luong project theo statusID
    @GetMapping("/pmf/Report/countProjectStatus/{username}/{stt}")
    public Integer countProjectStatus(@PathVariable("username")String id, @PathVariable("stt") Integer stt) {
    	System.out.println("STT "+stt+" Value "+accountDAO.countProjectStatus(id, stt));
        return accountDAO.countProjectStatus(id, stt);
    }
    
    //Hien thi số lượng task trong tung project của 1 user theo priority                  
    @GetMapping("/pmf/Report/countTask_Priority/{username}/{stt}")
    public List<Integer> countTask_Priority(@PathVariable("username")String id, @PathVariable("stt") Integer stt) {
    	System.out.println("Priority ID: "+stt+" "+accountDAO.countTask_Priority(id, stt));
        return accountDAO.countTask_Priority(id, stt);
    }
    
    //Hien thi tat ca ten project của 1 user                
    @GetMapping("/pmf/Report/showProjectName/{username}")
    public List<String> countTask_Priority(@PathVariable("username")String id) {
        return accountDAO.showProjectName(id);
    }
    
    //Hien thi tat ca ten project của 1 user                
    @GetMapping("/pmf/Report/showHotProjectName/{username}")
    public List<String> showHotProjectName(@PathVariable("username")String id) {
        return accountDAO.showProjectName(id);
    }
    
    //Hien thi tat ca ten project của 1 user                
    @GetMapping("/pmf/Report/showHotProject/{username}")
    public List<Integer> showHotProject(@PathVariable("username")String id) {
        return accountDAO.showHotProject(id);
    }
    
    //Thong ke so luong cac task cua 1 user trong 1 project dua theo status              
    @GetMapping("/pmf/Report/showTaskStatusByProjectAndUsername/{username}/{pid}")
    public List<Integer> showTaskPriorityByProjectAndUsername(@PathVariable("username")String id, @PathVariable("pid")Integer pid) {
        return accountDAO.showTaskPriorityByProjectAndUsername(id,pid);
    }
    
    //Thong ke so luong cac task cua 1 user trong 1 project dua theo status              
    @GetMapping("/pmf/Report/getSubTaskStatusByProjectAndUser/{username}/{pid}")
    public List<Integer> getSubTaskStatusByProjectAndUser(@PathVariable("username")String id, @PathVariable("pid")Integer pid) {
    	
    	List<Integer> list = new ArrayList<>();
    	
    	int chart0 = 0;
    	int chart1 = 0;
    	  	
    	List<Integer> listOb = actDAO.getObjectIdByCateAndUser(13, id);
    	
    	for (Integer i : listOb) {
    		
    		Boolean stt = actDAO.getSubTaskStatusByProjectAndUser(pid, i);

    		if(stt != null) {
				if(stt == true) {
					chart1++;
				}
				else{
					chart0++;
				}
    		}
		}
    	list.add(chart0);
    	list.add(chart1);
        return list;
    }
    
    
  //Thong ke so luong cac task cua 1 user trong 1 project dua theo status              
    @GetMapping("/pmf/Report/getTaskStatusByProjectAndUser/{username}/{pid}")
    public List<Integer> getTaskStatusByProjectAndUser(@PathVariable("username")String id, @PathVariable("pid")Integer pid) {
    	
    	List<Integer> list = new ArrayList<>();

    	int chart1 = 0;
    	int chart2 = 0;
    	int chart3 = 0;
    	int chart4 = 0;	
    	  	
    	List<Integer> listOb = actDAO.getObjectIdByCateAndUser(10, id);
    	
    	for (Integer i : listOb) {    		
    		Integer stt = actDAO.getTaskStatusByProjectAndUser(pid, i);
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
    		
    	list.add(chart1);
    	list.add(chart2);
    	list.add(chart3);
    	list.add(chart4);
    	
        return list;
    }
    
    
    //Hien thi tong so luong project 
    @GetMapping("/pmf/Report/admin/totalProject")
    public Integer totalProject() {
        return proDAO.countTotalProject();
    }
    
    //Hien thi tong so luong project dua theo status
    @GetMapping("/pmf/Report/admin/countProjectByStt/{stt}")
    public Integer countProjectByStt(@PathVariable("stt")Integer stt) {
        return proDAO.countProjectByStt(stt);
    }
    
    //Hien thi tong so luong task 
    @GetMapping("/pmf/Report/admin/totalTask")
    public Integer totalTask() {
        return taskDAO.countTotalTask();
    }
    
    //Hien thi tong so luong account user
    @GetMapping("/pmf/Report/admin/totalAccount")
    public Integer totalAccount() {
        return accountDAO.countTotalAccount();
    }
    
    //Hien thi tong so thu nhap 
    @GetMapping("/pmf/Report/admin/totalAmount")
    public Integer totalAmount() {
    	//System.out.println(actDAO.countTotalAmount()*15);
        return actDAO.countTotalAmount();
    }
    
    //Hien thi tong so luong account user dua theo status
    @GetMapping("/pmf/Report/admin/countAccountByStt/{stt}")
    public Integer countAccountByStt(@PathVariable("stt")Integer stt) {
        return accountDAO.countAccountByStt(stt);
    }
}
