package com.duytien.Model;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.*;

import lombok.*;

@Data
@Entity
@Table(name = "Web_Security")
public class Web_Security implements Serializable {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	private String name;
	private String note;
	@Column(name = "versionweb")
	private float versionWeb;
	@Column(name = "startdate")
	private Date startDate;
	@Column(name = "enddate")
	private Date endDate;
	private String content;
	@Column(name = "statusweb")
	private boolean statusWeb;
}
