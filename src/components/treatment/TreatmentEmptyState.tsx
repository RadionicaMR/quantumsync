
import React from 'react';

const TreatmentEmptyState = () => {
  return (
    <div className="text-center text-muted-foreground py-12">
      <div className="text-quantum-primary text-5xl mb-4">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
          <path d="M3 12H7L10 20L14 4L17 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <p className="mb-4">Selecciona un preajuste de frecuencia para comenzar el tratamiento</p>
      <p className="text-sm">Nuestros preajustes están diseñados para resultados específicos de bienestar</p>
    </div>
  );
};

export default TreatmentEmptyState;
