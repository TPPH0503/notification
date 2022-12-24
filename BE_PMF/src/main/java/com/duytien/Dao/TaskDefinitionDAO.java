package com.duytien.Dao;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.duytien.Model.TaskDefinition;

public interface TaskDefinitionDAO extends JpaRepository<TaskDefinition, String> {
	@Query(value = "exec sp_findDateSchedule ?1", nativeQuery = true)
	public List<TaskDefinition> findDataByUsername(String username);

	@Query("SELECT sc from TaskDefinition sc where sc.status = ?1")
	List<TaskDefinition> getScheduleByStatus (Integer status);
	
	@Transactional
	@Modifying
	@Query("delete TaskDefinition task where task.task.taskID = ?1")
	void deleteAllSheduleByTask(Integer taskID);
}
