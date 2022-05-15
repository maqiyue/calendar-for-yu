package com.qyma.calendar.control;

import com.google.gson.Gson;
import com.qyma.calendar.bean.NoteCalendar;
import com.qyma.calendar.sevice.NoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.UUID;

@Controller
@ResponseBody
public class NoteController {

    @Autowired
    NoteService noteService;

    @RequestMapping(value = "/notes")
    public String index(Model model, @RequestParam(value = "user",required = true) String user) {
        return "index.html";
    }

    @RequestMapping(value = "/notes/update",method= RequestMethod.POST)
    public void update(HttpServletRequest request){
        String id = request.getParameter("id");
        String pic = request.getParameter("pic");
        String content = request.getParameter("content");
        String user = request.getParameter("user");
        String x = request.getParameter("x");
        String y = request.getParameter("y");
        String visibility = request.getParameter("visibility");
        String textDecoration = request.getParameter("textDecoration");
        String type = request.getParameter("type");
        String height = request.getParameter("height");
        String width = request.getParameter("width");
//        noteService.update(id,pic,content,user,x,y,visibility,textDecoration,type,height,width);
    }

    @RequestMapping(value = "/notes/insert")
    public String insert(){
        String id = UUID.randomUUID().toString();
        long time = System.currentTimeMillis();
        NoteCalendar note = new NoteCalendar(id,time);
        noteService.save(note);
        return id;
    }

    @RequestMapping(value = "/notes/init")
    public String init(@RequestParam(value = "user",required = true) String user) {
        List<NoteCalendar> notes = noteService.findByUser(user);
        return new Gson().toJson(notes);
    }

    @RequestMapping(value = "/notes/remove")
    public String remove(@RequestParam(value = "id",required = true) String id) {
        noteService.removeById(id);
        return null;
    }

    @RequestMapping(value = "/notes/findById")
    public String findById(@RequestParam(value = "id",required = true) String id) {
        NoteCalendar notes = noteService.findById(id);
        return new Gson().toJson(notes);
    }

    @RequestMapping(value = "/notes/updatePos")
    public void updateStatus(
                       @RequestParam(name = "id") String id,
                       @RequestParam(name = "x") String x,
                       @RequestParam(name = "y") String y,
                       @RequestParam(name = "cx") String cx,
                       @RequestParam(name = "cy") String cy){
        noteService.update(id,x,y,cx,cy);
    }

    @RequestMapping(value = "/verify/sgz")
    public String verifySgz() {

        return "ok";
    }
}
