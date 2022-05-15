package com.qyma.calendar.sevice;

import com.qyma.calendar.bean.NoteCalendar;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NoteService {

    @Autowired
    MongoTemplate template;
    public void save(NoteCalendar note){
        template.save(note);
    }
    public void update(String id, String pic, String content, String user, String x, String y, String visibility, String textDecoration,String type,String height,String width,String img) {
        NoteCalendar note = findById(id);
        if (note == null){
            return;
        }
        note.setContent(content);
        note.setUser(user);
        note.setX(x);
        note.setY(y);
        note.setPic(pic);
        note.setVisibility(visibility);
        note.setTextDecoration(textDecoration);
        note.setType(type);
        note.setHeight(height);
        note.setWidth(width);
        note.setImg(img);
        template.save(note);
    }

    public void update(String id,String x, String y,String cx, String cy) {
        NoteCalendar note = findById(id);
        if (note == null){
            return;
        }
        note.setPosX(x);
        note.setPosY(y);
        note.setPosCX(cx);
        note.setPosCY(cy);
        template.save(note);
    }

    public List<NoteCalendar> findByUser(String user) {
        Query query = new Query();
        query.addCriteria(Criteria.where("user").is(user));
        return template.find(query,NoteCalendar.class,"noteCalendar");
    }

    public NoteCalendar findById(String id) {
        Query query = new Query();
        query.addCriteria(Criteria.where("calendarId").is(id));
        return template.findOne(query,NoteCalendar.class,"noteCalendar");
    }


    public void removeById(String id) {
        Query query = new Query();
        query.addCriteria(Criteria.where("calendarId").is(id));
        template.remove(query,"noteCalendar");
    }
}
