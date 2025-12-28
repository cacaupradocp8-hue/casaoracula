export interface Case {
  id: string;
  userId: string;
  codename: string;
  centralTheme: string;
  tags: string[];
  briefHistory: string;
  createdAt: Date;
  updatedAt: Date;
  sessions: Session[];
}

export interface Session {
  id: string;
  caseId: string;
  date: Date;
  notes: string;
  symbolicReading?: SymbolicReading;
  axisRadar?: AxisRadar;
  neuroplasticityTrail?: NeuroplasticityTrail;
  symbolicAttachments: string[];
}

export interface SymbolicReading {
  id: string;
  layer1_symptom: string;
  layer2_ego: string;
  layer3_projection: string;
  layer4_archetype: string;
  layer5_crossing: string;
  createdAt: Date;
}

export interface AxisRadar {
  id: string;
  realityOrientation: number;
  psychicFlexibility: number;
  emotionalRegulation: number;
  decisionCapacity: number;
  beingContinuity: number;
  boundariesLimits: number;
  observableEvidence: string;
  clinicalNotes: string;
  createdAt: Date;
}

export interface NeuroplasticityTrail {
  id: string;
  trigger: string;
  currentAutoResponse: string;
  desiredNewResponse: string;
  dailyMicroAction: string;
  frequency: string;
  probableBarriers: string;
  planB: string;
  consistencyCheckins: string[];
  createdAt: Date;
}

export interface CaseMap {
  caseId: string;
  synthesis: string;
  fiveLayers: SymbolicReading;
  axisRadar: AxisRadar;
  neuroplasticityTrail: NeuroplasticityTrail;
  supportSymbol: string;
  nextSessionScript: string;
}
