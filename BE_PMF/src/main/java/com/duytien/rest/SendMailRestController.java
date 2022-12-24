package com.duytien.rest;

import javax.mail.MessagingException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.duytien.service.MailerService;
import com.nhathanh.bean.MailInfo;
import com.nhathanh.until.Utilities;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
public class SendMailRestController {
	@Autowired
	MailerService mail;
	// SMS TOKEN
	public static final String ACCOUNT_SID = "AC6e4666cc3bc4ead75c54ea958cee9f11";
	public static final String AUTH_TOKEN = "1141f56e6e9bcd6aa3ecd6e162767e7d";

	@PostMapping("/pmf/sendMail/notification")
	public void sendMails(@RequestBody MailInfo mailInfo) throws MessagingException {
		mail.queue(mailInfo);
	}

	// SMS send by Twilio
	@PostMapping("/pmf/sendSMS/notification")
	public void sendSMS(@RequestBody MailInfo mailInfo) {
		Twilio.init(ACCOUNT_SID, AUTH_TOKEN);
		String sdt = mailInfo.getTo();
		String content = mailInfo.getBody();
		Message message = Message.creator(new com.twilio.type.PhoneNumber("+84" + sdt.substring(1, 10)),
				"MGd76950209a471970a4415ade420fa1bf", content).create();
		System.out.println(message.getSid());
	}

	// Send check SMS
	@GetMapping("/pmf/check/ssm")
	public String sendd() {
		try {
			Twilio.init("AC47dce0186601f123a33b635f36a2f5b1", "e94eeb99447db4c5425a636c2bb2235e");
			Message message = Message.creator(new com.twilio.type.PhoneNumber("+84" + "374038128"), "+19033670073",
					"Check send SMS by Manage WareHouse!").create();
			System.out.println(message.getSid());
			return "Successfully";
		} catch (Exception e) {
			return "Error " + e;
		}
	}

	// Send mail code verify to user
	@GetMapping("/pmf/Account/send/code/{email}")
	public int codeVerify(@PathVariable("email") String email) throws MessagingException {
		double randomDouble = Math.random();
		randomDouble = randomDouble * 100000 + 1;
		int randomInt = (int) randomDouble;
		String newChart = email.substring(0, email.indexOf("@"));
		// Set body send mail
		Utilities util = new Utilities();
		String body = util.bodyCodeVerify(newChart, randomInt);
		MailInfo mailInfo = new MailInfo();
		mailInfo.setTo(email);
		mailInfo.setBody(body);
		mailInfo.setSubject("Verify your email");
		mailInfo.setFrom("Project_manager_formula");
		// Send mail
		mail.send(mailInfo);
		return randomInt;
	}
}
