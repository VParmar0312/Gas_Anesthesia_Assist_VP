import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useCallback } from 'react';
import { ChecklistItem } from '@/types/anesthesia';

const CHECKLIST_KEY = 'anesthesia_checklist_state';

const defaultMSMAIDS: ChecklistItem[] = [
  { id: 'm', label: 'Machine', description: 'Anesthesia machine checkout complete', completed: false },
  { id: 's1', label: 'Suction', description: 'Suction tested and functional', completed: false },
  { id: 'mo', label: 'Monitors', description: 'All monitors connected and calibrated', completed: false },
  { id: 'a', label: 'Airway', description: 'Airway equipment ready and backup available', completed: false },
  { id: 'i', label: 'IV', description: 'IV access and fluids prepared', completed: false },
  { id: 'd', label: 'Drugs', description: 'All induction/emergency drugs drawn and labeled', completed: false },
  { id: 's2', label: 'Special', description: 'Special equipment for case prepared', completed: false },
];

const defaultEmergencyDrugs: ChecklistItem[] = [
  { id: 'epi', label: 'Epinephrine', description: '10 mcg/mL drawn and labeled', completed: false },
  { id: 'eph', label: 'Ephedrine', description: '5 mg/mL drawn and labeled', completed: false },
  { id: 'phe', label: 'Phenylephrine', description: '100 mcg/mL drawn and labeled', completed: false },
  { id: 'sux', label: 'Succinylcholine', description: '20 mg/mL drawn and labeled', completed: false },
  { id: 'atr', label: 'Atropine', description: '0.4 mg/mL drawn and labeled', completed: false },
];

export const [ChecklistProvider, useChecklist] = createContextHook(() => {
  const queryClient = useQueryClient();
  const [msmaids, setMsmaids] = useState<ChecklistItem[]>(defaultMSMAIDS);
  const [emergencyDrugs, setEmergencyDrugs] = useState<ChecklistItem[]>(defaultEmergencyDrugs);

  const checklistQuery = useQuery({
    queryKey: ['checklistState'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(CHECKLIST_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed as { msmaids: ChecklistItem[]; emergencyDrugs: ChecklistItem[] };
      }
      return { msmaids: defaultMSMAIDS, emergencyDrugs: defaultEmergencyDrugs };
    },
  });

  useEffect(() => {
    if (checklistQuery.data) {
      setMsmaids(checklistQuery.data.msmaids);
      setEmergencyDrugs(checklistQuery.data.emergencyDrugs);
    }
  }, [checklistQuery.data]);

  const saveMutation = useMutation({
    mutationFn: async (data: { msmaids: ChecklistItem[]; emergencyDrugs: ChecklistItem[] }) => {
      await AsyncStorage.setItem(CHECKLIST_KEY, JSON.stringify(data));
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checklistState'] });
    },
  });

  const toggleMSMAIDS = useCallback((id: string) => {
    const updated = msmaids.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setMsmaids(updated);
    saveMutation.mutate({ msmaids: updated, emergencyDrugs });
  }, [msmaids, emergencyDrugs, saveMutation]);

  const toggleEmergencyDrug = useCallback((id: string) => {
    const updated = emergencyDrugs.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setEmergencyDrugs(updated);
    saveMutation.mutate({ msmaids, emergencyDrugs: updated });
  }, [msmaids, emergencyDrugs, saveMutation]);

  const resetAll = useCallback(() => {
    setMsmaids(defaultMSMAIDS);
    setEmergencyDrugs(defaultEmergencyDrugs);
    saveMutation.mutate({ msmaids: defaultMSMAIDS, emergencyDrugs: defaultEmergencyDrugs });
  }, [saveMutation]);

  const msmaidsDone = msmaids.every(i => i.completed);
  const emergencyDrugsDone = emergencyDrugs.every(i => i.completed);
  const allComplete = msmaidsDone && emergencyDrugsDone;
  const msmaidsPct = msmaids.filter(i => i.completed).length / msmaids.length;
  const emergencyPct = emergencyDrugs.filter(i => i.completed).length / emergencyDrugs.length;

  return {
    msmaids,
    emergencyDrugs,
    toggleMSMAIDS,
    toggleEmergencyDrug,
    resetAll,
    msmaidsDone,
    emergencyDrugsDone,
    allComplete,
    msmaidsPct,
    emergencyPct,
    isLoading: checklistQuery.isLoading,
  };
});
