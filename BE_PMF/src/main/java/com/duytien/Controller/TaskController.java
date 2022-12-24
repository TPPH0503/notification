package com.duytien.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.duytien.Dao.*;
import com.duytien.Model.*;

@CrossOrigin("*")
@RestController
public class TaskController {
	@Autowired
	TaskDAO TaskDAO;

	@GetMapping("/pmf/Task/getTask")
	public List<Task> getListTask() {
		List<Task> Task = TaskDAO.findAll();
		return Task;
	}

	@GetMapping("/pmf/findTask/byNhaThanh/{id}")
	public Task getListTaskNhaThanh(@PathVariable("id") int id) {
		return TaskDAO.findById(id).get();
	}

	@GetMapping("/pmf/Task/getTask/{id}")
	public Task getListTask(@PathVariable("id") int id) {
		return TaskDAO.findById(id).get();
	}
}
