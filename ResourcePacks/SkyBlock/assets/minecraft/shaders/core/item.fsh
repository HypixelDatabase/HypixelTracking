#version 330
#extension GL_ARB_separate_shader_objects : require

#include <emissives.glsl>

#ifdef GLINT
#include <minecraft:globals.glsl>
#endif
#include <minecraft:fog.glsl>
#include <minecraft:dynamictransforms.glsl>
#include <minecraft:oit.glsl>

uniform sampler2D Sampler0;

#ifdef GLINT
uniform sampler2D GlintSampler;
#endif

#ifndef OIT_ALPHA_ONLY
layout(location = 0) in float sphericalVertexDistance;
layout(location = 1) in float cylindricalVertexDistance;
#endif
layout(location = 2) in vec4 vertexColor;
#ifndef OIT_ALPHA_ONLY
layout(location = 3) in vec4 lightMapColor;
layout(location = 4) in vec4 overlayColor;
#endif
layout(location = 5) in vec2 texCoord0;
#ifdef GLINT
layout(location = 6) in vec2 texCoordGlint;
#endif

#ifndef OIT_ALPHA_ONLY
layout(location = 0) out vec4 fragColor;
#endif

#ifndef OIT_ALPHA_ONLY
vec4 calculateFinalColor(vec4 color, vec4 _lightMapColor, vec4 _overlayColor) {
    color.rgb = mix(_overlayColor.rgb, color.rgb, _overlayColor.a);
    color *= _lightMapColor;

    #ifdef GLINT
    vec4 glintColor = GlintAlpha * texture(GlintSampler, texCoordGlint);
    color.rgb += glintColor.rgb * glintColor.rgb;
    #endif

    #ifdef OIT_ACCUMULATE
    color = sampleColorForAccumulation(color);
    vec4 fogColor = vec4(FogColor.rgb * color.a, FogColor.a);
    #else
    vec4 fogColor = FogColor;
    #endif

    return apply_fog(color, sphericalVertexDistance, cylindricalVertexDistance, FogEnvironmentalStart, FogEnvironmentalEnd, FogRenderDistanceStart, FogRenderDistanceEnd, fogColor);
}
#endif

layout(location = 11) in vec4 emissiveTint;

void main() {
    vec4 sampledColor = texture(Sampler0, texCoord0);
    float emissiveOpacity = getEmissiveOpacity(sampledColor.a);
    vec4 color = sampledColor;
    color.a = emissiveOpacity >= 0.0 ? emissiveOpacity : sampledColor.a;
    #ifdef ALPHA_CUTOUT
    if (color.a < ALPHA_CUTOUT) {
        discard;
    }
    #endif

    color *= vertexColor * ColorModulator;
    color = applyEmissiveColor(color, sampledColor, emissiveTint * ColorModulator, emissiveOpacity);

    #ifdef GLINT
    color.a = max(color.a, GlintAlpha);
    #endif

    #ifdef OIT_ALPHA_ONLY
    executeAlphaOnlyPhase(gl_FragCoord.z, color.a);
    #else
    vec4 _lightMapColor = lightMapColor;

    if (emissiveOpacity >= 0.0) {
        _lightMapColor = vec4(1.0);
    }

    fragColor = calculateFinalColor(color, _lightMapColor, overlayColor);
    #endif
}
