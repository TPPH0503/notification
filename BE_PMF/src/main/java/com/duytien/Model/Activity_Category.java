package com.duytien.Model;

import java.io.Serializable;
import java.util.List;

import javax.persistence.*;
import javax.persistence.Id;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
@Data
@Entity
@Table(name = "Activity_Category")
public class Activity_Category implements Serializable{
    @Id
    private int categoryID;
    @Column(name="categoryname")
    private String categoryName;
    @OneToMany(mappedBy = "activity_category") @JsonIgnore
    private List<Activity> activity;
}
