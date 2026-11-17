#ifndef SHARED_EMISSIVE_GLSL
#define SHARED_EMISSIVE_GLSL

// Decode raw texture alpha before cutout: 252 = opaque, 127 = half, -1 = non-emissive.
float getEmissiveOpacity(float textureAlpha) {
    int alphaByte = int(round(textureAlpha * 255.0));
    if (alphaByte == 252) return 1.0;
    if (alphaByte == 127) return 0.5;
    return -1.0;
}

vec4 applyEmissiveColor(vec4 litColor, vec4 textureColor, vec4 rawTint, float emissiveOpacity) {
    if (emissiveOpacity < 0.0) return litColor;
    return vec4(textureColor.rgb, emissiveOpacity) * rawTint;
}

#endif
