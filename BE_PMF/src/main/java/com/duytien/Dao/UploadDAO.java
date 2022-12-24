package com.duytien.Dao;

import java.io.File;
import javax.servlet.ServletContext;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class UploadDAO {
	@Autowired
	ServletContext app;
	
	public File save(MultipartFile file, String folder) {
		File dir=new File(app.getRealPath(""+folder));
		if(!dir.exists()) {
			dir.mkdirs();
		}
		String s=System.currentTimeMillis()+file.getOriginalFilename();
		String name=Integer.toHexString(s.hashCode())+s.substring(s.lastIndexOf("."));
		try {
			File savefile=new File(dir,name);
			file.transferTo(savefile);
			return savefile;
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}
}
