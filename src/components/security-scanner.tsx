'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle,
  Info,
  XCircle
} from 'lucide-react';
import type { SecurityScanResult, SecurityVulnerability } from '@/app/api/scan-security/route';

interface SecurityScannerProps {
  result: SecurityScanResult;
}

export function SecurityScanner({ result }: SecurityScannerProps) {
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="h-4 w-4" />;
      case 'high':
        return <ShieldAlert className="h-4 w-4" />;
      case 'medium':
        return <AlertTriangle className="h-4 w-4" />;
      case 'low':
        return <Info className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'high':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'low':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreBarColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              {result.safe ? (
                <ShieldCheck className="h-5 w-5 text-green-400" />
              ) : (
                <ShieldAlert className="h-5 w-5 text-red-400" />
              )}
              Security Scan Results
            </CardTitle>
            <CardDescription>
              {result.safe ? 'No critical vulnerabilities found' : `Found ${result.totalIssues} security issues`}
            </CardDescription>
          </div>
          <Badge 
            variant="outline" 
            className={result.safe ? 'bg-green-500/20 text-green-400 border-green-500/50' : 'bg-red-500/20 text-red-400 border-red-500/50'}
          >
            {result.safe ? 'Safe' : 'Vulnerabilities Found'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Security Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-300">Security Score</h4>
            <span className={`text-2xl font-bold ${getScoreColor(result.score)}`}>
              {result.score}/100
            </span>
          </div>
          <Progress value={result.score} className="h-2">
            <div 
              className={`h-full ${getScoreBarColor(result.score)} transition-all`}
              style={{ width: `${result.score}%` }}
            />
          </Progress>
        </div>

        {/* Summary */}
        <Alert className={result.safe ? 'bg-green-500/10 border-green-500/50' : 'bg-orange-500/10 border-orange-500/50'}>
          <Shield className={`h-4 w-4 ${result.safe ? 'text-green-400' : 'text-orange-400'}`} />
          <AlertTitle>{result.safe ? 'Code is secure' : 'Security concerns detected'}</AlertTitle>
          <AlertDescription className="text-gray-300 mt-1">
            {result.summary}
          </AlertDescription>
        </Alert>

        {/* Issue Counts */}
        {result.totalIssues > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {result.criticalCount > 0 && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
                <div className="text-2xl font-bold text-red-400">{result.criticalCount}</div>
                <div className="text-xs text-red-400">Critical</div>
              </div>
            )}
            {result.highCount > 0 && (
              <div className="bg-orange-500/10 border border-orange-500/50 rounded-lg p-3">
                <div className="text-2xl font-bold text-orange-400">{result.highCount}</div>
                <div className="text-xs text-orange-400">High</div>
              </div>
            )}
            {result.mediumCount > 0 && (
              <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-3">
                <div className="text-2xl font-bold text-yellow-400">{result.mediumCount}</div>
                <div className="text-xs text-yellow-400">Medium</div>
              </div>
            )}
            {result.lowCount > 0 && (
              <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-3">
                <div className="text-2xl font-bold text-blue-400">{result.lowCount}</div>
                <div className="text-xs text-blue-400">Low</div>
              </div>
            )}
          </div>
        )}

        {/* Vulnerabilities List */}
        {result.vulnerabilities.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-300">Detected Vulnerabilities</h4>
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              {result.vulnerabilities.map((vuln: SecurityVulnerability) => (
                <Card key={vuln.id} className="bg-gray-900/50 border-gray-700">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-2">
                        <div className={`mt-0.5 ${getSeverityColor(vuln.severity).split(' ')[1]}`}>
                          {getSeverityIcon(vuln.severity)}
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-100">{vuln.title}</h5>
                          <p className="text-xs text-gray-400 mt-1">{vuln.category}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className={getSeverityColor(vuln.severity)}>
                        {vuln.severity}
                      </Badge>
                    </div>

                    <p className="text-sm text-gray-300">{vuln.description}</p>

                    {vuln.location && (
                      <div className="text-xs text-gray-400">
                        <span className="font-medium">Location:</span> {vuln.location}
                      </div>
                    )}

                    {(vuln.cwe || vuln.owasp) && (
                      <div className="flex gap-2">
                        {vuln.cwe && (
                          <Badge variant="outline" className="text-xs">
                            {vuln.cwe}
                          </Badge>
                        )}
                        {vuln.owasp && (
                          <Badge variant="outline" className="text-xs">
                            {vuln.owasp}
                          </Badge>
                        )}
                      </div>
                    )}

                    {vuln.codeSnippet && (
                      <pre className="bg-gray-950 border border-gray-800 rounded p-2 text-xs overflow-x-auto">
                        <code className="text-red-400">{vuln.codeSnippet}</code>
                      </pre>
                    )}

                    <Alert className="bg-blue-500/5 border-blue-500/20">
                      <Info className="h-3 w-3 text-blue-400" />
                      <AlertDescription className="text-xs text-gray-300">
                        <span className="font-medium text-blue-400">Recommendation:</span> {vuln.recommendation}
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
