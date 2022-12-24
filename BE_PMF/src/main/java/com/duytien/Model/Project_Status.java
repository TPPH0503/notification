package com.duytien.Model;

import java.io.Serializable;
import java.util.List;
import javax.persistence.*;
import javax.persistence.Id;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.*;

@Data
@Entity
@Table(name = "Project_Status")
public class Project_Status implements Serializable {
    @Id
    private int statusID;
    @Column(name = "statusname")
    private String statusName;
    @OneToMany(mappedBy = "project_status") @JsonIgnore
    private List<Project> project;
}