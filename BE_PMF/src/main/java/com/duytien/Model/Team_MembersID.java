package com.duytien.Model;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Embeddable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class Team_MembersID implements Serializable {
    @Column(name = "teamID")
    private int teamID;
    @Column(name = "username")
    private String username;
}
