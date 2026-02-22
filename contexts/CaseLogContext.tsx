import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { CaseLog, ACGMERequirement } from '@/types/anesthesia';
import { acgmeRequirements as defaultRequirements } from '@/mocks/acgmeRequirements';

const CASES_KEY = 'anesthesia_case_logs';
const REQUIREMENTS_KEY = 'anesthesia_acgme_requirements';

export const [CaseLogProvider, useCaseLogs] = createContextHook(() => {
  const queryClient = useQueryClient();
  const [cases, setCases] = useState<CaseLog[]>([]);
  const [requirements, setRequirements] = useState<ACGMERequirement[]>(defaultRequirements);

  const casesQuery = useQuery({
    queryKey: ['caseLogs'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(CASES_KEY);
      return stored ? JSON.parse(stored) as CaseLog[] : [];
    },
  });

  const requirementsQuery = useQuery({
    queryKey: ['acgmeRequirements'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(REQUIREMENTS_KEY);
      return stored ? JSON.parse(stored) as ACGMERequirement[] : defaultRequirements;
    },
  });

  useEffect(() => {
    if (casesQuery.data) {
      setCases(casesQuery.data);
    }
  }, [casesQuery.data]);

  useEffect(() => {
    if (requirementsQuery.data) {
      setRequirements(requirementsQuery.data);
    }
  }, [requirementsQuery.data]);

  const saveCasesMutation = useMutation({
    mutationFn: async (updatedCases: CaseLog[]) => {
      await AsyncStorage.setItem(CASES_KEY, JSON.stringify(updatedCases));
      return updatedCases;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['caseLogs'] });
    },
  });

  const saveRequirementsMutation = useMutation({
    mutationFn: async (updatedReqs: ACGMERequirement[]) => {
      await AsyncStorage.setItem(REQUIREMENTS_KEY, JSON.stringify(updatedReqs));
      return updatedReqs;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['acgmeRequirements'] });
    },
  });

  const addCase = useCallback((newCase: CaseLog) => {
    const updated = [newCase, ...cases];
    setCases(updated);
    saveCasesMutation.mutate(updated);

    const updatedReqs = requirements.map(req => {
      if (newCase.acgmeCategory === req.subcategory) {
        return { ...req, completed: req.completed + 1 };
      }
      if (req.subcategory === 'Total Cases') {
        return { ...req, completed: req.completed + 1 };
      }
      return req;
    });
    setRequirements(updatedReqs);
    saveRequirementsMutation.mutate(updatedReqs);
  }, [cases, requirements, saveCasesMutation, saveRequirementsMutation]);

  const deleteCase = useCallback((id: string) => {
    const updated = cases.filter(c => c.id !== id);
    setCases(updated);
    saveCasesMutation.mutate(updated);
  }, [cases, saveCasesMutation]);

  const totalCases = cases.length;
  const isLoading = casesQuery.isLoading || requirementsQuery.isLoading;

  return { cases, requirements, addCase, deleteCase, totalCases, isLoading };
});

export function useFilteredCases(category?: string) {
  const { cases } = useCaseLogs();
  return useMemo(() => {
    if (!category) return cases;
    return cases.filter(c => c.acgmeCategory === category);
  }, [cases, category]);
}
