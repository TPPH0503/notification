package com.duytien.Model;

import java.io.Serializable;
import java.util.List;
import javax.persistence.*;
import javax.persistence.Id;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.*;

@Data
@Entity
@Table(name = "Team")
public class Team implements Serializable {
    @Id @GeneratedValue (strategy = GenerationType.IDENTITY)
    private int teamID;
    @Column(name = "teamname")
    private String teamName;
    @OneToOne(mappedBy = "team")
    @JsonIgnore
    private Project project;
    @OneToMany(mappedBy = "team")
    @JsonIgnore
    private List<Team_Members> team_members;
}
