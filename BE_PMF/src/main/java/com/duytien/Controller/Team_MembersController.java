package com.duytien.Controller;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.duytien.Dao.*;
import com.duytien.Model.*;
@RestController
@CrossOrigin("*")
public class Team_MembersController {
    @Autowired
    Team_MembersDAO team_membersDAO;

    @GetMapping("/pmf/Team_Members/getTeam_Members")
    public List<Team_Members> getListTeam_Members() {
        List<Team_Members> team_members = team_membersDAO.findAll();
        return team_members;
    }
    
    @GetMapping("/pmf/Team_Members/getListMemberProject/{pid}")
    public List<Team_Members> getListMemberProject(@PathVariable("pid") Integer pid) {
        List<Team_Members> team_members = team_membersDAO.getListTeamMemberOnly(pid);
        return team_members;
    }
    
    @GetMapping("/pmf/Team_Members/getMemberProject/{pid}/{dieuKien}")
    public List<Team_Members> getMemberProject(@PathVariable("pid") Integer pid, @PathVariable("dieuKien") String dieuKien) {
        List<Team_Members> team_members = team_membersDAO.findMemberData(dieuKien, pid);
        return team_members;
    }
}
