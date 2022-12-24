package com.duytien.Controller;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.duytien.Dao.*;
import com.duytien.Model.*;
@RestController
public class Activity_CategoryController {
    @Autowired
    Activity_CategoryDAO Activity_CategoryDAO;

    @GetMapping("/pmf/Activity_Category/getActivity_Category")
    public List<Activity_Category> getListActivity_Category() {
        List<Activity_Category> Activity_Category = Activity_CategoryDAO.findAll();
        return Activity_Category;
    }
}
