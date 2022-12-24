package com.duytien.Controller;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.duytien.Dao.*;
import com.duytien.Model.*;
@RestController
public class Task_StatusController {
    @Autowired
    Task_StatusDAO Task_StatusDAO;

    @GetMapping("/pmf/Task_Status/getTask_Status")
    public List<Task_Status> getListTask_Status() {
        List<Task_Status> Task_Status = Task_StatusDAO.findAll();
        return Task_Status;
    }
}
