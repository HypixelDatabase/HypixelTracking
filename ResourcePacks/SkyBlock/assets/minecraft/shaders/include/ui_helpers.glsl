// Utility functions for placing UI elements on the screen 

#define PI 3.1415926535897932384626433832795028841971693993751058209749445923078164062

const vec2[] corners = vec2[](
    vec2(-1, -1),
    vec2(-1, 1),
    vec2(1, 1),
    vec2(1, -1) 
);

const vec2[] corners0to1 = vec2[](
    vec2(0, 0),
    vec2(0, 1),
    vec2(1, 1),
    vec2(1, 0) 
);

vec2 getGUISize(mat4 ProjMat) {
    return ceil(vec2(2.0 / ProjMat[0][0], 2.0 / abs(ProjMat[1][1])) - vec2(0.0001));
}

vec2 calculateUIPlacement(
    vec2 origin, // Origin on the screen in clip space (-1, -1 to 1, 1)
    vec2 anchor, // The position inside the rect that it scales from in UV space (-1, -1 to 1, 1)
    vec2 size, // Size of the element in pixels before GUI scaling
    vec2 guiSize, // Size of the GUI in pixels
    vec2 corner)
{
    vec2 originNDC = (origin + vec2(1.0)) * 0.5; // Convert to NDC space (0, 0 to 1, 1)

    // Get this corner in the new alignment
    vec2 cornerAligned = (corner - anchor) * 0.5;

    // Convert the origin to world space
    vec2 originWorld = floor(guiSize * originNDC); // Matches in-game calculation
    
    return originWorld + (cornerAligned * size);
}

vec2 calculateUIPlacement(
    vec2 origin, // Origin on the screen in clip space (-1, -1 to 1, 1)
    vec2 anchor, // The position inside the rect that it scales from in UV space (-1, -1 to 1, 1)
    vec2 size, // Size of the element in pixels before GUI scaling
    vec2 guiSize) // Size of the GUI in pixels
{
    return calculateUIPlacement(
        origin, 
        anchor, 
        size, 
        guiSize, 
        corners[gl_VertexID % 4]);
}

vec4 getCornerColor(sampler2D Sampler0, vec2 UV0) {
    
    // Read data from the color of this texture corner
    vec2 pixelCoord = UV0 * textureSize(Sampler0, 0);
    pixelCoord -= 0.25 * corners[gl_VertexID % 4];
    return texelFetch(Sampler0, ivec2(pixelCoord), 0);
}