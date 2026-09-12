import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      appTitle: "JalRakshak",
      appTitleRegional: "(जलरक्षक)",
      appSubtitle: "Smart Purification & Quality Monitoring for Jharkhand Mining Areas",
      govBrand: "Dept of Technical Education | Govt of Jharkhand",
      
      // Header Navigation Tabs
      tabTelemetry: "Telemetry Dashboard",
      tabSchematic: "Purification Schematic",
      tabGisMap: "Jharkhand GIS Map",
      tabHealth: "Filter & Solar Health",
      tabReports: "Compliance Reports",
      iotOnline: "IoT STREAM ONLINE",

      // Ticker Metadata
      activeUnitLabel: "Active Unit:",
      activeUnitVal: "JH-01 (Dhanbad Jharia Site)",
      purifiedLabel: "Total Purified:",
      purifiedVal: "4,280 L",
      beneficiariesLabel: "Beneficiaries Served:",
      beneficiariesVal: "1,850 Villagers",
      solarInputLabel: "Solar Input:",
      solarInputVal: "234 W",

      statusSafe: "WATER SAFE",
      statusWatch: "QUALITY WATCH",
      statusUnsafe: "UNSAFE WATER DETECTED",

      phLabel: "pH Level",
      phLimit: "BIS Limit: 6.5 - 8.5",
      phUnit: "pH",

      turbidityLabel: "Turbidity",
      turbidityLimit: "BIS Limit: ≤ 1.0 NTU",
      turbidityUnit: "NTU",

      tdsLabel: "Total Dissolved Solids",
      tdsLimit: "BIS Limit: ≤ 500 mg/L",
      tdsUnit: "ppm",

      tempLabel: "Water Temp",
      tempLimit: "Normal: 15°C - 35°C",
      tempUnit: "°C",

      pipelineTitle: "Adaptive Purification Pipeline Visualizer",
      pipelineSub: "PPT Architecture Compliance: Skipped when water is safe to conserve energy & filter lifespan",
      stageIntake: "Raw Water Intake",
      stageFiltration: "Sediment & Carbon",
      stageSensor: "BIS Sensor Check",
      stageUvc: "UV-C Disinfection",
      stageOutput: "Safe Water Output",

      mlTitle: "ML Regional Contaminant Risk Classifier",
      mlSub: "Scikit-Learn Random Forest Model trained on CGWB Jharkhand Mining Belt Profiles",
      mlRiskClass: "Predicted Risk Category",
      mlConfidence: "Inference Confidence",
      mlExplanation: "Groundwater Context Analysis",
      mlAction: "Recommended Field Action",

      alertsTitle: "Emergency Alerts & Community Dispatch Log",
      alertsSub: "Simulated SMS / IVR Broadcast dispatched to local Jal Sahiya Health Worker",
      noAlerts: "No active emergency alerts recorded. Water stream nominal.",

      jharkhandTitle: "Jharkhand Mining Belt Groundwater GIS Context",
      jharkhandSub: "Target contamination breakdown across Dhanbad, Bokaro, Chaibasa & Singhbhum mineral zones",

      historyTitle: "Historical Sensor Telemetry Log",
      historySub: "BIS 10500 compliant telemetry archive",
      exportCsv: "Export CSV Data",

      demoPanelTitle: "Judge Demo Control Panel",
      demoPanelSub: "Inject real-time manual sensor parameters & test system alert response",
      pushManual: "Push Manual Telemetry",
      simAmd: "Simulate Acid Mine Drainage (Dhanbad)",
      simTurb: "Simulate Monsoon Runoff Spike",
      simFluoride: "Simulate Fluoride Leaching (Palamu)",
      resetSim: "Restore Baseline Safe Water"
    }
  },
  hi: {
    translation: {
      appTitle: "जलरक्षक",
      appTitleRegional: "(JalRakshak)",
      appSubtitle: "झारखंड खनन क्षेत्रों के लिए स्मार्ट जल शोधन एवं गुणवत्ता निगरानी",
      govBrand: "तकनीकी शिक्षा विभाग | झारखंड सरकार",
      
      // Header Navigation Tabs
      tabTelemetry: "टेलीमीटरी डैशबोर्ड",
      tabSchematic: "शोधन आरेख (Schematic)",
      tabGisMap: "झारखंड GIS मानचित्र",
      tabHealth: "फिल्टर एवं सोलर स्वास्थ्य",
      tabReports: "अनुपालन रिपोर्ट",
      iotOnline: "IoT स्ट्रीम ऑनलाइन",

      // Ticker Metadata
      activeUnitLabel: "सक्रिय इकाई:",
      activeUnitVal: "JH-01 (धनबाद झरिया केंद्र)",
      purifiedLabel: "कुल शोधित जल:",
      purifiedVal: "4,280 लीटर",
      beneficiariesLabel: "लाभान्वित ग्रामीण:",
      beneficiariesVal: "1,850 ग्रामीण",
      solarInputLabel: "सोलर इनपुट:",
      solarInputVal: "234 वाट",

      statusSafe: "जल सुरक्षित है",
      statusWatch: "गुणवत्ता निगरानी आवश्यक",
      statusUnsafe: "अस्वच्छ जल दर्ज",

      phLabel: "pH स्तर",
      phLimit: "BIS सीमा: 6.5 - 8.5",
      phUnit: "pH",

      turbidityLabel: "गंदलापन (Turbidity)",
      turbidityLimit: "BIS सीमा: ≤ 1.0 NTU",
      turbidityUnit: "NTU",

      tdsLabel: "कुल घुले ठोस पदार्थ (TDS)",
      tdsLimit: "BIS सीमा: ≤ 500 mg/L",
      tdsUnit: "ppm",

      tempLabel: "जल का तापमान",
      tempLimit: "सामान्य: 15°C - 35°C",
      tempUnit: "°C",

      pipelineTitle: "अनुकूलित जल शोधन आरेख",
      pipelineSub: "ऊर्जा और फिल्टर की बचत के लिए जल सुरक्षित होने पर शोधन स्वतः बायपास होता है",
      stageIntake: "कच्चा जल प्रवेश",
      stageFiltration: "तलछट एवं कार्बन फिल्टर",
      stageSensor: "BIS सेंसर जांच",
      stageUvc: "UV-C रोगाणुनाशन",
      stageOutput: "सुरक्षित जल निकास",

      mlTitle: "एमएल क्षेत्रीय संदूषण जोखिम वर्गीकरण",
      mlSub: "झारखंड खनन क्षेत्रों के डेटा पर प्रशिक्षित रैंडम फॉरेस्ट मॉडल",
      mlRiskClass: "अनुमानित जोखिम श्रेणी",
      mlConfidence: "मॉडल सटीकता / विश्वास",
      mlExplanation: "भूजल संदर्भ विश्लेषण",
      mlAction: "अनुशंसित कार्रवाई",

      alertsTitle: "आपातकालीन चेतावनी एवं जल सहिया संदेश लॉग",
      alertsSub: "स्थानीय जल सहिया को भेजा गया एसएमएस/आईवीआर संदेश लॉग",
      noAlerts: "कोई आपातकालीन चेतावनी नहीं। जल प्रवाह सामान्य है।",

      jharkhandTitle: "झारखंड खनन क्षेत्र भूजल मानचित्र",
      jharkhandSub: "धनबाद, बोकारो, चाईबासा और सिंहभूम खनन क्षेत्रों का विश्लेषण",

      historyTitle: "ऐतिहासिक सेंसर टेलीमीटरी लॉग",
      historySub: "BIS 10500 मानक अभिलेख",
      exportCsv: "डेटा CSV डाउनलोड करें",

      demoPanelTitle: "लाइव जज डेमो कंट्रोल पैनल",
      demoPanelSub: "मैनुअल सेंसर वैल्यू बदलकर लाइव चेतावनी का परीक्षण करें",
      pushManual: "मैनुअल डेटा भेजें",
      simAmd: "ऐसिड माइन ड्रेनेज सिम्युलेट करें (धनबाद)",
      simTurb: "मानसून जलभराव सिम्युलेट करें",
      simFluoride: "फ्लोराइड रिसाव सिम्युलेट करें (पलामू)",
      resetSim: "सामान्य सुरक्षित जल पुनर्स्थापित करें"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
