package com.duytien.Model;

import java.util.Date;

import javax.persistence.*;
import lombok.*;

@Data
@Entity
@Table(name = "Assigned")
public class Assigned {
    @EmbeddedId
    private AssignedID assignedID;
    @Column(name = "startdate") @Temporal(TemporalType.DATE)
    private Date startDate;
    @Column(name = "id" , insertable = false, updatable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY )
    private int id;

    @ManyToOne
    @JoinColumn(name = "activityID", referencedColumnName = "activityID", insertable = false, updatable = false)
    private Activity activity;
}
