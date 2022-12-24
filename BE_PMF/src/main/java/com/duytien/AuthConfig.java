package com.duytien;

import java.util.NoSuchElementException;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.duytien.Dao.AccountDAO;
import com.duytien.Model.Account;

@Configuration
@EnableWebSecurity
//@EnableGlobalMethodSecurity(prePostEnabled=true)
public class AuthConfig extends WebSecurityConfigurerAdapter {
	@Autowired
	BCryptPasswordEncoder pe;
	@Autowired
	HttpServletRequest request;
	@Autowired
	AccountDAO accService;

	@Autowired
	// Mã hóa mật khẩu
	@Bean
	public static BCryptPasswordEncoder getPasswordEncoder() {
		return new BCryptPasswordEncoder();
	}

	// Quản lý người sử dụng
	@Override
	protected void configure(AuthenticationManagerBuilder auth) throws Exception {
		auth.userDetailsService(username -> {
			try {
				Account user = accService.findById(username).get();
				String password = pe.encode(user.getPass());
				String vaiTro = String.valueOf(user.getAccount_role().getRoleID());
				return User.withUsername(username).password(password).roles(vaiTro).build();
			} catch (NoSuchElementException e) {
				throw new UsernameNotFoundException(username + "Not found!");
			}
		});
	}

	// Phân quyền sử dụng và hình thức đăng nhập
	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http.csrf().disable().cors().disable();
		http.oauth2Login().loginPage("/auth/login/form").defaultSuccessUrl("/oauth2/login/success", false)
				.failureUrl("/auth/login/error").authorizationEndpoint().baseUri("/oauth2/authorization");
		// Đăng xuất
		http.logout().logoutUrl("/auth/logoff/success").logoutSuccessUrl("/auth/login/form");
	}
}
