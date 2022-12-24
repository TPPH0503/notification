package com.duytien.Model;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Chart2 {
	boolean cate;
	String name;
	String description;
	int stt;
	Date date;
}
