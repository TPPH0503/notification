package com.duytien.Controller;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.duytien.Dao.*;
import com.duytien.Model.*;
@RestController
public class Team_RoleController {
    @Autowired
    Team_RoleDAO team_RoleDAO;

    @GetMapping("/pmf/Team_Role/getTeam_Role")
    public List<Team_Role> getListTeam_Role() {
        List<Team_Role> team_Role = team_RoleDAO.findAll();
        return team_Role;
    }
}
