package com.nhathanh.bean;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MailInfo {
	String from;
	String to;
	String subject;
	String body;

	public MailInfo(String to, String subject, String body) {
		super();
		this.from = "Notification from Project Management PMF";
		this.to = to;
		this.subject = subject;
		this.body = body;
	}
}
