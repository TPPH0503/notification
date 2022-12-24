package com.duytien.Model;

import java.io.Serializable;


import javax.persistence.*;
import javax.persistence.Id;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.*;

@Data
@Entity
@Table(name = "Task_Sub")
public class Task_Sub implements Serializable {
    @Id @GeneratedValue (strategy = GenerationType.IDENTITY)
    private int subID;
    private String discription;
    private Boolean status;
    @ManyToOne @JoinColumn(name = "taskID")
    private Task task;
}
