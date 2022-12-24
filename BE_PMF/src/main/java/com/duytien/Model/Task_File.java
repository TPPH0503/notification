package com.duytien.Model;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Date;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.*;

@Data
@Entity
@Table(name = "Task_File")
public class Task_File implements Serializable {
	
    @Id @GeneratedValue (strategy = GenerationType.IDENTITY)
    private int fileID;
    
    private String name;
    private String code;
    private Boolean status;
    
    @ManyToOne
    @JoinColumn(name = "username")
    private Account account;
    
    @Column(name="createdate") @Temporal(TemporalType.TIMESTAMP)
    private Date createDate;
    
    @ManyToOne @JoinColumn(name = "taskID")
    private Task task;
    
    @ManyToOne @JoinColumn(name = "projectID")
    private Project project;
}
