package com.duytien.Dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.duytien.Model.Web_Security;

public interface Web_SecurityDAO extends JpaRepository<Web_Security, Integer> {
	@Query(value = "exec sp_DataLastWeb ", nativeQuery = true)
	public Web_Security dataLast();

	@Query(value = "exec PMF_Report1_Admin", nativeQuery = true)
	public List<Object> getReport1();

	@Query(value = "exec PMF_Top1_User", nativeQuery = true)
	public List<Object> getTop1_User();

	@Query(value = "exec PMF_Total", nativeQuery = true)
	public List<Object> getTotal();
}
