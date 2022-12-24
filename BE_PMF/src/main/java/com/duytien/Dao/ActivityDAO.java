package com.duytien.Dao;
import com.duytien.Model.*;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
public interface ActivityDAO extends JpaRepository<Activity, Integer>{
    @Query(value = "exec proceduce_GetAllActivitiesRelevantToProjectAndAccount ?1, ?2", nativeQuery = true)
    public List<Activity> getAllActivitiesRelevantToProjectAndAccount(int projectID, String username);
    
    @Query(value = "exec proceduce_GetAllActivitiesRelevantToTaskAndProject ?1, ?2", nativeQuery = true)
    public List<Activity> getAllActivitiesRelevantToProjectAndTask(int projectID, int taskID);
    
   @Query("select ac from Activity ac where ac.activity_category.categoryID = 15 "
		   + " and ac.projectID = ?1 and ac.objectID = ?2")
   public List<Activity> getAllCommentRelevantToTask(int projectID , int taskID);
   
   
   @Query("select ac from Activity ac where (ac.activity_category.categoryID = 3 "
     		+ "or ac.activity_category.categoryID = 5 "
     		+ "or ac.activity_category.categoryID = 16 "
     		+ "or ac.activity_category.categoryID = 17 "
     		+ "or ac.activity_category.categoryID = 18 "
     		+ "or ac.activity_category.categoryID = 19"
     		+ "or ac.activity_category.categoryID = 20)" 
     		+ " and ac.projectID = ?1 and ac.objectID = ?2")
     public List<Activity> getSpecTaskActivities(int projectID,int taskID);
  //Admin
   //Lấy lời mời kết bạn
      @Query("select ac from Activity ac where (ac.activity_category.categoryID = 6 "
      		+ "or ac.activity_category.categoryID = 7 "
      		+ "or ac.activity_category.categoryID = 8"
      		+ "or ac.activity_category.categoryID = 21)" 
      		+ " and ac.projectID = ?1 ")
      public List<Activity> getAllActivitiesRelevantToInvitation(int projectID);
    //Lấy task đã giao
    @Query("select ac from Activity ac where (ac.activity_category.categoryID = 9 "
    		+ "or ac.activity_category.categoryID = 10 "
    		+ "or ac.activity_category.categoryID = 11" 
    		+ "or ac.activity_category.categoryID = 22)" 
    		+ " and ac.projectID = ?1")
    public List<Activity> getAllActivitiesRelevantToTaskAssigned(int projectID);
    
    //Lấy subtask đã giao
    @Query("select ac from Activity ac where (ac.activity_category.categoryID = 12 "
    		+ "or ac.activity_category.categoryID = 13 "
    		+ "or ac.activity_category.categoryID = 14"
    		+ "or ac.activity_category.categoryID = 23)"
    		+ " and ac.projectID = ?1")
    public List<Activity> getAllActivitiesRelevantToSubTaskAssigned(int projectID);
  
  //Client  
  //Lấy lời mời kết bạn
    @Query(value = "exec proceduce_GetAllActivitiesRelevantToInvitationInfor ?1, ?2,?3", nativeQuery = true)
    public List<Activity> getAllActivitiesRelevantToInvitationInfor(int projectID,String username,String email);
    
  //Lấy Giao task
    @Query("select ac from Activity ac where (ac.activity_category.categoryID = 9 "
    		+ "or ac.activity_category.categoryID = 10 "
    		+ "or ac.activity_category.categoryID = 11)" 
    		+ " and ac.projectID = ?1 and ac.username = ?2")
    public List<Activity> getAllActivitiesRelevantToTaskAssignedInfor(int projectID,String username);
    
  //Lấy Giao task2
    @Query("select ac from Activity ac where (ac.activity_category.categoryID = 9 "
    		+ "or ac.activity_category.categoryID = 10 "
    		+ "or ac.activity_category.categoryID = 11)" 
    		+ " and ac.projectID = ?1 and ac.objectID = ?2")
    public List<Activity> getAllActivitiesRelevantToTaskAssignedInfor2(int projectID,int taskID);
    
  //Lấy Giao subtask
    @Query("select ac from Activity ac where (ac.activity_category.categoryID = 12 "
    		+ "or ac.activity_category.categoryID = 13 "
    		+ "or ac.activity_category.categoryID = 14)" 
    		+ " and ac.projectID = ?1 and ac.username = ?2")
    public List<Activity> getAllActivitiesRelevantToSubTaskAssignedInfor(int projectID,String username);
  
  
    @Query("SELECT act FROM Activity act WHERE act.username = ?1 and act.activity_category.categoryID = ?2 ORDER BY act.startDate desc")
    public List<Activity> getObjectIdByUserAndCate(String username, int cateID);

    @Query("select DISTINCT act.objectID from Activity act where act.activity_category.categoryID = ?1 and username = ?2")
    public List<Integer> getObjectIdByCateAndUser(Integer cateId, String username);
    
    @Query("select ts.status from Task t "
    		+ "inner join Task_Sub ts on ts.task.taskID = t.taskID where t.projectID = ?1 and ts.subID = ?2")
    public Boolean getSubTaskStatusByProjectAndUser(Integer pid, Integer sid);
    
    @Query("select t.task_status.statusID from Task t "
    		+ "where t.projectID = ?1 and t.taskID = ?2")
    public Integer getTaskStatusByProjectAndUser(Integer pid, Integer tid);
    
    @Query(value = "exec sp_FindTaskFromAssigned ?1, ?2", nativeQuery = true)
    public Activity getAllActivitiesRelevantToTaskAssignedInfor3(int projectID,int taskID);
    
    @Query(value = "exec sp_FindSubTaskFromAssigned ?1, ?2", nativeQuery = true)
    public Activity getAllActivitiesRelevantToSubTaskAssignedInfor3(int projectID,int taskID);
    
    
    @Query(value = "exec sp_FindAssigneeFromAssigned ?1, ?2", nativeQuery = true)
    public List<Activity> getAllActivitiesRelevantToAssignedInfor3(int projectID, String username);
    
    @Query("SELECT count(act.activityID) from Activity act where act.activity_category.categoryID = 99")
	public Integer countTotalAmount();
    
    @Query("SELECT act from Activity act where act.activity_category.categoryID  = 1 or act.activity_category.categoryID  = 98 or act.activity_category.categoryID  = 99 "
    		+ "or act.activity_category.categoryID = 97 order by act.startDate desc")
	public List<Activity> listActivityForAdmin();
    
    @Query("SELECT act from Activity act where act.activity_category.categoryID  = 99  order by act.startDate desc")
	public List<Activity> listAmountForAdmin();
    
    @Query(value = "exec sp_FindAccountPaid ?1", nativeQuery = true)
    public List<Activity> findAmountForAdmin(String data);
    
    @Query(value = "exec sp_FindActivityData ?1", nativeQuery = true)
    public List<Activity> findActivityForAdmin(String data);
    
    @Query(value = "exec sp_FindTaskOverdue ?1, ?2", nativeQuery = true)
    public Activity getAllActivitiesRelevantToTaskOverdue(int projectID, int taskID);
}
