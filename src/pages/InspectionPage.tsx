import { useState, useEffect } from 'react';
import { Camera, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import pcbSample1 from '@/assets/pcb-sample-1.png';
import pcbSample2 from '@/assets/pcb-sample-2.png';
import pcbSample3 from '@/assets/pcb-sample-3.png';

interface InspectionResult {
  pcbId: string;
  status: 'PASS' | 'FAIL';
  defectType: string;
  confidence: number;
}

const InspectionPage = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState<InspectionResult[]>([]);
  const [currentPcbIndex, setCurrentPcbIndex] = useState(0);
  const [isInspecting, setIsInspecting] = useState(true);

  const pcbImages = [pcbSample1, pcbSample2, pcbSample3];
  
  const sampleResults: InspectionResult[] = [
    { pcbId: 'PCB-001', status: 'PASS', defectType: 'None', confidence: 98.5 },
    { pcbId: 'PCB-002', status: 'FAIL', defectType: 'Solder Bridge', confidence: 94.2 },
    { pcbId: 'PCB-003', status: 'FAIL', defectType: 'Missing Component', confidence: 96.8 },
    { pcbId: 'PCB-004', status: 'PASS', defectType: 'None', confidence: 99.1 },
    { pcbId: 'PCB-005', status: 'FAIL', defectType: 'Cold Joint', confidence: 87.3 },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      if (results.length < sampleResults.length) {
        const nextResult = sampleResults[results.length];
        setResults(prev => [...prev, nextResult]);
        setCurrentPcbIndex(prev => (prev + 1) % pcbImages.length);
      } else {
        setIsInspecting(false);
        clearInterval(interval);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [results.length]);

  const getStatusClass = (status: string) => {
    return status === 'PASS' ? 'status-pass' : 'status-fail';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="btn-secondary"
          >
            <ArrowLeft className="mr-2" size={20} />
            Back to Upload
          </Button>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground">AOI Inspector</h1>
            <p className="text-lg text-muted-foreground mt-2">
              {isInspecting ? 'Inspection in Progress...' : 'Inspection Complete'}
            </p>
          </div>
          
          <div className="w-32"></div> {/* Spacer for centering */}
        </div>

        {/* Conveyor Belt Section */}
        <div className="industrial-card p-8 mb-8 animate-fade-in-up">
          <h2 className="text-2xl font-semibold mb-6 text-center">Inspection System</h2>
          
          <div className="relative">
            {/* Inspection Camera */}
            <div className="inspection-camera z-10">
              <Camera size={32} className="text-accent" />
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-accent/30 rounded-full"></div>
            </div>
            
            {/* Conveyor Belt */}
            <div className="conveyor-belt h-24 relative rounded-lg">
              {/* PCB Items Moving on Belt */}
              {pcbImages.map((image, index) => (
                <div
                  key={index}
                  className={`pcb-item ${
                    index === currentPcbIndex && results.length > 0
                      ? results[results.length - 1]?.status === 'PASS'
                        ? 'flash-pass'
                        : 'flash-fail'
                      : ''
                  }`}
                  style={{
                    animationDelay: `${index * 2.67}s`,
                    backgroundImage: `url(${image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
              ))}
            </div>
            
            {/* Belt Supports */}
            <div className="flex justify-between mt-4">
              <div className="w-8 h-8 bg-metallic rounded-full"></div>
              <div className="w-8 h-8 bg-metallic rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Results Table */}
        <div className="industrial-card animate-fade-in-up animate-stagger-1">
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Inspection Results</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-4 font-semibold text-foreground">PCB ID</th>
                    <th className="text-left py-4 px-4 font-semibold text-foreground">Status</th>
                    <th className="text-left py-4 px-4 font-semibold text-foreground">Defect Type</th>
                    <th className="text-left py-4 px-4 font-semibold text-foreground">Confidence</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result, index) => (
                    <tr
                      key={result.pcbId}
                      className={`${getStatusClass(result.status)} transition-all duration-500 animate-fade-in-up`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <td className="py-4 px-4 font-medium">{result.pcbId}</td>
                      <td className="py-4 px-4">
                        <span className={`font-semibold ${
                          result.status === 'PASS' ? 'text-success' : 'text-destructive'
                        }`}>
                          {result.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">{result.defectType}</td>
                      <td className="py-4 px-4">{result.confidence}%</td>
                    </tr>
                  ))}
                  
                  {/* Show placeholder rows while inspecting */}
                  {isInspecting && Array.from({ length: sampleResults.length - results.length }).map((_, index) => (
                    <tr key={`pending-${index}`} className="opacity-30">
                      <td className="py-4 px-4">---</td>
                      <td className="py-4 px-4">Inspecting...</td>
                      <td className="py-4 px-4">---</td>
                      <td className="py-4 px-4">---</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {!isInspecting && (
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-success">
                      {results.filter(r => r.status === 'PASS').length}
                    </div>
                    <div className="text-sm text-muted-foreground">Passed</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-destructive">
                      {results.filter(r => r.status === 'FAIL').length}
                    </div>
                    <div className="text-sm text-muted-foreground">Failed</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">{results.length}</div>
                    <div className="text-sm text-muted-foreground">Total</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InspectionPage;