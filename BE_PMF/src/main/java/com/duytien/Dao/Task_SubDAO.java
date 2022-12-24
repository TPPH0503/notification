package com.duytien.Dao;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.duytien.Model.Task_Sub;

public interface Task_SubDAO extends JpaRepository<Task_Sub, Integer> {
	@Query(value = "exec sp_FindDataTaskSub ?1,?2", nativeQuery = true)
	public List<Task_Sub> findData(String data, String username);
	
	
	@Query("SELECT sub from Task_Sub sub "
	+ "INNER JOIN Task t on t.taskID = sub.task.taskID"
	+ " INNER JOIN Project pj on pj.projectID = t.projectID"
	+ " WHERE pj.projectID = ?1"
	)
	public List<Task_Sub> getAllSubTask(Integer projectID);
	
	
	@Query("SELECT sub from Task_Sub sub "
			+ "INNER JOIN Task t on t.taskID = sub.task.taskID"
			+ " INNER JOIN Project pj on pj.projectID = t.projectID"
			+ " WHERE pj.projectID = ?1 and t.taskID = ?2"
			)
	public List<Task_Sub> getAllSubTaskByTaskID(Integer projectID,Integer taskID);
	
	@Transactional
	@Modifying
	@Query("delete Task_Sub sub where sub.task.taskID in "
			+ "(SELECT t.taskID from Task t "
			+ " where t.section.sectionID = ?1 and t.projectID = ?2)")
	void deleteAllSubTaskBySection(Integer sectionID, Integer projectID);
	
	@Transactional
	@Modifying
	@Query("update Task_Sub sub set sub.discription = ?2 where sub.subID = ?1")
	void renameSubtask(Integer subID, String name);
}
