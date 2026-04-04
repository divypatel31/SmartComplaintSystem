package menu;

public abstract class BaseMenu {
    public abstract void showMenu();
    
    // Changed from void to boolean so menus can signal when to exit
    public abstract boolean handleInput(); 
}