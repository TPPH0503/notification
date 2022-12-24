package com.duytien.Dao;

import com.duytien.Model.*;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface TaskDAO extends JpaRepository<Task, Integer> {
	
	//Hien thi tat ca projectID của 1 user
	@Query("SELECT ts.taskID FROM Task ts "
	 	+ "INNER JOIN Project pr ON pr.projectID = ts.projectID "
	 	+ "INNER JOIN Team t ON t.teamID = pr.team.teamID "
	 	+ "INNER JOIN Team_Members tm ON tm.team.teamID = t.teamID "
	 	+ "INNER JOIN Account ac ON ac.username = tm.account.username "
	 	+ "WHERE ac.username = ?1 AND ts.task_priority.priorityID = ?2")
 	List<Integer> findIdTask(String username, Integer stt);
			
 
 	@Query(value = "exec sp_FindDataTask ?1,?2", nativeQuery = true)
 	public List<Task> findData(String data,String username);
	
	@Query("select task from Task task where task.projectID = ?1")
	List<Task> findAllByProject(Integer projectID, Sort sort);
	
	
	@Transactional
	@Modifying
	@Query("update Task task set task.taskNumber = ?1 where task.taskID = ?2 and task.section.sectionID = ?3 and task.projectID = ?4")
	void updateTaskPosition(Integer newPosition,Integer id,Integer sectionID,Integer projectID);
	
	@Transactional
	@Modifying
	@Query("delete Task task where task.taskID = ?1 and task.section.sectionID =?2 and task.projectID = ?3")
	void deleteTaskBySection(Integer taskID,Integer sectionID,Integer projectID);
	
	@Transactional
	@Modifying
	@Query("delete Task task where task.section.sectionID =?1 and task.projectID = ?2")
	void deleteAllTaskBySection(Integer sectionID,Integer projectID);
	
	@Transactional
	@Modifying
	@Query("update Task task set task.taskNumber = ?1, task.section.sectionID = ?4 where task.taskID = ?2 and task.section.sectionID = ?3 and task.projectID = ?5")
	void insertTaskPosition(Integer newPosition,Integer id,Integer oldSectionID,Integer newSectionID,Integer projectID);
	
	@Query("SELECT count(pr.taskID) from Task pr")
	public Integer countTotalTask();
	
	@Query("SELECT task from Task task where task.projectID = ?1 and task.taskID = ?2")
	Task findTaskByProject(Integer pid,Integer taskID);
}
