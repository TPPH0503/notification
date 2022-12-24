package com.duytien.Controller;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.duytien.Dao.AccountDAO;
import com.duytien.Dao.Account_RoleDAO;
import com.duytien.Dao.ProjectDAO;
import com.duytien.Dao.TaskDAO;
import com.duytien.Dao.Task_SubDAO;
import com.duytien.Dao.TeamDAO;
import com.duytien.Dao.Web_SecurityDAO;
import com.duytien.Model.Account;
import com.duytien.Model.Project;
import com.duytien.Model.Task;
import com.duytien.Model.Task_Sub;
import com.duytien.Model.Team;
import com.duytien.Model.Web_Security;

@CrossOrigin("*")
@RestController
public class OthController {
	@Autowired
	AccountDAO acDao;
	@Autowired
	TaskDAO taskDao;
	@Autowired
	ProjectDAO prDao;
	@Autowired
	TeamDAO teamDao;
	@Autowired
	Task_SubDAO taskSubDao;
	@Autowired
	Web_SecurityDAO webDao;

	/// pmf/project/
	// Find data in table Account, Task, Projetc, Team, Task_Sub
	// Find data Account
	@GetMapping("/pmf/account/{data}/{username}")
	public List<Account> findData1(@PathVariable("data") String data,@PathVariable("username") String username) {
		return acDao.findData(data,username);
	}

	// Find data Task, include name project and task
	@GetMapping("/pmf/task/{data}/{username}")
	public List<Task> findData2(@PathVariable("data") String data,@PathVariable("username") String username) {
		return taskDao.findData(data,username);
	}

	// Find data Project
	@GetMapping("/pmf/project/{data}/{username}")
	public List<Project> findData3(@PathVariable("data") String data,@PathVariable("username") String username) {
		return prDao.findData(data,username);
	}

//	Find data Team
	@GetMapping("/pmf/team/{data}/{username}")
	public List<Team> findData4(@PathVariable("data") String data,@PathVariable("username") String username) {
		return teamDao.findData(data,username);
	}

//	Find data Task_Sub, include name task, and name project
	@GetMapping("/pmf/tasksub/{data}/{username}")
	public List<Task_Sub> findData5(@PathVariable("data") String data,@PathVariable("username") String username) {
		return taskSubDao.findData(data,username);
	}

	// Add or update infor to Web_Security
	@PostMapping("/pmf/new/maintenance")
	public Web_Security newMaintenance(@RequestBody Web_Security value) {
		try {
			// Create and update Web_Security
			Web_Security newWeb = webDao.save(value);
			// Add new data in Activity
			System.out.println("Add or update successfully!");
			return newWeb;
		} catch (Exception e) {
			System.out.println(e);
			return null;
		}
	}

	// Load data Web_Security
	@GetMapping("/pmf/load/data")
	public List<Web_Security> data() {
		try {
			List<Web_Security> ds = webDao.findAll();
			for (int i = 0; i < ds.size(); i++) {
				if (ds.get(i).isStatusWeb() == true) {
					ds.remove(i);
				}
			}
			return ds;
		} catch (Exception e) {
			System.out.println("Not value!");
			return null;

		}
	}

	// Get last data table Web_Security
	@GetMapping("/pmf/last/data")
	public Web_Security lastData() {
		try {
			Web_Security web = webDao.dataLast();
			if (checkTime(web.getEndDate()) == true && web.isStatusWeb() == true) {
				web.setStatusWeb(false);
				webDao.save(web);
				System.out.println("This version unactive!");
				return null;
			} else {
				return web;
			}
		} catch (Exception e) {
			System.out.println("Not value last data!");
			return null;
		}
	}

	@GetMapping("/pmf/maintaince")
	public Web_Security maintaince() {
		int y = 0;
		List<Web_Security> ds = webDao.findAll();
		for (int i = 0; i < ds.size(); i++) {
			if (ds.get(i).isStatusWeb() == true) {
				// If have version active return true
				y++;
				System.out.println("Have a version ready start!");
				return ds.get(i);
			}
		}
		if (y > 1) {
			System.out.println("Have more than one version active, please check system!");
			return null;
		}
		System.out.println("Don't have any version!");
		return null;
	}

	// Check time maintaince use for last data
	// If today more then endDate of version active
	public boolean checkTime(Date date1) {
		Date today = new Date();
		System.out.println(today);
		if (today.before(date1)) {
			System.out.println("false");
			return false;
		} else {
			System.out.println("true");
			return true;
		}
	}

	// Get data report
	@GetMapping("/pmf/report_admin1")
	public Object report_admin1() {
		return webDao.getReport1();
	}

	// Get data top 1 user
	@GetMapping("/pmf/top1_user")
	public Object report_top1() {
		return webDao.getTop1_User();
	}
	//Get total 
	@GetMapping("/pmf/total")
	public Object report_total() {
		return webDao.getTotal();
	}
}
