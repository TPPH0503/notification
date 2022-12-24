package com.duytien.Model;

import java.io.Serializable;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;
import javax.persistence.*;
import javax.persistence.Id;
import lombok.*;

@Data
@Entity
@Table(name = "Section")
public class Section implements Serializable {
    @Id @GeneratedValue (strategy = GenerationType.IDENTITY)
    private int sectionID;
    @Column(name = "sectionname")
    private String sectionName;
    @Column(name = "sectionnumber")
    private int sectionNumber;
    @ManyToOne
    @JoinColumn(name = "projectID")
    private Project project;
    @OneToMany(mappedBy = "section") @JsonIgnore
    private List<Task> task;
}
