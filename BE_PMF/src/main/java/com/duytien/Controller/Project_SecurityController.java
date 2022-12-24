package com.duytien.Controller;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.duytien.Dao.*;
import com.duytien.Model.*;
@RestController
public class Project_SecurityController {
    @Autowired
    Project_SecurityDAO Project_SecurityDAO;

    @GetMapping("/pmf/Project_Security/getProject_Security")
    public List<Project_Security> getListProject_Security() {
        List<Project_Security> Project_Security = Project_SecurityDAO.findAll();
        return Project_Security;
    }
}
