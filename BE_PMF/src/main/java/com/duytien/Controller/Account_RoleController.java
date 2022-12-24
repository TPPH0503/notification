package com.duytien.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.duytien.Dao.Account_RoleDAO;
import com.duytien.Model.Account_Role;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.rest.api.v2010.account.ValidationRequest;

@CrossOrigin("*")
@RestController
public class Account_RoleController {
	@Autowired
	Account_RoleDAO Account_RoleDAO;

	@GetMapping("/pmf/Account_Role/getAccount_Role")
	public List<Account_Role> getListAccount_Role() {
		List<Account_Role> Account_Role = Account_RoleDAO.findAll();
		return Account_Role;
	}

	public static final String ACCOUNT_SID = "AC2c8e74c50fd9173512b41c75b5fe9be7";
	public static final String AUTH_TOKEN = "74cc84800300c6293d2cfafabf22ecd4";

	@GetMapping("/send/SMS")
	public String sendSMS() {

		Twilio.init(ACCOUNT_SID, AUTH_TOKEN);
//		ValidationRequest validationRequest = ValidationRequest.creator(
//                new com.twilio.type.PhoneNumber("+84974483670"))
//            .setFriendlyName("My Home Phone Number")
//            .create();
//		
//		 Message message = Message.creator(
//				 new com.twilio.type.PhoneNumber("+84974483670"),
//				 new com.twilio.type.PhoneNumber("+18149148016"),
//                 "Tao Nhã nè, thấy được SMS gọi tao để tao kiểm tra í =((")
//                 .create();

//		System.out.println(message.getSid());
		System.out.println("Send SMS successfully!");
		return "Successfully";
	}

}
