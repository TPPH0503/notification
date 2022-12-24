package com.duytien.Controller;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.duytien.Dao.*;
import com.duytien.Model.*;
@RestController
public class SectionController {
    @Autowired
    SectionDAO SectionDAO;

    @GetMapping("/pmf/Section/getSection")
    public List<Section> getListSection() {
        List<Section> Section = SectionDAO.findAll();
        return Section;
    }
}
