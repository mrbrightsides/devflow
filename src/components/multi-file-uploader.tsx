'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileCode2, Upload, X, FolderOpen } from 'lucide-react';
import { toast } from 'sonner';

export interface UploadedFile {
  id: string;
  name: string;
  content: string;
  language: string;
  size: number;
}

interface MultiFileUploaderProps {
  onFilesChange: (files: UploadedFile[]) => void;
  maxFiles?: number;
}

export function MultiFileUploader({ onFilesChange, maxFiles = 5 }: MultiFileUploaderProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const detectLanguage = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase();
    const langMap: Record<string, string> = {
      'py': 'python',
      'js': 'javascript',
      'ts': 'typescript',
      'jsx': 'javascript',
      'tsx': 'typescript',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'c',
      'h': 'cpp',
      'cs': 'csharp',
      'go': 'go',
      'rb': 'ruby',
      'php': 'php',
      'rs': 'rust',
    };
    return langMap[ext || ''] || 'text';
  };

  const handleFileRead = useCallback((file: File) => {
    if (files.length >= maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const newFile: UploadedFile = {
        id: `${Date.now()}-${file.name}`,
        name: file.name,
        content,
        language: detectLanguage(file.name),
        size: file.size,
      };

      const updatedFiles = [...files, newFile];
      setFiles(updatedFiles);
      onFilesChange(updatedFiles);
      
      toast.success('File uploaded', {
        description: file.name,
      });
    };
    reader.readAsText(file);
  }, [files, maxFiles, onFilesChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    droppedFiles.forEach(handleFileRead);
  }, [handleFileRead]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    selectedFiles.forEach(handleFileRead);
  };

  const removeFile = (id: string) => {
    const updatedFiles = files.filter(f => f.id !== id);
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
    toast.info('File removed');
  };

  const clearAll = () => {
    setFiles([]);
    onFilesChange([]);
    toast.info('All files cleared');
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <FolderOpen className="h-5 w-5 text-purple-400" />
              Multi-File Upload
            </CardTitle>
            <CardDescription>
              Upload multiple files for context-aware analysis (max {maxFiles} files)
            </CardDescription>
          </div>
          {files.length > 0 && (
            <Button
              onClick={clearAll}
              variant="outline"
              size="sm"
              className="border-gray-700"
            >
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Drop Zone */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
            isDragging
              ? 'border-blue-500 bg-blue-500/10'
              : 'border-gray-700 hover:border-gray-600'
          }`}
        >
          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-500" />
          <p className="text-sm text-gray-400 mb-2">
            Drag and drop files here, or click to browse
          </p>
          <label className="cursor-pointer">
            <span className="text-sm text-blue-400 hover:text-blue-300">
              Browse Files
            </span>
            <input
              type="file"
              multiple
              accept=".py,.js,.ts,.jsx,.tsx,.java,.cpp,.c,.h,.cs,.go,.rb,.php,.rs,.txt"
              onChange={handleFileInput}
              className="hidden"
            />
          </label>
          <p className="text-xs text-gray-600 mt-2">
            Supported: Python, JavaScript, TypeScript, Java, C++, and more
          </p>
        </div>

        {/* Uploaded Files List */}
        {files.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-400">
              Uploaded Files ({files.length}/{maxFiles})
            </h4>
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 bg-gray-900 rounded-lg border border-gray-700"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <FileCode2 className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-300 truncate">{file.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {file.language}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {(file.size / 1024).toFixed(1)} KB
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => removeFile(file.id)}
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-red-400"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
