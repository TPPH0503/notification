package com.duytien.Model;

import java.io.Serializable;
import java.util.List;

import javax.persistence.*;
import javax.persistence.Id;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Data
@Entity
@Table(name = "Task_Status")
public class Task_Status implements Serializable {
    @Id
    @Column(name = "statusid")
    private int statusID;
    @Column(name = "statusname")
    private String statusName;
    @OneToMany(mappedBy = "task_status")
    @JsonIgnore
    private List<Task> task;
}
