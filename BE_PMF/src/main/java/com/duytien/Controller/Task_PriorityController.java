package com.duytien.Controller;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.duytien.Dao.*;
import com.duytien.Model.*;
@RestController
public class Task_PriorityController {
    @Autowired
    Task_PriorityDAO Task_PriorityDAO;

    @GetMapping("/pmf/Task_Priority/getTask_Priority")
    public List<Task_Priority> getListTask_Priority() {
        List<Task_Priority> Task_Priority = Task_PriorityDAO.findAll();
        return Task_Priority;
    }
}
