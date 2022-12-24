package com.duytien.Model;

import java.io.Serializable;
import java.util.Date;
import java.util.List;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

@Data
@Entity
@Table(name = "Account")
public class Account implements Serializable {
    @Id
    private String username;
    private String pass;
    private String fullname;
    @Column(name="createdate")
    private Date createDate;
    private String email;
    private String phone;
    private String address;
    private String image;
    private int status;
    @ManyToOne
    @JoinColumn(name = "roleID")
    private Account_Role account_role;
    @OneToMany(mappedBy = "account") @JsonIgnore
    private List<Team_Members> team_members;
    @OneToMany(mappedBy="account") @JsonIgnore
    private List<TaskDefinition> td;
}
