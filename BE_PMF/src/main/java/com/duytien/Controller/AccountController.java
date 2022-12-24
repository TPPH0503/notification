package com.duytien.Controller;

import static com.nhathanh.until.Information_login.accountLogin;
import static com.nhathanh.until.Information_login.ds_login;

import java.io.IOException;
import java.io.InputStream;
import java.net.URISyntaxException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.io.IOException;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Random;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.view.RedirectView;

import com.duytien.Dao.AccountDAO;
import com.duytien.Dao.ActivityDAO;
import com.duytien.Dao.Activity_CategoryDAO;
import com.duytien.Model.Account;
import com.duytien.Model.Account_Role;
import com.duytien.Model.Activity;
import com.duytien.service.MailerService;
import com.duytien.service.UserService;
import com.nhathanh.until.Utilities;

@CrossOrigin("*")
@RestController
public class AccountController {
	@Autowired
	AccountDAO accountDAO;

	@Autowired
	ActivityDAO actDAO;

	@Autowired
	Activity_CategoryDAO aCateDAO;

	@Autowired
	UserService us;
	@Autowired
	MailerService mailer;
	@Autowired
	HttpServletRequest request;

	@GetMapping("/pmf/Account/getAccount")
	public List<Account> getListAccount() {
		List<Account> accounts = accountDAO.findAll();
		return accounts;
	}
	
	@GetMapping("/pmf/Account/findAccount/{data}")
	public List<Account> findAccount(@PathVariable("data") String data) {
		List<Account> accounts = accountDAO.findAccount(data);
		return accounts;
	}
	
	@GetMapping("/pmf/Account/admin/getTimeline")
	public List<Account> getTimeline() {
		List<Account> accounts = accountDAO.findAll();
		
		List<Account> timeLine = new ArrayList<>();
		
		
		for (Account account : accounts) {
			
			Account acc = new Account();
			
			acc.setUsername(account.getUsername());
			acc.setFullname(account.getFullname());
			acc.setCreateDate(account.getCreateDate());
			acc.setImage(account.getImage());
			acc.setAccount_role(account.getAccount_role());
			
			timeLine.add(acc);
		}
	
		return timeLine;
	}

	@GetMapping("/pmf/account/getFindOne/{username}")
	public Account getAccount(@PathVariable("username") String username) {
		try {
			Account ac = accountDAO.findById(username).get();
			return ac;
		} catch (Exception e) {
			System.out.println("Account not exits!");
			return null;
		}
	}

	// Login form basic
	@PostMapping("/pmf/login")
	public Account loginForm(@RequestBody Account user) {
		try {
			accountLogin = accountDAO.findById(user.getUsername()).get();
			// ds_login.add(accountLogin);
			System.out.println("Login with basic form successfully!");
			return accountLogin;
		} catch (Exception e) {
			System.out.println("Login with form bacsic error! Because account not exits!");
		}
		return null;
	}

	// Google login after successfully
	@GetMapping("/oauth2/login/success")
	public RedirectView sucessGmail(OAuth2AuthenticationToken oauth2) throws IOException, URISyntaxException {
		// Edit information for Gmail!
		us.loginFromOAuth2(oauth2);
		// Check id account gmail with data in database
		accountLogin = checkAccount(oauth2, oauth2.getPrincipal().getAttribute("sub"));
		return new RedirectView("http://127.0.0.1:5500/template/client/home.html");
	}

	// Check account when user login with gmail
	public Account checkAccount(OAuth2AuthenticationToken oauth2, String username) {
		// variable check account!
		boolean check = false;
		try {
			if (accountDAO.findById(username).get() != null) {
				// Account exits
				System.out.println("Account exits!");
				check = true;
			}
		} catch (Exception e) {
			System.out.println("Account not exits!");
			// If account not exits, create new account, else login!
			check = false;
		}
		if (check == false) {
			// Account not exits, create new Account
			return accountDAO.save(newAccount(oauth2));
		} else {
			// Return back Account
			return accountDAO.findById(username).get();
		}
	}

	// New account when user login with gmail!
	public Account newAccount(OAuth2AuthenticationToken token) {
		Account ac = new Account();
		Account_Role acRole = new Account_Role();
		acRole.setRoleID(2);
		acRole.setRoleName("User");
		// Get value from gmail
		if (token != null) {
			ac.setUsername(token.getPrincipal().getAttribute("sub"));
			ac.setPass(token.getPrincipal().getAttribute("at_hash"));
			ac.setFullname(token.getPrincipal().getAttribute("given_name"));
			ac.setEmail(token.getPrincipal().getAttribute("email"));
			ac.setPhone("");
			ac.setImage(token.getPrincipal().getAttribute("picture"));
			ac.setStatus(1);
			ac.setAddress("");
			ac.setAccount_role(acRole);
			System.out.println("Create new Account successfully!!");
		}
		return ac;
	}

	// Forget password and set value password
	@PostMapping("/pmf/default/password")
	public Account resetPass(@RequestBody Account ac) {
		try {
			Utilities unti = new Utilities();
			// New password
			String uniquePassword = UUID.randomUUID().toString();
			ac.setPass(uniquePassword);
			System.out.println(ac.getEmail() + " email was send!");
			sendMail(ac.getEmail(), "System Rman say...", unti.bodyMail(ac.getPass()));
			return accountDAO.save(ac);
		} catch (Exception e) {
			System.out.println(e);
			return null;
		}
	}

	// Send notify mail to user
	void sendMail(String to, String subject, String body) {
		try {
			mailer.send(to, subject, body);
			System.out.println("Gửi mail thành công");
		} catch (Exception e) {
			System.out.println("Gửi mail thất bại");
		}
	}

	// Logout user
	@GetMapping("/pmf/logout")
	public boolean logout() {
		try {
			accountLogin = null;
			return true;
		} catch (Exception e) {
			return false;
		}
	}

	// Get information in List
	@GetMapping("/pmf/data/login/{username}")
	public Account data_list(@PathVariable("username") String username) {
		for (Account account : ds_login) {
			if (account.getUsername().equals(username)) {
				return account;
			}
		}
		return null;
	}

	// Cập nhật trạng thái account
	@PutMapping("/pmf/Account/updateStatus/{username}/{status}")
	public Integer upadteStatus(@PathVariable("username") String username, @PathVariable("status") Integer status,
			@RequestBody String reason) {
		Date date = new Date();
		Activity act = new Activity();

		act.setUsername(username);
		act.setActivity_category(aCateDAO.findById(20).get());
		act.setActivityName("Tài khoản " + username + " đã bị khóa!");
		act.setStartDate(date);
		act.setObjectID(accountDAO.findById(username).get().getStatus());
		act.setDiscription(reason);

		accountDAO.updateStatusAccount(username, status);
		actDAO.save(act);

		return status;
	}

	@GetMapping("/pmf/user/{id}")
	public Account getone(@PathVariable("id") String id) {
		Account Accounts = accountDAO.findById(id).get();
		return Accounts;
	}

	// Hien thi thong tin profile cua account
	@GetMapping("/pmf/Account/getProfile/{username}")
	public Account getProfileAccount(@PathVariable("username") String id) {
		Account account = accountDAO.findById(id).get();
		return account;
	}

	// Hien thi hinh anh da duoc upload tu folder Image Account
	@RequestMapping("/pmf/getImage/{image}")
	@ResponseBody
	public ResponseEntity<ByteArrayResource> getImage(@PathVariable("image") String image) {

		if (!image.equals(null) || image != null) {
			try {
				Path filename = Paths.get("Image Account", image);
				byte[] buffer = Files.readAllBytes(filename);
				ByteArrayResource bar = new ByteArrayResource(buffer);
				return ResponseEntity.ok().contentLength(buffer.length)
						.contentType(MediaType
								.parseMediaType("image/" + image.substring(image.indexOf(".") + 1, image.length())))
						.body(bar);
			} catch (Exception e) {

			}
		}

		return ResponseEntity.badRequest().build();
	}

	// Cap nhat thong tin profile cua account
	@PutMapping("/pmf/Account/updateProfile/{name}")
	public Account updateProfileAccount(@RequestBody Account account, @PathVariable("name") String name) {
		account.setImage(name);
		accountDAO.save(account);
		return account;
	}

	// Upload anh da chon vao thu muc Image Account
	@PutMapping("/pmf/Account/upload")
	public String upload(@RequestParam("file") MultipartFile image) {
		Path path = Paths.get("Image Account/");
		if (image != null) {
			try {
				InputStream inputStream = image.getInputStream();
				Files.copy(inputStream, path.resolve(image.getOriginalFilename()), StandardCopyOption.REPLACE_EXISTING);
			} catch (Exception e) {

			}
		} else {
			System.out.println("Rỗng!");
		}
		return image.getOriginalFilename();
	}

	// Đặc biệt nghiêm trọg phần của Thái Hoàng Diệu
	@GetMapping("/pmf/Account/getUsername")
	public List<String> getUsername() {
		return accountDAO.listUsername();
	}

	@GetMapping("/pmf/Account/getemail")
	public List<String> getemail() {
		return accountDAO.listemail();
	}

	@PostMapping("/pmf/Account/register")
	public Account register(@RequestBody Account account) {
		accountDAO.save(account);
		return account;
	}

}
