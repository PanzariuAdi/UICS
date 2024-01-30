package uaic.ro.UICS.components;

public enum Components {
    TABLE("table"),
    HEADER("header"),
    IMAGE("image");

    private final String value;

    Components(String value) {
        this.value = value;
    }

    public static Components fromString(String value) {
        for (Components component : Components.values())  {
            if (component.value.equals(value)) {
                return component;
            }
        }

        return null;
    }
}
