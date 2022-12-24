package com.duytien.Controller;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.duytien.Dao.*;
import com.duytien.Model.*;
@RestController
public class AssignedController {
    @Autowired
    AssignedDAO AssignedDAO;

    @GetMapping("/pmf/Assigned/getAssigned")
    public List<Assigned> getListAssigned() {
        List<Assigned> Assigned = AssignedDAO.findAll();
        return Assigned;
    }
}
