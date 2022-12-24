package com.duytien.Model;

import java.util.List;
import javax.persistence.*;
import javax.persistence.Id;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.*;

@Data
@Entity
@Table(name = "Project_Security")
public class Project_Security {
    @Id
    private int securityID;
    @Column(name = "securityname")
    private String securityName;
    @OneToMany(mappedBy = "project_security") @JsonIgnore
    private List<Project> project;
}
