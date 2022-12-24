package com.duytien.Dao;
import com.duytien.Model.*;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
public interface Team_MembersDAO extends JpaRepository<Team_Members, Integer>{
	
	//Hiển thị list account của member
		@Query("SELECT ac FROM Account ac "
				+ "INNER JOIN Team_Members tm ON tm.account.username = ac.username "
				+ "INNER JOIN Team t ON t.teamID = tm.team.teamID "
				+ "INNER JOIN Project pr ON pr.team.teamID = t.teamID "
				+ "WHERE pr.projectID = ?1 ")
		List<Account> getListTeamMember(Integer pid);
		
		 //Hiển thị list member
		@Query("SELECT tm FROM Team_Members tm  "
				+ "INNER JOIN Team t ON t.teamID = tm.team.teamID "
				+ "INNER JOIN Project pr ON pr.team.teamID = t.teamID "
				+ "WHERE pr.projectID = ?1 ")
		List<Team_Members> getListTeamMemberOnly(Integer pid);
		
		@Query("SELECT tm from Team_Members tm where tm.account.username = ?1 and tm.team.teamID = ?2")
		Team_Members getMemberByUsername(String username,Integer teamID);
		
		@Query(value = "exec sp_FindMemberData ?1,?2", nativeQuery = true)
	 	public List<Team_Members> findMemberData(String data, Integer pid);
		
		@Transactional
		@Modifying
		@Query("delete Team_Members mem where mem.team.teamID =?1 and mem.account.username = ?2")
		void deleteMemberInProject(Integer teamID,String username);
}