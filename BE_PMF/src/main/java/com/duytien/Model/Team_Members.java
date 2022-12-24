package com.duytien.Model;

import java.io.Serializable;
import javax.persistence.*;
import lombok.*;

@Data
@Entity
@Table(name = "Team_Members")
public class Team_Members implements Serializable {
    @EmbeddedId
    private Team_MembersID team_membersID;
    @Column(name ="memberid", insertable = false, updatable = false)
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private int memberID;
    @ManyToOne
    @JoinColumn(name = "teamID", referencedColumnName="teamID", insertable=false, updatable=false)
    private Team team;
    @ManyToOne
    @JoinColumn(name = "username", referencedColumnName="username", insertable=false, updatable=false)
    private Account account;
    @ManyToOne
    @JoinColumn(name = "roleID")
    private Team_Role team_role;
}