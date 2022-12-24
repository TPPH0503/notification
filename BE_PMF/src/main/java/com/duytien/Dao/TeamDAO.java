package com.duytien.Dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.duytien.Model.Team;
public interface TeamDAO extends JpaRepository<Team, Integer>{
	@Query(value = "exec sp_FindDataTeam ?1,?2", nativeQuery = true)
	public List<Team> findData(String data,String username);
}
