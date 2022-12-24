package com.duytien.Dao;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.duytien.Model.Task_File;
public interface Task_FileDAO extends JpaRepository<Task_File, Integer>{
	
	@Query("SELECT o.code FROM Task_File o WHERE o.fileID = ?1")
	public String findCodeById(Integer data);
	
	@Query("SELECT o FROM Task_File o WHERE o.account.username = ?1")
	public List<Task_File> findByUsername(String data);
	
	@Query("SELECT o FROM Task_File o WHERE o.task.taskID = ?1")
	public List<Task_File> findByTaskID(Integer data);
	
	@Query("SELECT o FROM Task_File o WHERE o.project.projectID = ?1")
	public List<Task_File> findByProjectID(Integer data);
	
	@Query("SELECT o FROM Task_File o WHERE o.project.projectID = ?1 AND o.task.taskID = ?2")
	public List<Task_File> findListInTask(Integer data1, Integer data2);
	
	@Transactional
	@Modifying
	@Query("delete Task_File task where task.task.taskID = ?1")
	void deleteAllTaskFileByTask(Integer taskID);
}
