# Trust Score Algorithm

## Computation Matrix
The platform calculates trust dynamically on a 0-100 spectrum. All users start with a base 100.

### Infractions
- **No Face / Multiple Faces:** -50 (Status: Rejected)
- **High AI Generation Probability (Confidence > 85%):** -40 (Status: Manual Review)
- **NSFW Content Detected:** -100 (Status: Rejected)
- **Violence Detected:** -100 (Status: Rejected)
- **Watermark Present:** -20
- **Low Resolution / High Blur (Poor Lighting):** -20
- **Duplication (Perceptual Hash match):** -80 (Status: Rejected)

The computed state maps securely back to the User Profile, adjusting their overarching algorithm visibility matching engines inside Phase 5.
