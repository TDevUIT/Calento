'use client';

import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { aiService } from '@/service/ai.service';
import { FunctionExecutionRequest, FunctionExecutionResponse } from '@/interface/ai.interface';
import { toast } from 'sonner';

export const useExecuteFunction = (): UseMutationResult<FunctionExecutionResponse, Error, FunctionExecutionRequest> => {
  return useMutation({
    mutationFn: (data: FunctionExecutionRequest) => aiService.executeFunction(data),
    onSuccess: (response) => {
      toast.success('Function executed successfully', {
        description: `Completed in ${response.data.execution_time}ms`,
      });
    },
    onError: (error: Error) => {
      toast.error('Function execution failed', {
        description: error.message,
      });
    },
  });
};
