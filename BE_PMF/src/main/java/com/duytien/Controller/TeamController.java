package com.duytien.Controller;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.duytien.Dao.*;
import com.duytien.Model.*;
@RestController
public class TeamController {

    @Autowired
    TeamDAO teamDAO;

    @GetMapping("/pmf/Team/getTeam")
    public List<Team> getListTeam() {
        List<Team> team = teamDAO.findAll();
        return team;
    }
}
