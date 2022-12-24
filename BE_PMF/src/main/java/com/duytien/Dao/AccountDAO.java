package com.duytien.Dao;

import java.util.List;



import org.springframework.data.jpa.repository.*;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.jpa.repository.Query;

import com.duytien.Model.Account;
import com.duytien.Model.Chart;

public interface AccountDAO extends JpaRepository<Account, String> {
	
	//Cập nhật status cho account
	@Transactional
	@Modifying
	@Query("UPDATE Account o SET o.status = ?2 where o.username = ?1")
	void updateStatusAccount(String username, Integer status);
	
	//Đếm số lượng task theo statusID của 1 user
	@Query("SELECT COUNT(ts.taskID) FROM Account ac "
			+ "INNER JOIN Team_Members tm ON tm.account.username = ac.username "
			+ "INNER JOIN Team t ON t.teamID = tm.team.teamID "
			+ "INNER JOIN Project pr ON pr.team.teamID = t.teamID "
			+ "INNER JOIN Task ts ON ts.projectID = pr.projectID "
			+ "WHERE ac.username = ?1 AND ts.task_status.statusID = ?2 GROUP BY ac.username")
	Integer countTask(String username, Integer statusID);
	
	//Đếm số lượng task theo statusID của 1 user
	@Query("SELECT COUNT(ts.taskID) FROM Account ac "
			+ "INNER JOIN Team_Members tm ON tm.account.username = ac.username "
			+ "INNER JOIN Team t ON t.teamID = tm.team.teamID "
			+ "INNER JOIN Project pr ON pr.team.teamID = t.teamID "
			+ "INNER JOIN Task ts ON ts.projectID = pr.projectID "
			+ "WHERE ac.username = ?1 AND (ts.task_status.statusID = 1 "
			+ "OR ts.task_status.statusID = 2 OR ts.task_status.statusID = 3) GROUP BY ac.username")
	Integer countTask_Incomplete(String username);
	
	//Đếm số lượng task theo priorityID của 1 user
	@Query("SELECT COUNT(ts.taskID) FROM Account ac "
			+ "INNER JOIN Team_Members tm ON tm.account.username = ac.username "
			+ "INNER JOIN Team t ON t.teamID = tm.team.teamID "
			+ "INNER JOIN Project pr ON pr.team.teamID = t.teamID "
			+ "INNER JOIN Task ts ON ts.projectID = pr.projectID "
			+ "WHERE ac.username = ?1 AND ts.task_priority.priorityID = 1 GROUP BY ac.username")
	Integer countTask_High(String username);
	
	//Đếm số lượng task trong tung project của 1 user theo priority
	@Query("SELECT COUNT(ts.taskID) FROM Account ac "
			+ "INNER JOIN Team_Members tm ON tm.account.username = ac.username "
			+ "INNER JOIN Team t ON t.teamID = tm.team.teamID "
			+ "INNER JOIN Project pr ON pr.team.teamID = t.teamID "
			+ "INNER JOIN Task ts ON ts.projectID = pr.projectID "
			+ "WHERE ac.username = ?1 AND ts.task_priority.priorityID = ?2 GROUP BY ts.projectID ORDER BY ts.projectID ASC")
	List<Integer> countTask_Priority(String username, Integer priority);
	
	//Hien thi tat ca ten project của 1 user
	@Query("SELECT pr.projectName FROM Account ac "
			+ "INNER JOIN Team_Members tm ON tm.account.username = ac.username "
			+ "INNER JOIN Team t ON t.teamID = tm.team.teamID "
			+ "INNER JOIN Project pr ON pr.team.teamID = t.teamID "
			+ "WHERE ac.username = ?1 ORDER BY pr.projectID ASC")
	List<String> showProjectName(String username);
	
	//Đếm tổng số lượng task của 1 user
	@Query("SELECT COUNT(ts.taskID) FROM Account ac "
			+ "INNER JOIN Team_Members tm ON tm.account.username = ac.username "
			+ "INNER JOIN Team t ON t.teamID = tm.team.teamID "
			+ "INNER JOIN Project pr ON pr.team.teamID = t.teamID "
			+ "INNER JOIN Task ts ON ts.projectID = pr.projectID "
			+ "WHERE ac.username = ?1")
	Integer totalTask(String username);
	
	//Hiển thị tổng task được giao trong các project của 1 user
	@Query("SELECT COUNT(ts.taskID) FROM Account ac "
			+ "INNER JOIN Team_Members tm ON tm.account.username = ac.username "
			+ "INNER JOIN Team t ON t.teamID = tm.team.teamID "
			+ "INNER JOIN Project pr ON pr.team.teamID = t.teamID "
			+ "INNER JOIN Task ts ON ts.projectID = pr.projectID "
			+ "WHERE ac.username = ?1 GROUP BY pr.projectName ORDER BY pr.projectName ASC")
	List<Integer> countTaskInProjectInteger(String username);
	
	//Hiển thị các project được giao task của 1 user
	@Query("SELECT pr.projectName FROM Account ac "
			+ "INNER JOIN Team_Members tm ON tm.account.username = ac.username "
			+ "INNER JOIN Team t ON t.teamID = tm.team.teamID "
			+ "INNER JOIN Project pr ON pr.team.teamID = t.teamID "
			+ "INNER JOIN Task ts ON ts.projectID = pr.projectID "
			+ "WHERE ac.username = ?1 GROUP BY pr.projectName ORDER BY pr.projectName ASC")
	List<String> countTaskInProjectString(String username);
	
	//Đếm tổng số lượng project của 1 user
	@Query("SELECT COUNT(pr.projectID) FROM Account ac "
			+ "INNER JOIN Team_Members tm ON tm.account.username = ac.username "
			+ "INNER JOIN Team t ON t.teamID = tm.team.teamID "
			+ "INNER JOIN Project pr ON pr.team.teamID = t.teamID "
			+ "WHERE ac.username = ?1")
	Integer countProject(String username);
	
	//Thong ke so luong project theo statusid cua 1 username
	@Query("SELECT COUNT(pr.projectID) FROM Account ac "
			+ "INNER JOIN Team_Members tm ON tm.account.username = ac.username "
			+ "INNER JOIN Team t ON t.teamID = tm.team.teamID "
			+ "INNER JOIN Project pr ON pr.team.teamID = t.teamID "
			+ "WHERE ac.username = ?1 AND pr.project_status.statusID = ?2")
	Integer countProjectStatus(String username, Integer statusID);

	//Thong ke muc do uu tien cua cac project cua 1 user
	@Query("SELECT COUNT(ts.taskID) FROM Account ac "
			+ "INNER JOIN Team_Members tm ON tm.account.username = ac.username "
			+ "INNER JOIN Team t ON t.teamID = tm.team.teamID "
			+ "INNER JOIN Project pr ON pr.team.teamID = t.teamID "
			+ "INNER JOIN Task ts ON ts.projectID = pr.projectID "
			+ "WHERE ac.username = ?1 AND ts.task_priority.priorityID = 1 AND "
			+ "(ts.task_status.statusID = 1 OR ts.task_status.statusID = 2 OR ts.task_status.statusID = 3) "
			+ " GROUP BY ts.projectID")
	List<Integer> showHotProject(String username);
	
	//Thong ke muc do uu tien cua cac project cua 1 user
	@Query("SELECT DISTINCT pr.projectName FROM Account ac "
			+ "INNER JOIN Team_Members tm ON tm.account.username = ac.username "
			+ "INNER JOIN Team t ON t.teamID = tm.team.teamID "
			+ "INNER JOIN Project pr ON pr.team.teamID = t.teamID "
			+ "INNER JOIN Task ts ON ts.projectID = pr.projectID "
			+ "WHERE ac.username = ?1 AND (ts.task_status.statusID = 1 OR ts.task_status.statusID = 2 OR ts.task_status.statusID = 3)")
	List<Integer> showHotProjectName(String username);
	
	//Thong ke so luong cac task cua 1 user trong 1 project dua theo priority
	@Query("SELECT Count(ts.taskID) FROM Account ac "
			+ "INNER JOIN Team_Members tm ON tm.account.username = ac.username "
			+ "INNER JOIN Team t ON t.teamID = tm.team.teamID "
			+ "INNER JOIN Project pr ON pr.team.teamID = t.teamID "
			+ "INNER JOIN Task ts ON ts.projectID = pr.projectID "
			+ "INNER JOIN Task_Status stt ON stt.statusID = ts.task_status.statusID "
			+ "WHERE ac.username = ?1 AND pr.projectID = ?2 GROUP BY stt.statusName")
	List<Integer> showTaskPriorityByProjectAndUsername(String username, Integer pid);

	@Query("SELECT ac from Account ac where ac.email = ?1")
	public Account getAccountByEmail(String email);
	
	@Query(value = "exec sp_FindDataAccount ?1,?2", nativeQuery = true)
	public List<Account> findData(String data,String username);
	
	@Query("SELECT count(ac.username) from Account ac")
	public Integer countTotalAccount();
	
	@Query("SELECT count(ac.username) from Account ac where ac.account_role.roleID = 2 and ac.status = ?1")
	public Integer countAccountByStt(Integer stt);
	
	//Đặc biệt nghiêm trọng phần của Thái Hoàng Diệu
	@Query("SELECT a.username FROM Account a")
	public List<String> listUsername();
	
	@Query("SELECT a.email FROM Account a")
	public List<String> listemail();
	
	@Query(value = "exec sp_FindAccountDataForAdmin ?1", nativeQuery = true)
	public List<Account> findAccount(String data);
}
