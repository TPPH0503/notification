package com.duytien.Model;

import java.io.Serializable;
import java.util.List;

import javax.persistence.*;
import javax.persistence.Id;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.*;
@Data
@Entity
@Table(name="Account_Role")
public class Account_Role implements Serializable{
    @Id
    private int roleID;
    @Column(name="rolename")
    private String roleName;
    @OneToMany(mappedBy="account_role") @JsonIgnore
    private List<Account> account;
}