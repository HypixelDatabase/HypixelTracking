bool shouldApplyEmissives(float sampledColorA) {
    return int(sampledColorA * 255) == 252;
}

bool shouldApplyHalfOpaqueEmissives(float sampledColorA) {
    return int(sampledColorA * 255) == 127;
}