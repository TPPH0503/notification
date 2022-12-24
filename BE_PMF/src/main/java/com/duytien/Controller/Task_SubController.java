package com.duytien.Controller;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.duytien.Dao.*;
import com.duytien.Model.*;
@RestController
@CrossOrigin("*")
public class Task_SubController {
    @Autowired
    Task_SubDAO Task_SubDAO;

    @GetMapping("/pmf/Task_Sub/getTask_Sub")
    public List<Task_Sub> getListTask_Sub() {
        List<Task_Sub> Task_Sub = Task_SubDAO.findAll();
        return Task_Sub;
    }
    
    @GetMapping("/pmf/Task_Sub/getTask_Sub/{sid}")
    public Task_Sub getTask_Sub(@PathVariable("sid") Integer sid) {
        Task_Sub Task_Sub = Task_SubDAO.findById(sid).get();
        return Task_Sub;
    }
    
    @PutMapping("/pmf/Task_Sub/rename")
    public void rename(@RequestBody ArrayList<Object> obj) {
        Task_SubDAO.renameSubtask(Integer.parseInt(String.valueOf(obj.get(0))), String.valueOf(obj.get(1)));
    }
}
