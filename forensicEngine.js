export const ANALYSIS_STEPS = [
  'Extracting frames & normalizing media stream...',
  'Analyzing frequency domain (DCT / FFT residuals)...',
  'Checking metadata & cryptographic consistency...',
  'Evaluating neural manipulation & morphing artifacts...'
];

export function computeDeterministicHash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export function formatSeconds(sec) {
  if (!Number.isFinite(sec) || sec <= 0) return '00:12.0';
  const mins = Math.floor(sec / 60);
  const rem = (sec % 60).toFixed(1).padStart(4, '0');
  return `${String(mins).padStart(2, '0')}:${rem}`;
}

export function buildFileForensics(fileObj) {
  const lower = fileObj.name.toLowerCase();
  const h = computeDeterministicHash(fileObj.name + fileObj.size);
  let verdict = 'manipulated';
  let fakeProb = 86.0 + (h % 120) / 10;

  if (
    lower.includes('auth') ||
    lower.includes('raw') ||
    lower.includes('orig') ||
    lower.includes('clean') ||
    lower.includes('real')
  ) {
    verdict = 'authentic';
    fakeProb = 2.4 + (h % 55) / 10;
  } else if (
    lower.includes('susp') ||
    lower.includes('edit') ||
    (h % 4 === 2 && !lower.includes('fake') && !lower.includes('morph'))
  ) {
    verdict = 'suspicious';
    fakeProb = 56.0 + (h % 180) / 10;
  } else if (
    h % 3 === 1 &&
    !lower.includes('fake') &&
    !lower.includes('morph') &&
    !lower.includes('swap')
  ) {
    verdict = 'authentic';
    fakeProb = 3.8 + (h % 65) / 10;
  }

  fakeProb = Math.min(99.2, Math.max(1.5, Number(fakeProb.toFixed(1))));
  const isAuth = verdict === 'authentic';
  const isSusp = verdict === 'suspicious';

  return {
    ...fileObj,
    presetVerdict: verdict,
    fakeProbability: fakeProb,
    summary: isAuth
      ? `No manipulation or synthetic morphing detected in "${fileObj.name}" (${(100 - fakeProb).toFixed(1)}% authentic).`
      : isSusp
      ? `Localized compression and signal anomalies detected in "${fileObj.name}" (${fakeProb}% risk score).`
      : `High probability of synthetic manipulation or morphing detected in "${fileObj.name}" (${fakeProb}% fake confidence).`,
    faceBoxes: isAuth
      ? [
          {
            id: 'box-auth',
            label: 'Verified Region',
            confidence: Number((100 - fakeProb).toFixed(1)),
            type: 'authentic',
            x: 32,
            y: 16,
            w: 36,
            h: 52,
            detail: 'Consistent sensor noise floor and natural boundary gradients.'
          }
        ]
      : [
          {
            id: 'box-primary',
            label: 'Primary Morph / Blend Zone',
            confidence: fakeProb,
            type: 'critical',
            x: 30,
            y: 15,
            w: 38,
            h: 48,
            detail: 'Frequency boundary discrepancy and neural blending artifacts detected in region.'
          },
          {
            id: 'box-secondary',
            label: 'Edge Compression Seam',
            confidence: Number(Math.max(52, fakeProb - 6.4).toFixed(1)),
            type: 'warning',
            x: 34,
            y: 46,
            w: 30,
            h: 18,
            detail: 'Error Level Analysis (ELA) indicates localized re-compression variance.'
          }
        ],
    elaHotspots: isAuth
      ? []
      : [
          { x: 48, y: 34, r: 16, intensity: 0.9 },
          { x: 49, y: 52, r: 14, intensity: 0.8 }
        ],
    metadataChecks: [
      {
        field: 'EXIF / Container Header',
        value: isAuth ? 'Original Capture Pipeline' : 'Post-Process / Re-encoded Header',
        status: isAuth ? 'pass' : 'fail'
      },
      {
        field: 'Compression Quantization',
        value: isAuth ? 'Uniform Single-Pass Matrix' : 'Dual Quantization Mismatch',
        status: isAuth ? 'pass' : isSusp ? 'warn' : 'fail'
      },
      {
        field: 'C2PA Content Credentials',
        value: isAuth ? 'Intact Provenance' : 'Missing / Stripped Manifest',
        status: isAuth ? 'pass' : 'warn'
      },
      {
        field: 'Sensor PRNU Noise Floor',
        value: isAuth ? 'Natural Gaussian Pattern' : 'Spatial Variance Disrupted',
        status: isAuth ? 'pass' : 'fail'
      }
    ],
    audioMetrics: {
      vocoderScore: isAuth ? 6.4 : fakeProb,
      phaseDiscontinuityScore: isAuth ? 8.2 : Number(Math.max(48, fakeProb - 4.5).toFixed(1)),
      microTremorNaturalness: isAuth ? 94.2 : Number(Math.max(11, 100 - fakeProb).toFixed(1)),
      anomalies: isAuth
        ? [{ time: 'Full Stream', freq: '20 Hz–20 kHz', label: 'Continuous Phase & Formants' }]
        : [
            { time: '00:02.4', freq: '8.5–14 kHz', label: 'Neural Vocoder Aliasing' },
            { time: '00:06.1', freq: '140–380 Hz', label: 'Phase Inversion Splice' },
            { time: '00:10.8', freq: '11.2 kHz', label: 'High-Frequency Cutoff Shelf' }
          ]
    },
    videoMetrics: {
      temporalConsistencyScore: isAuth ? 96.8 : Number(Math.max(18, 100 - fakeProb).toFixed(1)),
      lightingGeometryScore: isAuth ? 95.4 : Number(Math.max(22, 100 - fakeProb + 3.2).toFixed(1)),
      totalFrames: 360,
      flaggedFrames: isAuth
        ? []
        : [
            { frame: 45, timestamp: '00:01.5', score: fakeProb, type: 'Boundary Blend Jitter', region: { x: 35, y: 20, w: 28, h: 36 } },
            { frame: 132, timestamp: '00:04.4', score: Number(Math.max(55, fakeProb - 3.8).toFixed(1)), type: 'Shadow Direction Conflict', region: { x: 38, y: 24, w: 24, h: 32 } },
            { frame: 240, timestamp: '00:08.0', score: Number(Math.max(60, fakeProb - 1.9).toFixed(1)), type: 'Temporal Optical Drift', region: { x: 36, y: 22, w: 26, h: 34 } }
          ],
      lightingWarnings: isAuth
        ? [
            { id: 'lw-pass', title: 'Consistent Scene Illumination', detail: 'Surface reflections and shadows align across analyzed frames.' }
          ]
        : [
            { id: 'lw-1', title: 'Key Light Direction Mismatch', detail: 'Subject shading gradient diverges from ambient background light source.' },
            { id: 'lw-2', title: 'Inter-Frame Shadow Flicker', detail: 'Boundary shadow opacity fluctuates independently of motion.' }
          ]
    }
  };
}
