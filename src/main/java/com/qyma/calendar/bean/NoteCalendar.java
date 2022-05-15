package com.qyma.calendar.bean;


import org.springframework.data.annotation.Id;

public class NoteCalendar extends Calendar{

    @Id
    private String id;

    private String calendarId;

    private String title;

    private String content;

    private long time;

    private String dateTime;

    private int status; //0 有效 1 过期

    private boolean isDebug;

    private int fontColor;

    private int bgColor;

    private String tag;

    private String user;

    private String x;

    private String y;

    private String posX;

    private String posY;

    private String posCX;

    private String posCY;

    private String pic;

    private String textDecoration;

    private String visibility;

    private String type;

    private String height;
    private String width;

    private String img;

    public NoteCalendar() {
    }

    public NoteCalendar(String calendarId, long time) {
        this.calendarId = calendarId;
        this.time = time;
    }

    public NoteCalendar(String calendarId, String content, long time, String user) {
        this.calendarId = calendarId;
        this.content = content;
        this.time = time;
        this.user = user;
    }

    public String getCalendarId() {
        return calendarId;
    }

    public void setCalendarId(String calendarId) {
        this.calendarId = calendarId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public long getTime() {
        return time;
    }

    public void setTime(long time) {
        this.time = time;
    }

    public String getDateTime() {
        return dateTime;
    }

    public void setDateTime(String dateTime) {
        this.dateTime = dateTime;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public boolean isDebug() {
        return isDebug;
    }

    public void setDebug(boolean debug) {
        isDebug = debug;
    }

    public int getFontColor() {
        return fontColor;
    }

    public void setFontColor(int fontColor) {
        this.fontColor = fontColor;
    }

    public int getBgColor() {
        return bgColor;
    }

    public void setBgColor(int bgColor) {
        this.bgColor = bgColor;
    }

    public String getTag() {
        return tag;
    }

    public void setTag(String tag) {
        this.tag = tag;
    }

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }

    public String getX() {
        return x;
    }

    public void setX(String x) {
        this.x = x;
    }

    public String getY() {
        return y;
    }

    public void setY(String y) {
        this.y = y;
    }

    public String getPic() {
        return pic;
    }

    public void setPic(String pic) {
        this.pic = pic;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTextDecoration() {
        return textDecoration;
    }

    public void setTextDecoration(String textDecoration) {
        this.textDecoration = textDecoration;
    }

    public String getVisibility() {
        return visibility;
    }

    public void setVisibility(String visibility) {
        this.visibility = visibility;
    }

    public String getPosX() {
        return posX;
    }

    public void setPosX(String posX) {
        this.posX = posX;
    }

    public String getPosY() {
        return posY;
    }

    public void setPosY(String posY) {
        this.posY = posY;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getHeight() {
        return height;
    }

    public void setHeight(String height) {
        this.height = height;
    }

    public String getWidth() {
        return width;
    }

    public void setWidth(String width) {
        this.width = width;
    }

    public String getPosCX() {
        return posCX;
    }

    public void setPosCX(String posCX) {
        this.posCX = posCX;
    }

    public String getPosCY() {
        return posCY;
    }

    public void setPosCY(String posCY) {
        this.posCY = posCY;
    }

    public String getImg() {
        return img;
    }

    public void setImg(String img) {
        this.img = img;
    }
}
