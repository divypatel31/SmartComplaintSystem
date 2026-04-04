package services;

import models.User;

public class UserService {

    private User[] users = new User[100];
    private int count = 0;

    public void addUser(User user) {
        if (count < users.length) {
            users[count++] = user;
        } else {
            System.out.println("User storage full");
        }
    }

    public User getUserById(int userId) {
        for (int i = 0; i < count; i++) {
            if (users[i].getUserId() == userId) {
                return users[i];
            }
        }
        return null;
    }

    public void viewAllUsers() {
        for (int i = 0; i < count; i++) {
            System.out.println(users[i].getUserId() + " - " + users[i].getName());
        }
    }
}
