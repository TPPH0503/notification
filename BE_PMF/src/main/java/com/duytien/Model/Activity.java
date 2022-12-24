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
@Table(name = "Activity")
public class Activity implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "activityid")
    private int activityID;
    private int objectID;
    @Column(name = "activityname")
    private String activityName;
    @Column(name = "startdate") 
    private Date startDate;
    @Column(name = "username")
    private String username;
    private String discription;
    @Column(name = "projectid")
    private int projectID;
    @ManyToOne
    @JoinColumn(name = "categoryID")
    private Activity_Category activity_category;
    @OneToMany(mappedBy = "activity")
    @JsonIgnore
    private List<Assigned> assigned;
}
