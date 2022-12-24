package com.duytien.Model;

import java.io.Serializable;
import java.util.Date;
import java.util.List;
import javax.persistence.*;
import javax.persistence.Id;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
@Data
@Entity
@Table(name = "Task")
public class Task implements Serializable{
    @Id @GeneratedValue (strategy = GenerationType.IDENTITY)
    private int taskID;
    @Column(name="taskname")
    private String taskName;
    @Column(name="createdate") 
    private Date createDate;
    @Column(name="plannedstartdate") 
    private Date plannedStartDate;
    @Column(name="plannedenddate") 
    private Date plannedEndDate;
    @Column(name="tasknumber")
    private int taskNumber;
    private String discription;
    @Column(name="projectid")
    private int projectID;
    @ManyToOne @JoinColumn(name="sectionID")
    private Section section;
    @ManyToOne @JoinColumn(name="priorityID")
    private Task_Priority task_priority;
    @ManyToOne @JoinColumn(name="statusID")
    private Task_Status task_status;
    @OneToMany(mappedBy="task") @JsonIgnore
    private List<Task_Sub> task_sub;
    @OneToMany(mappedBy="task") @JsonIgnore
    private List<Task_File> task_file;
    @OneToMany(mappedBy="task") @JsonIgnore
    private List<TaskDefinition> td;
}
