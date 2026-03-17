import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '@/components/Layout';
import HeroSection from '@/components/HeroSection';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CustomTreatment from '@/components/treatment/CustomTreatment';
import CallToAction from '@/components/treatment/CallToAction';
import PresetTreatment from '@/components/treatment/preset/PresetTreatment';
import { treatmentPresets } from '@/data/treatmentPresets';
import { useTreatment } from '@/hooks/useTreatment';
import { toast } from '@/hooks/use-toast';
import AudioUploader from '@/components/AudioUploader';
import ManifestationBoxAdapter from '@/components/manifest/ManifestationBoxAdapter';
import { SessionRecordDialog } from '@/components/session/SessionRecordDialog';
import { useSessionRecording } from '@/hooks/useSessionRecording';
import { useSession } from '@/context/SessionContext';
import { useLanguage } from '@/context/LanguageContext';

const Manifestation = () => {
  const treatment = useTreatment();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("presets");
  const [diagnosisImported, setDiagnosisImported] = useState(false);
  const { recordSession } = useSessionRecording();
  const { currentPatientId, setCurrentPatientId } = useSession();
  const [showSessionDialog, setShowSessionDialog] = useState(false);
  const [pendingStart, setPendingStart] = useState(false);
  const { t } = useLanguage();
  
  // Check if we're coming from diagnosis page or repeating a session
  useEffect(() => {
    if (location.state?.fromDiagnosis && !diagnosisImported) {
      const { personName, diagnosisArea, diagnosisResult } = location.state;
      
      if (personName) {
        treatment.setReceptorName(personName);
        
        toast({
          title: t('treat.diagnosisImported'),
          description: `${t('treat.importingFrom')} ${diagnosisArea} ${t('common.for')} ${personName}`,
        });
        
        setDiagnosisImported(true);
      }
    }

    // Handle session repeat
    if (location.state?.repeatSession && location.state?.sessionData) {
      const { sessionData } = location.state;
      
      if (sessionData.preset) {
        const preset = treatmentPresets.find(p => p.id === sessionData.preset || p.name === sessionData.preset);
        if (preset) {
          treatment.selectPreset(preset);
        }
      }
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
      if (sessionData.rate1 !== undefined) treatment.setRate1(sessionData.rate1);
      if (sessionData.rate2 !== undefined) treatment.setRate2(sessionData.rate2);
      if (sessionData.rate3 !== undefined) treatment.setRate3(sessionData.rate3);
      if (sessionData.radionicImage) treatment.setRadionicImage(sessionData.radionicImage);
      if (sessionData.receptorImage) treatment.setReceptorImage(sessionData.receptorImage);
      if (sessionData.radionicImages?.length) treatment.setRadionicImages(sessionData.radionicImages);
      if (sessionData.receptorImages?.length) treatment.setReceptorImages(sessionData.receptorImages);
      if (sessionData.intention) {
        treatment.setIntention(sessionData.intention);
      }
      if (sessionData.hypnoticSpeed !== undefined) {
        treatment.setHypnoticSpeed([sessionData.hypnoticSpeed]);
      }
    }
  }, [location.state]);

  // Keep a ref with the latest session data to avoid stale closures
  const sessionDataRef = React.useRef<any>(null);
  useEffect(() => {
    let presetName = '';
    if (treatment.selectedPreset) {
      presetName = typeof treatment.selectedPreset === 'object' 
        ? (treatment.selectedPreset as any).name || ''
        : String(treatment.selectedPreset);
    }
    sessionDataRef.current = {
      preset: presetName,
      intention: treatment.intention,
      duration: treatment.duration,
      frequency: treatment.frequency,
      rate1: treatment.rate1,
      rate2: treatment.rate2,
      rate3: treatment.rate3,
      receptorName: treatment.receptorName,
      radionicImage: treatment.radionicImage,
      receptorImage: treatment.receptorImage,
      radionicImages: treatment.radionicImages,
      receptorImages: treatment.receptorImages,
      visualFeedback: treatment.visualFeedback,
      hypnoticSpeed: treatment.hypnoticSpeed,
    };
  });

  // Handle session recording when manifestation stops
  const prevPlayingRef = React.useRef(false);
  useEffect(() => {
    if (prevPlayingRef.current && !treatment.isPlaying && currentPatientId) {
      recordSession(currentPatientId, 'manifestation', sessionDataRef.current);
      setCurrentPatientId(null);
    }
    prevPlayingRef.current = treatment.isPlaying;
  }, [treatment.isPlaying, currentPatientId]);

  const handleStartClick = () => {
    treatment.startTreatment();
    setShowSessionDialog(true);
  };

  const handleSessionConfirm = (patientId: string | null) => {
    setCurrentPatientId(patientId);
  };
  
  // Normalize currentImage value to ensure compatibility
  const normalizeCurrentImage = (image: 'radionic' | 'receptor' | 'mix' | 'pattern'): 'radionic' | 'receptor' | 'mix' => {
    return image === 'pattern' ? 'radionic' : image;
  };
  
  console.log("Manifestation page - Current intention:", treatment.intention);
  
  return (
    <Layout>
      <HeroSection
        title={t('manifest.title')}
        subtitle={t('manifest.subtitle')}
      />

      {/* Main section with manifestation box prominently displayed */}
      <section className="py-4 px-4">
        <div className="container mx-auto">
          <ManifestationBoxAdapter 
            intention={treatment.intention || ""}
            setIntention={(val) => {
              console.log("Manifestation page - Setting intention:", val);
              if (typeof treatment.setIntention === 'function') {
                treatment.setIntention(val);
              }
            }}
            isActive={treatment.isPlaying}
          />
        </div>
      </section>

      <section className="py-6 px-4">
        <div className="container mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="presets" className="flex flex-col">
                <span>{t('manifest.presetsTab')}</span>
                <span>{t('manifest.presetsTabSub')}</span>
              </TabsTrigger>
              <TabsTrigger value="custom" className="flex flex-col">
                <span>{t('manifest.customTab')}</span>
                <span>{t('manifest.customTabSub')}</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="presets" className="w-full">
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
                rate4={treatment.rate4}
                setRate4={treatment.setRate4}
                rate5={treatment.rate5}
                setRate5={treatment.setRate5}
                rate6={treatment.rate6}
                setRate6={treatment.setRate6}
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
                intention={treatment.intention}
                audioLoop={treatment.audioLoop}
                setAudioLoop={treatment.setAudioLoop}
                clearAudio={treatment.clearAudio}
              />
            </TabsContent>
            
            <TabsContent value="custom" className="w-full">
              <Card className="quantum-card p-6">
                <div className="">
                  <h3 className="text-xl font-semibold mb-4">{t('manifest.customTitle')}</h3>
                  <p className="text-muted-foreground mb-8">
                    {t('manifest.customDesc')}
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
                    rate4={treatment.rate4}
                    setRate4={treatment.setRate4}
                    rate5={treatment.rate5}
                    setRate5={treatment.setRate5}
                    rate6={treatment.rate6}
                    setRate6={treatment.setRate6}
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
                    intention={treatment.intention} // Make sure intention is passed
                  />
                </div>
              </Card>
            </TabsContent>
          </Tabs>

          <SessionRecordDialog
            open={showSessionDialog}
            onOpenChange={setShowSessionDialog}
            onConfirm={handleSessionConfirm}
            sessionType="manifestation"
          />
        </div>
      </section>

      <CallToAction />
    </Layout>
  );
};

export default Manifestation;
