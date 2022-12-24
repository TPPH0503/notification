package com.duytien.Controller;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.duytien.Dao.*;
import com.duytien.Model.*;
@RestController
public class Project_StatusController {
    @Autowired
    Project_StatusDAO Project_StatusDAO;

    @GetMapping("/pmf/Project_Status/getProject_Status")
    public List<Project_Status> getListProject_Status() {
        List<Project_Status> Project_Status = Project_StatusDAO.findAll();
        return Project_Status;
    }
}
