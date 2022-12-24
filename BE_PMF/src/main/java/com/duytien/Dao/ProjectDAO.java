package com.duytien.Dao;
import com.duytien.Model.*;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
public interface ProjectDAO extends JpaRepository<Project, Integer>{
	@Query(value = "exec sp_FindDataProject ?1,?2", nativeQuery = true)
	public List<Project> findData(String data,String username);
		//Hien thi tat ca projectID của 1 user
		@Query("SELECT pr.projectID FROM Project pr "
		+ "INNER JOIN Team t ON t.teamID = pr.team.teamID "
		+ "INNER JOIN Team_Members tm ON tm.team.teamID = t.teamID "
		+ "INNER JOIN Account ac ON ac.username = tm.account.username "
		+ "WHERE ac.username = ?1 AND pr.project_status.statusID = ?2")
List<Integer> findIdProject(String username, Integer stt);
		
		//Check user da tham gia project chua
				@Query("SELECT pr FROM Project pr "
				+ "INNER JOIN Team t ON t.teamID = pr.team.teamID "
				+ "INNER JOIN Team_Members tm ON tm.team.teamID = t.teamID "
				+ "INNER JOIN Account ac ON ac.username = tm.account.username "
				+ "WHERE ac.username = ?1 AND pr.projectID = ?2")
		Project checkUserInProject(String username, Integer projectID);		

@Query(value = "exec proceduce_GetAllProjectsRelevantToAccount ?1", nativeQuery = true)
public List<Project> getAllProjectsRelevantToAccount(String username);

@Query("SELECT tm from Team_Members tm where tm.team.teamID = ?1 and tm.team_role.roleID = 1")
public Team_Members checkIfOwner(Integer teamID);


@Query(value = "exec proceduce_GetAllProjectsRelevantToAccountPrivate ?1, ?2", nativeQuery = true)
public List<Integer> getAllProjectsRelevantToAccountPrivate(String username,String email);

@Query("SELECT task FROM Task task where task.projectID = ?1")
public List<Task> getAllTaskByPID(Integer pid);

@Query("SELECT task FROM Task_Sub task where task.task.projectID = ?1")
public List<Task_Sub> getAllSubTaskByPID(Integer pid);

@Query("SELECT count(pr.projectID) from Project pr")
public Integer countTotalProject();

@Query("SELECT count(pr.projectID) from Project pr where pr.project_status.statusID = ?1")
public Integer countProjectByStt(Integer stt);

@Query(value = "exec sp_FindProjectData ?1", nativeQuery = true)
public List<Project> findProject(String data);

}

