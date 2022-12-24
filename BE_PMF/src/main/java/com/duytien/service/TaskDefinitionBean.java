package com.duytien.service;

import java.net.URI;
import java.net.URISyntaxException;
import java.text.SimpleDateFormat;
import java.util.Collections;
import java.util.Date;
import java.util.List;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import com.duytien.Model.Notification;
import com.duytien.Model.TaskDefinition;
import com.duytien.Model.Team_Members;
import com.nhathanh.bean.MailInfo;
import com.nhathanh.until.Utilities;
import static com.duytien.rest.TeamRestController.*;

public class TaskDefinitionBean implements Runnable {
	private TaskDefinition taskDefinition;

	@Override
	public void run() {
		System.out.println("With Data: " + taskDefinition.getJobID());
		System.out.println("With Data: " + taskDefinition.getAccount().getUsername());
		RestTemplate restTemplate = new RestTemplate();

		final String baseUrl = "http://localhost:3000/sendNotification";
		URI uri;
		try {
			uri = new URI(baseUrl);			
			if (taskDefinition.getLink() == null) {
				
				Notification noti = new Notification("Task " + taskDefinition.getTask().getTaskName(),
						taskDefinition.getDescription(), taskDefinition.getAccount().getUsername(),
						taskDefinition.getProject().getProjectID(), taskDefinition.getTask().getTaskID());
				HttpHeaders headers = new HttpHeaders();
				// set `content-type` header
				headers.setContentType(MediaType.APPLICATION_JSON);
				// set `accept` header
				headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

				// build the request
				HttpEntity<Notification> entity = new HttpEntity<>(noti, headers);

				// send POST request
				ResponseEntity<String> response = restTemplate.postForEntity(uri, entity, String.class);
				// Send notification remind user by email
				remindByEmailTask(taskDefinition);
				// Send notification remind user by SMS
				remindTaskBySMS(taskDefinition);
			} else {
				Notification noti = new Notification("Meeting " + taskDefinition.getTitle(),
						"See details in your email", taskDefinition.getAccount().getUsername(),
						taskDefinition.getProject().getProjectID(), -1);
				HttpHeaders headers = new HttpHeaders();
				// set `content-type` header
				headers.setContentType(MediaType.APPLICATION_JSON);
				// set `accept` header
				headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

				// build the request
				HttpEntity<Notification> entity = new HttpEntity<>(noti, headers);

				// send POST request
				ResponseEntity<String> response = restTemplate.postForEntity(uri, entity, String.class);
				// Send notification remind user by email
				remindByEmailMeeting(taskDefinition);
				// Send notification remind user by SMS
				remindMeetingBySMS(taskDefinition);
			}
		} catch (URISyntaxException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	private String remindTime() {
		Date data = new Date();
		SimpleDateFormat DateFor = new SimpleDateFormat("hh:mm, MMMMM dd yyyy");
		data.setMinutes(data.getMinutes() + 60);
		return DateFor.format(data).toString();
	}

	private void remindByEmailTask(TaskDefinition taskDefinition2) {
		String urlSendMail = "http://localhost:8080/pmf/sendMail/notification";
		// Set body email
		Utilities unti = new Utilities();
		String body = unti.bodyTask(taskDefinition2.getAccount().getFullname(),
				taskDefinition2.getProject().getProjectName(), remindTime(), taskDefinition2.getTask().getTaskName());
		// Set properties for MailInfor (user information)
		MailInfo info = new MailInfo();
		info.setTo(taskDefinition2.getAccount().getEmail());
		info.setSubject("Reminding your meeting");
		info.setBody(body);
		// Send maill notification to user by email
		sendPostApi(urlSendMail, info);
	}

	private void remindByEmailMeeting(TaskDefinition taskDefinition2) {
		String urlSendMail = "http://localhost:8080/pmf/sendMail/notification";
		// Set body email
		Utilities unti = new Utilities();
		String body = unti.bodyMail1(taskDefinition.getProject().getProjectName(),
				taskDefinition2.getAccount().getFullname(), taskDefinition2.getTitle(), remindTime(),
				taskDefinition2.getLink(), taskDefinition2.getDescription());
		// Set properties for MailInfor (user information)
		MailInfo info = new MailInfo();
		info.setTo(taskDefinition2.getAccount().getEmail());
		info.setSubject("Reminding your meeting");
		info.setBody(body);
		// Send maill notification to user by email
		sendPostApi(urlSendMail, info);
	}

	// Remind user by SMS
	private void remindMeetingBySMS(TaskDefinition info) {
		String urlSendMail = "http://localhost:8080/pmf/sendSMS/notification";
		// Set some properties
		MailInfo content = new MailInfo();
		// Number Phone
		content.setTo(info.getAccount().getPhone());
		// Content SMS
		content.setBody("You have a meeting begin at " + remindTime() + ". Topic is: " + info.getTitle()
				+ ". Have you a nice day!");
		// Send SMS with API
		sendPostApi(urlSendMail, content);
	}

	private void remindTaskBySMS(TaskDefinition info) {
		String urlSendMail = "http://localhost:8080/pmf/sendSMS/notification";
		// Set some properties
		MailInfo content = new MailInfo();
		// Number Phone
		content.setTo(info.getAccount().getPhone());
		// Content SMS
		content.setBody("You have a task assigned and finished on " + remindTime() + ". The task name is "
				+ info.getTask().getTaskName() + ", in project " + info.getProject().getProjectName()
				+ ". Please complete your mission! Have you a nice day!");
		// Send SMS with API
		sendPostApi(urlSendMail, content);
	}

	private void sendPostApi(String url, MailInfo content) {
		RestTemplate restTemplate = new RestTemplate();
		String urlSendMail = url;
		HttpEntity<MailInfo> request = new HttpEntity<>(content);
		restTemplate.postForObject(urlSendMail, request, MailInfo.class);
	}

	public TaskDefinition getTaskDefinition() {
		return taskDefinition;
	}

	public void setTaskDefinition(TaskDefinition taskDefinition) {
		this.taskDefinition = taskDefinition;
	}

}
