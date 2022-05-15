package com.qyma.calendar.sevice;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class TestService {

    @Autowired
    MongoTemplate mongoTemplate;

    public String inc(String str) {
        Map<String,Object> map = new HashMap<>();
        map.put("str",str);
        mongoTemplate.insert(map,"test");
        return "SUCCESS";
    }
}
