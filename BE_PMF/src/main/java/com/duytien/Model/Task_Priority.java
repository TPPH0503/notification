package com.duytien.Model;

import java.io.Serializable;
import java.util.List;

import javax.persistence.*;
import javax.persistence.Id;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
@Data
@Entity
@Table(name = "Task_Priority")
public class Task_Priority implements Serializable {
    @Id
    @Column(name="priorityid")
    private int priorityID;
    @Column(name="priorityname")
    private String priorityName;
    @OneToMany(mappedBy = "task_priority") @JsonIgnore
    private List<Task> task;
}