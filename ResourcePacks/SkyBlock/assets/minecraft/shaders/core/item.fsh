#version 330

#moj_import <shared_data_ids.glsl>

#moj_import <minecraft:fog.glsl>
#moj_import <minecraft:dynamictransforms.glsl>

uniform sampler2D Sampler0;

in float sphericalVertexDistance;
in float cylindricalVertexDistance;
in vec4 vertexColor;
in vec4 lightMapColor;
in vec4 overlayColor;
in vec2 texCoord0;

out vec4 fragColor;

void main() {
    vec4 sampledColor = texture(Sampler0, texCoord0);
    vec4 color = sampledColor;
#ifdef ALPHA_CUTOUT
    if (color.a < ALPHA_CUTOUT) {
        discard;
    }
#endif

    color *= vertexColor * ColorModulator;
    color.rgb = mix(overlayColor.rgb, color.rgb, overlayColor.a);
    color *= lightMapColor;

    // Emissive textures
    if (shouldApplyEmissives(sampledColor.a)) {
        color = vec4(sampledColor.rgb, 1.0);
    }

    // 50% Opaque Emissive textures
    if (shouldApplyHalfOpaqueEmissives(sampledColor.a)) {
        color = vec4(sampledColor.rgb, 0.5);
    }

    fragColor = apply_fog(color, sphericalVertexDistance, cylindricalVertexDistance, FogEnvironmentalStart, FogEnvironmentalEnd, FogRenderDistanceStart, FogRenderDistanceEnd, FogColor);
}
