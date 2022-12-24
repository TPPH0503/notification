package com.duytien.Model;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Embeddable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Embeddable
public class AssignedID implements Serializable{
    @Column(name = "username")
    private String username;
    @Column(name = "activityID")
    private int activityID;
}