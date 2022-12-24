package com.duytien.service;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.NoSuchElementException;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.stereotype.Service;

import com.duytien.Dao.AccountDAO;
import com.duytien.Model.Account;

@Service
public class UserService implements UserDetailsService {
    @Autowired
    BCryptPasswordEncoder pe;
    @Autowired
    AccountDAO dao;
    @Autowired
    HttpServletRequest request;


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
            try {
                Account user = dao.findById(username).get();
                String password = pe.encode(user.getPass());
                String vaiTro = String.valueOf(user.getAccount_role().getRoleID()); 
                return User.withUsername(username).password(password).roles(vaiTro).build();
            } catch (NoSuchElementException e) {
                throw new UsernameNotFoundException(username + "Not found!");
            }
       
    }

    public void loginFromOAuth2(OAuth2AuthenticationToken oauth2) throws IOException, URISyntaxException {
        String email = oauth2.getPrincipal().getAttribute("email");
        String password = Long.toHexString(System.currentTimeMillis());

        UserDetails user = User.withUsername(email).password(pe.encode(password)).roles("2").build();
        Authentication auth = new UsernamePasswordAuthenticationToken(user, password, user.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(auth);
    
    }
}