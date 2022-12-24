package com.duytien.service;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.security.GeneralSecurityException;
import java.util.Collections;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.google.api.client.http.InputStreamContent;
import com.google.api.services.drive.Drive;
import com.google.api.services.drive.model.File;
import com.google.api.services.drive.model.FileList;

public class DriveFileManager {
	private String searchFolderId(String folderName, Drive service) throws Exception {
		  return searchFolderId(null, folderName, service);
		}
	
	private String searchFolderId(String parentId, String folderName, Drive service) throws Exception {
	  String folderId = null;
	  String pageToken = null;
	  FileList result = null;
	  File fileMetadata = new File();
	  fileMetadata.setMimeType("application/vnd.google-apps.folder");
	  fileMetadata.setName(folderName);
	  do {
	     String query = " mimeType = 'application/vnd.google-apps.folder' ";
	     if (parentId == null) {
	        query = query + " and 'root' in parents";
	     } else {
	        query = query + " and '" + parentId + "' in parents";
	     }
	     result = service.files().list().setQ(query)
	           .setSpaces("drive")
	           .setFields("nextPageToken, files(id, name)")
	           .setPageToken(pageToken)
	           .execute();
	     for (File file : result.getFiles()) {
	        if (file.getName().equalsIgnoreCase(folderName)) {
	           folderId = file.getId();
	        }
	     }
	     pageToken = result.getNextPageToken();
	  } while (pageToken != null && folderId == null);
	  return folderId;
	}
	
	private String findOrCreateFolder(String parentId, String folderName, Drive driveInstance) throws Exception {
		  String folderId = "1sWnAC2ry1IDgleW7ZhC0ibhiXNocdzlK";
				  searchFolderId(parentId, folderName, driveInstance);
		  // Folder already exists, so return id
		  if (folderId != null) {
		     return folderId;
		  }
		  //Folder dont exists, create it and return folderId
		  File fileMetadata = new File();
		  fileMetadata.setMimeType("application/vnd.google-apps.folder");
		  fileMetadata.setName(folderName);
		 
		  if (parentId != null) {
		     fileMetadata.setParents(Collections.singletonList(parentId));
		  }
		  return driveInstance.files().create(fileMetadata)
		        .setFields("id")
		        .execute()
		        .getId();
		}
	
	public String getFolderId(String path) throws Exception {
		  String parentId = null;
		  String[] folderNames = path.split("/");
		  GoogleDriveManager googleDriveManager = new GoogleDriveManager();
		  Drive driveInstance = googleDriveManager.getInstance();
		  for (String name : folderNames) {
		     parentId = findOrCreateFolder(parentId, name, driveInstance);
		  }
		  return parentId;
		}
	
	 public String uploadFile(MultipartFile file, String filePath) {
   	  try { 
   	     String folderId = getFolderId(filePath);
   	     if (file != null) {
   	        File fileMetadata = new File();
   	        fileMetadata.setParents(Collections.singletonList(folderId));
   	        fileMetadata.setName(file.getOriginalFilename());
   			GoogleDriveManager googleDriveManager = new GoogleDriveManager();
   			System.out.println("1");
   	        File uploadFile = googleDriveManager.getInstance()
   	              .files()
   	              .create(fileMetadata, new InputStreamContent(
   	                    file.getContentType(),
   	                    new ByteArrayInputStream(file.getBytes()))
   	              )
   	              .setFields("id").execute();
   	     System.out.println("2");
   	        return uploadFile.getId();
   	     }
   	  } catch (Exception e) {
   	     e.printStackTrace();
   	  }
   	  return null;
   	}
	 
	 public void downloadFile(String id, OutputStream outputStream) throws IOException, GeneralSecurityException {
	  if (id != null) {
		 GoogleDriveManager googleDriveManager = new GoogleDriveManager();
	     googleDriveManager.getInstance().files().get(id).execute();
	  }
	}
	 
	 public List<File> listEverything() throws IOException, GeneralSecurityException {
		  // Print the names and IDs for up to 10 files.
		 GoogleDriveManager googleDriveManager = new GoogleDriveManager();
		  FileList result = googleDriveManager.getInstance().files().list()
		        .setPageSize(10)
		        .setFields("nextPageToken, files(id, name)")
		        .execute();
		  return result.getFiles();
		}
}
