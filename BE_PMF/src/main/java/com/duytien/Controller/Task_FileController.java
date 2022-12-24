package com.duytien.Controller;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.security.GeneralSecurityException;
import java.util.Collections;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.duytien.Dao.*;
import com.duytien.Model.*;
import com.duytien.service.DriveFileManager;
import com.duytien.service.GoogleDriveManager;
import com.google.api.client.googleapis.media.MediaHttpDownloader;
import com.google.api.client.http.InputStreamContent;
import com.google.api.services.drive.Drive.Files.Get;
import com.google.api.services.drive.model.File;

@CrossOrigin("*")
@RestController
public class Task_FileController {
    @Autowired
    Task_FileDAO task_FileDao;

    @Autowired
    AccountDAO accountDao;
    
    @Autowired
    TaskDAO taskDao;
    
    @Autowired
    ProjectDAO projectDao;
    
    
    @GetMapping("/pmf/Task_File/getAll")
    public List<Task_File> getAll() {
        List<Task_File> Task_File = task_FileDao.findAll();
        return Task_File;
    }
    
    @GetMapping("/xoa/{id}")
    public String xoa(@PathVariable("id") Integer id) {
    	task_FileDao.deleteById(id);
    	return "ok";
    }
    
    @GetMapping("/pmf/Task_File/getByUser/{username}")
    public List<Task_File> getByUser(@PathVariable("username")String username) {
        List<Task_File> Task_File = task_FileDao.findByUsername(username);
        return Task_File;
    }
    
    @GetMapping("/pmf/Task_File/getByTask/{id}")
    public List<Task_File> getByTask(@PathVariable("id") Integer id) {
        List<Task_File> Task_File = task_FileDao.findByTaskID(id);
        return Task_File;
    }
    
    @GetMapping("/pmf/Task_File/getByProject/{id}")
    public List<Task_File> getByProject(@PathVariable("id") Integer id) {
        List<Task_File> Task_File = task_FileDao.findByProjectID(id);
        return Task_File;
    }
    
    @GetMapping("/pmf/Task_File/getListInTask/{projectid}/{taskid}")
    public List<Task_File> getByProject(@PathVariable("projectid") Integer projectid, @PathVariable("taskid") Integer taskid) {
        List<Task_File> Task_File = task_FileDao.findListInTask(projectid, taskid);
        return Task_File;
    }
    
    //Luu thong tin nguoi dung upload vao task_file
    @PostMapping("/pmf/Task_File/saveFile")
	public Task_File saveTaskFile(@RequestBody Task_File file) {
    	
    	file.setAccount(accountDao.findById(file.getAccount().getUsername()).get());
		file.setTask(taskDao.findById(file.getTask().getTaskID()).get());
		file.setProject(projectDao.findById(file.getProject().getProjectID()).get());
		
		Date date = new Date();
		file.setCreateDate(date);
		task_FileDao.save(file);
     	return file;
	}
    
    //Upload file da chon len Google Drive
    @PostMapping("/pmf/Task_File/upload") 
    public Task_File uploadSingleFileExample4(@RequestBody MultipartFile file) {
      String path = "/FileUpload";
   	  System.out.println("Request contains, File: " + file.getOriginalFilename());
   	  DriveFileManager driveFileManager = new DriveFileManager();
   	  String fileId = driveFileManager.uploadFile(file, path);
   	  Task_File tf = new Task_File();
   	  tf.setCode(fileId);
   	  return tf;
   	}
  	
}
