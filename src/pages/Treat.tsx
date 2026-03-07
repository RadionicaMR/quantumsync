import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '@/components/Layout';
import HeroSection from '@/components/HeroSection';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CustomTreatment from '@/components/treatment/CustomTreatment';
import HowItWorks from '@/components/treatment/HowItWorks';
import CallToAction from '@/components/treatment/CallToAction';
import PresetTreatment from '@/components/treatment/preset/PresetTreatment';
import { treatmentPresets } from '@/data/treatmentPresets';
import { useTreatment } from '@/hooks/useTreatment';
import { toast } from '@/hooks/use-toast';
import AudioUploader from '@/components/AudioUploader';
import { SessionRecordDialog } from '@/components/session/SessionRecordDialog';
import { useSessionRecording } from '@/hooks/useSessionRecording';
import { useSession } from '@/context/SessionContext';
import { useLanguage } from '@/context/LanguageContext';

const Treat = () => {
  const treatment = useTreatment();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("presets");
  const [diagnosisImported, setDiagnosisImported] = useState(false);
  const { recordSession } = useSessionRecording();
  const { currentPatientId, setCurrentPatientId } = useSession();
  const [showSessionDialog, setShowSessionDialog] = useState(false);
  
  const { t } = useLanguage();
  
  // Check if we're coming from diagnosis page or repeating a session
  useEffect(() => {
    // Handle diagnosis import
    if (location.state?.fromDiagnosis && !diagnosisImported) {
      const { personName, diagnosisArea, diagnosisResult } = location.state;
      
      // Set the receptor name from the diagnosis
      if (personName) {
        treatment.setReceptorName(personName);
        
        toast({
          title: t('treat.diagnosisImported'),
          description: `${t('treat.importingFrom')} ${diagnosisArea} ${t('common.for')} ${personName}`,
        });
        
        // Mark as imported to prevent showing the toast again
        setDiagnosisImported(true);
      }
    }

    // Handle session repeat
    if (location.state?.repeatSession && location.state?.sessionData) {
      const { sessionData } = location.state;
      
      if (sessionData.receptorName) {
        treatment.setReceptorName(sessionData.receptorName);
      }
      if (sessionData.frequency !== undefined) {
        const freq = Array.isArray(sessionData.frequency) ? sessionData.frequency : [sessionData.frequency];
        treatment.setFrequency(freq);
      }
      if (sessionData.duration !== undefined) {
        const dur = Array.isArray(sessionData.duration) ? sessionData.duration : [sessionData.duration];
        treatment.setDuration(dur);
      }
      // Handle rates (saved as individual fields or as array)
      if (sessionData.rate1 !== undefined || sessionData.rate2 !== undefined || sessionData.rate3 !== undefined) {
        treatment.setRate1(sessionData.rate1 || '');
        treatment.setRate2(sessionData.rate2 || '');
        treatment.setRate3(sessionData.rate3 || '');
      } else if (sessionData.rates) {
        // Legacy format: rates as array or object
        if (Array.isArray(sessionData.rates)) {
          treatment.setRate1(sessionData.rates[0] || '');
          treatment.setRate2(sessionData.rates[1] || '');
          treatment.setRate3(sessionData.rates[2] || '');
        } else {
          treatment.setRate1(sessionData.rates.rate1 || '');
          treatment.setRate2(sessionData.rates.rate2 || '');
          treatment.setRate3(sessionData.rates.rate3 || '');
        }
      }
      // Restore images
      if (sessionData.radionicImage) {
        treatment.setRadionicImage(sessionData.radionicImage);
      }
      if (sessionData.receptorImage) {
        treatment.setReceptorImage(sessionData.receptorImage);
      }
      if (sessionData.radionicImages?.length) {
        treatment.setRadionicImages(sessionData.radionicImages);
      }
      if (sessionData.receptorImages?.length) {
        treatment.setReceptorImages(sessionData.receptorImages);
      }
      if (sessionData.intention) {
        treatment.setIntention(sessionData.intention);
      }
      if (sessionData.hypnoticSpeed !== undefined) {
        treatment.setHypnoticSpeed([sessionData.hypnoticSpeed]);
      }
      
      // Select preset if available
      if (sessionData.preset) {
        const preset = treatmentPresets.find(p => p.id === sessionData.preset || p.name === sessionData.preset);
        if (preset) {
          treatment.selectPreset(preset);
        }
      }
    }
  }, [location.state]);

  // Handle session recording when treatment stops (manually or by timer)
  const prevPlayingRef = useRef(false);
  useEffect(() => {
    // Detect transition from playing to not playing
    if (prevPlayingRef.current && !treatment.isPlaying && currentPatientId) {
      let presetName = '';
      if (treatment.selectedPreset) {
        presetName = typeof treatment.selectedPreset === 'object' 
          ? (treatment.selectedPreset as any).name || ''
          : String(treatment.selectedPreset);
      }
      const sessionData = {
        preset: presetName,
        frequency: treatment.frequency,
        duration: treatment.duration,
        rate1: treatment.rate1,
        rate2: treatment.rate2,
        rate3: treatment.rate3,
        receptorName: treatment.receptorName,
        intention: treatment.intention,
        radionicImage: treatment.radionicImage,
        receptorImage: treatment.receptorImage,
        radionicImages: treatment.radionicImages,
        receptorImages: treatment.receptorImages,
        visualFeedback: treatment.visualFeedback,
        hypnoticSpeed: treatment.hypnoticSpeed,
      };
      recordSession(currentPatientId, 'treatment', sessionData);
      setCurrentPatientId(null);
    }
    prevPlayingRef.current = treatment.isPlaying;
  }, [treatment.isPlaying, currentPatientId]);

  // CRITICAL: Start treatment FIRST (synchronously in user gesture for Safari AudioContext),
  // then optionally show session recording dialog
  const handleStartClick = () => {
    // Start treatment immediately - AudioContext must be created in user gesture for Safari
    treatment.startTreatment();
    // Then show session recording dialog (non-blocking)
    setShowSessionDialog(true);
  };

  const handleSessionConfirm = (patientId: string | null) => {
    setCurrentPatientId(patientId);
  };
  
  // Normalize currentImage value to ensure compatibility
  const normalizeCurrentImage = (image: 'radionic' | 'receptor' | 'mix' | 'pattern'): 'radionic' | 'receptor' | 'mix' => {
    return image === 'pattern' ? 'radionic' : image;
  };
  
  return (
    <Layout>
      <HeroSection
        title={t('treat.title')}
        subtitle={t('treat.subtitle')}
      />

      <HowItWorks />

      <section className="py-12 px-4">
        <div className="container mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="presets" className="flex flex-col">
                <span>{t('treat.presetsTab')}</span>
                <span>{t('treat.presetsTabSub')}</span>
              </TabsTrigger>
              <TabsTrigger value="custom" className="flex flex-col">
                <span>{t('treat.customTab')}</span>
                <span>{t('treat.customTabSub')}</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="presets" className="w-full">
              {/* Puedes poner el Uploader también aquí si el usuario lo desea en ambas pestañas */}
              <PresetTreatment
                presets={treatmentPresets}
                selectedPreset={treatment.selectedPreset}
                isPlaying={treatment.isPlaying}
                frequency={treatment.frequency}
                setFrequency={treatment.setFrequency}
                duration={treatment.duration}
                setDuration={treatment.setDuration}
                intensity={treatment.intensity}
                setIntensity={treatment.setIntensity}
                useHeadphones={treatment.useHeadphones}
                setUseHeadphones={treatment.setUseHeadphones}
                visualFeedback={treatment.visualFeedback}
                setVisualFeedback={treatment.setVisualFeedback}
                timeRemaining={treatment.timeRemaining}
                formatTime={treatment.formatTime}
                onSelectPreset={treatment.selectPreset}
                startTreatment={handleStartClick}
                stopTreatment={treatment.stopTreatment}
                radionicImage={treatment.radionicImage}
                setRadionicImage={treatment.setRadionicImage}
                receptorImage={treatment.receptorImage}
                setReceptorImage={treatment.setReceptorImage}
                radionicImages={treatment.radionicImages}
                setRadionicImages={treatment.setRadionicImages}
                receptorImages={treatment.receptorImages}
                setReceptorImages={treatment.setReceptorImages}
                currentImage={normalizeCurrentImage(treatment.currentImage)}
                hypnoticEffect={treatment.hypnoticEffect}
                rate1={treatment.rate1}
                setRate1={treatment.setRate1}
                rate2={treatment.rate2}
                setRate2={treatment.setRate2}
                rate3={treatment.rate3}
                setRate3={treatment.setRate3}
                hypnoticSpeed={treatment.hypnoticSpeed}
                setHypnoticSpeed={treatment.setHypnoticSpeed}
                receptorName={treatment.receptorName}
                setReceptorName={treatment.setReceptorName}
                audioFile={treatment.audioFile}
                setAudioFile={treatment.setAudioFile}
                audioVolume={treatment.audioVolume}
                setAudioVolume={treatment.setAudioVolume}
                audioSubliminalPlaying={treatment.audioSubliminalPlaying}
                playSubliminalAudio={treatment.playSubliminalAudio}
                stopSubliminalAudio={treatment.stopSubliminalAudio}
                backgroundModeActive={treatment.backgroundModeActive}
                audioLoop={treatment.audioLoop}
                setAudioLoop={treatment.setAudioLoop}
                clearAudio={treatment.clearAudio}
              />
            </TabsContent>
            
            <TabsContent value="custom" className="w-full">
              <Card className="quantum-card p-6">
                <div className="">
                  <h3 className="text-xl font-semibold mb-4">{t('treat.customTitle')}</h3>
                  <p className="text-muted-foreground mb-8">
                    {t('treat.customDesc')}
                  </p>
                  
                  <CustomTreatment
                    frequency={treatment.frequency}
                    setFrequency={treatment.setFrequency}
                    duration={treatment.duration}
                    setDuration={treatment.setDuration}
                    intensity={treatment.intensity}
                    setIntensity={treatment.setIntensity}
                    rate1={treatment.rate1}
                    setRate1={treatment.setRate1}
                    rate2={treatment.rate2}
                    setRate2={treatment.setRate2}
                    rate3={treatment.rate3}
                    setRate3={treatment.setRate3}
                    radionicImage={treatment.radionicImage}
                    setRadionicImage={treatment.setRadionicImage}
                    radionicImages={treatment.radionicImages}
                    setRadionicImages={treatment.setRadionicImages}
                    receptorImage={treatment.receptorImage}
                    setReceptorImage={treatment.setReceptorImage}
                    receptorImages={treatment.receptorImages}
                    setReceptorImages={treatment.setReceptorImages}
                    hypnoticSpeed={treatment.hypnoticSpeed}
                    setHypnoticSpeed={treatment.setHypnoticSpeed}
                    useHeadphones={treatment.useHeadphones}
                    setUseHeadphones={treatment.setUseHeadphones}
                    visualFeedback={treatment.visualFeedback}
                    setVisualFeedback={treatment.setVisualFeedback}
                    isPlaying={treatment.isPlaying}
                    timeRemaining={treatment.timeRemaining}
                    formatTime={treatment.formatTime}
                    currentImage={normalizeCurrentImage(treatment.currentImage)}
                    hypnoticEffect={treatment.hypnoticEffect}
                  startTreatment={handleStartClick}
                  stopTreatment={treatment.stopTreatment}
                    receptorName={treatment.receptorName}
                    setReceptorName={treatment.setReceptorName}
                    audioFile={treatment.audioFile}
                    setAudioFile={treatment.setAudioFile}
                    audioVolume={treatment.audioVolume}
                    setAudioVolume={treatment.setAudioVolume}
                    audioSubliminalPlaying={treatment.audioSubliminalPlaying}
                    playSubliminalAudio={treatment.playSubliminalAudio}
                    stopSubliminalAudio={treatment.stopSubliminalAudio}
                    audioLoop={treatment.audioLoop}
                    setAudioLoop={treatment.setAudioLoop}
                    clearAudio={treatment.clearAudio}
                    backgroundModeActive={treatment.backgroundModeActive}
                  />
                </div>
              </Card>
            </TabsContent>
          </Tabs>

          <SessionRecordDialog
            open={showSessionDialog}
            onOpenChange={setShowSessionDialog}
            onConfirm={handleSessionConfirm}
            sessionType="treatment"
          />
        </div>
      </section>

      <CallToAction />
    </Layout>
  );
};

export default Treat;
