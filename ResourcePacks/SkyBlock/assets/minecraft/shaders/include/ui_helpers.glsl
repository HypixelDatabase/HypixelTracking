// Utility functions for placing UI elements on the screen 

const float PI = 3.1415926535897932384626433832795028841971693993751058209749445923078164062;

#ifndef CORNER_ID
    #ifdef VULKAN
        #define CORNER_ID gl_VertexIndex % 4
    #else
        #ifdef GL_ARB_shader_draw_parameters
            #define CORNER_ID (int(gl_VertexID - gl_BaseVertexARB) % 4)
        #else
            #define CORNER_ID (int(gl_VertexID) % 4)
        #endif
    #endif
#endif

// Shifts the UV and position inwards by 1 pixel to hide the top and bottom row of pixels
#define HIDE_DATA_PIXELS() pos.y -= corner.y; texCoord0.y -= corner.y / atlasSize.y

// Crop the sampled UV inward by one texel to hide the top and bottom data pixel rows
vec2 cropDataRows(vec2 uv, vec2 corner, vec2 atlasSize) {
    uv.y -= corner.y / atlasSize.y;
    return uv;
}

// Shrinks the quad by 1px on the top and bottom.
// Only use for quads that are drawn at their original height, including data pixels
vec3 shrinkToContent(vec3 pos, vec2 corner) {
    pos.y -= corner.y;
    return pos;
}

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
        corners[CORNER_ID]);
}

// Gets the data pixel for this vertex at the specified index. The index increases inward toward the center
vec4 getCornerColor(sampler2D Sampler0, vec2 UV0, int dataIndex) {
    // Read data from the color of this texture corner
    vec2 pixelCoord = UV0 * textureSize(Sampler0, 0);
    vec2 corner = corners[CORNER_ID];
    pixelCoord -= 0.25 * corner;
    pixelCoord.x -= dataIndex * corner.x; // Shift inwards in the X direction to read the intended pixel
    return texelFetch(Sampler0, ivec2(pixelCoord), 0);
}

vec4 getCornerColor(sampler2D Sampler0, vec2 UV0) {
    return getCornerColor(Sampler0, UV0, 0);
}

// === Data-pixel textures ===
// Textures with a row of data pixels on the top and bottom.
// Data pixels are read per-corner in the vertex shader with getCornerColor()
//   index 0 = element / dispatch color ID
//   index 1 = TEXTURE_SIZE: the FULL texel size including the 2 data rows (R = width, G = height)

// Texture config must always write TEXTURE_SIZE at the same index:
const int TEXTURE_SIZE_DATA_PIXEL_INDEX = 1;

struct DataTexture {
    vec2 atlasSize;    // Size of the whole texture atlas, for UV math
    vec2 fullSize;     // Texel size including the 2 data rows (what TEXTURE_SIZE encodes)
    vec2 contentSize;  // Drawable size, with the data rows removed
};

// Reads a texture's baked TEXTURE_SIZE data pixel and derives its content size.
DataTexture readDataTexture(sampler2D sam, vec2 UV0) {
    // TEXTURE_SIZE is stored as (size - 1) so the full 1-256 range fits in a 0-255 channel
    vec2 storedSize = getCornerColor(sam, UV0, TEXTURE_SIZE_DATA_PIXEL_INDEX).rg * 255.0;

    DataTexture tex;
    tex.atlasSize = vec2(textureSize(sam, 0));
    tex.fullSize = storedSize + vec2(1.0);
    tex.contentSize = tex.fullSize - vec2(0.0, 2.0);
    return tex;
}