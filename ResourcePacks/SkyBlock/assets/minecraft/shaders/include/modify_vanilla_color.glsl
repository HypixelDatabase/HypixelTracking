#moj_import <color_util.glsl>

vec4 getModifiedNormalColor(int color, float alpha) {
    return vec4((color >> 16 & 0xFF) / 255.0, (color >> 8 & 0xFF) / 255.0, (color & 0xFF) / 255.0, alpha);
}

vec4 getModifiedShadowColor(int color, float alpha) {
    return vec4(((color >> 16 & 0xFF) / 4) / 255.0, ((color >> 8 & 0xFF) / 4) / 255.0, ((color & 0xFF) / 4) / 255.0, alpha);
}

vec4 getModifiedVanillaColor(vec4 color) {
    int tintColorID = getColorID(color.rgb);

    // Swap vanilla color palette with more pleasant one
    switch (tintColorID) {
        case 0xAA0000: return getModifiedNormalColor(0xD13228, color.a); // Dark red
        case 0x2A0000: return getModifiedShadowColor(0xD13228, color.a); 
        case 0xFFAA00: return getModifiedNormalColor(0xFF9000, color.a); // Gold
        case 0x3F2A00: return getModifiedShadowColor(0xFF9000, color.a); 
        case 0x0000AA: return getModifiedNormalColor(0x353FCE, color.a); // Dark blue
        case 0x00002A: return getModifiedShadowColor(0x353FCE, color.a); 
        case 0x5555FF: return getModifiedNormalColor(0x459BFF, color.a); // Blue
        case 0x15153F: return getModifiedShadowColor(0x459BFF, color.a); 
        case 0xAA00AA: return getModifiedNormalColor(0xA335EE, color.a); // Purple
        case 0x2A002A: return getModifiedShadowColor(0xA335EE, color.a); 
        case 0xAAAAAA: return getModifiedNormalColor(0xA8BFD2, color.a); // Light gray
        case 0x2A2A2A: return getModifiedShadowColor(0xA8BFD2, color.a); 
        case 0x555555: return getModifiedNormalColor(0x707592, color.a); // Gray
        case 0x151515: return getModifiedShadowColor(0x707592, color.a); 
        case 0xFFFF55: return getModifiedNormalColor(0xFFDE2F, color.a); // Yellow
        case 0x3F3F15: return getModifiedShadowColor(0xFFDE2F, color.a); 
        default: return color;
    }
}