package models;

public abstract class User {

    protected int userId;
    protected String name;

    public User(int userId, String name) {
        this.userId = userId;
        this.name = name;
    }

    public int getUserId() {
        return userId;
    }

    public String getName() {
        return name;
    }
    public abstract void performAction();
}
