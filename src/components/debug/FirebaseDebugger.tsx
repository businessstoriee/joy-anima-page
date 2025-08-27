import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFirebaseGreetings } from '@/hooks/useFirebaseGreetings';
import { GreetingFormData } from '@/types/greeting';
import { Code, Database, Eye } from 'lucide-react';

interface FirebaseDebuggerProps {
  greetingData: GreetingFormData;
  onTest?: (result: any) => void;
}

const FirebaseDebugger: React.FC<FirebaseDebuggerProps> = ({ 
  greetingData, 
  onTest 
}) => {
  const [testResults, setTestResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { saveGreeting, loadGreeting } = useFirebaseGreetings();

  const testSaveFlow = async () => {
    setIsLoading(true);
    console.log('🧪 Firebase Test: Starting save flow test');
    console.log('📊 Input Data:', JSON.stringify(greetingData, null, 2));

    try {
      // Step 1: Save to Firebase
      const title = `Test - ${Date.now()}`;
      const slug = await saveGreeting(greetingData, title);
      
      console.log('✅ Save Result - Slug:', slug);

      if (slug) {
        // Step 2: Load from Firebase
        console.log('🔍 Testing load with slug:', slug);
        const loadedData = await loadGreeting(slug);
        
        console.log('📥 Loaded Data:', JSON.stringify(loadedData, null, 2));

        const results = {
          saveSuccess: true,
          slug: slug,
          loadSuccess: !!loadedData,
          loadedData: loadedData,
          originalData: greetingData,
          timestamp: new Date().toISOString()
        };

        setTestResults(results);
        if (onTest) onTest(results);

        console.log('🎯 Full Test Results:', results);
      } else {
        throw new Error('No slug returned from save operation');
      }
    } catch (error) {
      console.error('❌ Firebase Test Failed:', error);
      const errorResults = {
        saveSuccess: false,
        error: error.message,
        originalData: greetingData,
        timestamp: new Date().toISOString()
      };
      
      setTestResults(errorResults);
      if (onTest) onTest(errorResults);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Firebase Debug Panel
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button
            onClick={testSaveFlow}
            disabled={isLoading || !greetingData.eventType}
            className="gap-2"
          >
            {isLoading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
            Test Firebase Flow
          </Button>
          
          <Button
            variant="outline"
            onClick={() => console.log('Current Form Data:', greetingData)}
          >
            <Code className="h-4 w-4 mr-2" />
            Log Current Data
          </Button>
        </div>

        {testResults && (
          <Card className="bg-muted/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs overflow-auto max-h-96 bg-background p-3 rounded border">
                {JSON.stringify(testResults, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}

        <div className="text-xs text-muted-foreground space-y-1">
          <p><strong>Required for Firebase:</strong></p>
          <p>• Event Type: {greetingData.eventType ? '✅' : '❌'}</p>
          <p>• Sender/Receiver Name: {(greetingData.senderName || greetingData.receiverName) ? '✅' : '❌'}</p>
          <p>• Texts: {greetingData.texts?.length || 0} items</p>
          <p>• Media: {greetingData.media?.length || 0} items</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FirebaseDebugger;