package com.duytien.Dao;
import com.duytien.Model.*;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
public interface SectionDAO extends JpaRepository<Section, Integer>{
    @Query("select sec from Section sec where sec.project.projectID = ?1")
    List<Section> findAllByProject(Integer projectID,Sort sort);
	
	@Transactional
	@Modifying
	@Query("update Section sec set sec.sectionNumber = ?1 where sec.sectionID = ?2 and sec.project.projectID = ?3")
	void updateSectionPosition(Integer newPosition,Integer id,Integer projectID);
	
	
	@Transactional
	@Modifying
	@Query("update Section sec set sec.sectionName = ?1 where sec.sectionID = ?2 and sec.project.projectID = ?3")
	void updateSectionName(String name,Integer id,Integer projectID);
	
	@Transactional
	@Modifying
	@Query("delete Section sec where sec.sectionID =?1 and sec.project.projectID = ?2")
	void deleteAllSectionByProject(Integer sectionID,Integer projectID);
	
	@Query("SELECT sec from Section sec where sec.project.projectID = ?1 and sec.sectionID = ?2")
	Section findSectionByProject(Integer pid,Integer secID);
}
