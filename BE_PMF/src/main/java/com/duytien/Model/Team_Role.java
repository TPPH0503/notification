package com.duytien.Model;

import java.io.Serializable;
import java.util.List;
import javax.persistence.*;
import javax.persistence.Id;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.*;

@Data
@Entity
@Table(name = "Team_Role")
public class Team_Role implements Serializable {
    @Id
    private int roleID;
    @Column(name="rolename")
    private String roleName;
    @OneToMany(mappedBy = "team_role") @JsonIgnore
    private List<Team_Members> team_memebers;
}