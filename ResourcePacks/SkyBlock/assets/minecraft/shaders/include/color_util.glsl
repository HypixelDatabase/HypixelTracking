/*
 * Utility functions for modifying colors
 */

// Takes a double between 0.0 and 1.0 and returns a color in RGB
vec3 hueToRGB(float hue) {

    hue *= 6; // Make numbers cleaner
    vec3 colors = mod(vec3(hue+5, hue+3, hue+1), 6); // Offset colors

    return 1 - clamp(min(colors, 4 - colors), 0, 1); // Make color value go up, then down, and clamp between 0 and 1
}

// Translates a color from HSV to RGB
vec3 hsvToRGB(float hue, float saturation, float value) {

    hue *= 6; // Make numbers cleaner
    vec3 colors = mod(vec3(hue+5, hue+3, hue+1), 6); // Offset colors

    return (1 - (clamp(min(colors, 4 - colors), 0, 1)) * saturation) * value;
}

int colorToInt(float color) {
    return int(color * 255.0);
}

ivec2 colorToInt(vec2 color) {
    return ivec2(color * 255.0);
}

ivec3 colorToInt(vec3 color) {
    return ivec3(color * 255.0);
}

ivec4 colorToInt(vec4 color) {
    return ivec4(color * 255.0);
}

int getColorID(vec3 color) {
    int r = int(color.r * 255.0);
    int g = int(color.g * 255.0);
    int b = int(color.b * 255.0);
    return (r << 16) + (g << 8) + (b);
}