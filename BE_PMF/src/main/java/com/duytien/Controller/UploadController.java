package com.duytien.Controller;

import com.google.api.services.drive.model.File;
import java.util.Collections;

import javax.websocket.server.PathParam;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.duytien.Dao.UploadDAO;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.google.api.services.drive.Drive;
import com.google.api.services.drive.model.File;
import com.google.api.services.drive.model.FileList;

@CrossOrigin("*")
@RestController
public class UploadController {
	@Autowired
	UploadDAO dao;
	
//	@PostMapping("/api/upload/{folder}")
//	public JsonNode upload(@PathParam("file")MultipartFile file,
//			@PathVariable("folder") String folder) {
//		File savefile=dao.save(file, folder);
//		ObjectMapper mapper=new ObjectMapper();
//		ObjectNode node=mapper.createObjectNode();
//		node.put("name",savefile.getName());
//		node.put("size", savefile.length());
//		return node;
//	}
	
}
