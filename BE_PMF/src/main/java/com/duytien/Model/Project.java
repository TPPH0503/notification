package com.duytien.Model;

import java.io.Serializable;
import java.util.Date;
import java.util.List;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.*;

@Data
@Entity
@Table(name = "Project")
public class Project implements Serializable {
    @Id @GeneratedValue (strategy = GenerationType.IDENTITY)
    private int projectID;
    @Column(name = "projectname")
    private String projectName;
    @Column(name = "createdate") @Temporal(TemporalType.DATE)
    private Date createDate;
    @Column(name = "enddate") @Temporal(TemporalType.DATE)
    private Date endDate;
    @ManyToOne
    @JoinColumn(name = "statusID")
    private Project_Status project_status;
    @ManyToOne
    @JoinColumn(name = "securityID")
    private Project_Security project_security;
    @OneToOne
    @JoinColumn(name = "teamID")
    private Team team;
    @OneToMany(mappedBy = "project")
    @JsonIgnore
    private List<Section> section;
    @OneToMany(mappedBy="project") @JsonIgnore
    private List<Task_File> task_file;
    @OneToMany(mappedBy="project") @JsonIgnore
    private List<TaskDefinition> td;
}
