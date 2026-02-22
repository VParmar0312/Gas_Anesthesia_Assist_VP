import React, { useRef, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet, Animated, Platform } from 'react-native';
import { Check } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';

interface ChecklistToggleProps {
  label: string;
  description?: string;
  completed: boolean;
  onToggle: () => void;
}

export default React.memo(function ChecklistToggle({
  label,
  description,
  completed,
  onToggle,
}: ChecklistToggleProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.95, duration: 50, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
    onToggle();
  }, [onToggle, scaleAnim]);

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        style={[styles.container, completed && styles.containerCompleted]}
        onPress={handlePress}
        testID={`checklist-toggle-${label}`}
      >
        <View style={[styles.checkbox, completed && styles.checkboxCompleted]}>
          {completed && <Check size={16} color={Colors.textInverse} strokeWidth={3} />}
        </View>
        <View style={styles.content}>
          <Text style={[styles.label, completed && styles.labelCompleted]}>{label}</Text>
          {description && (
            <Text style={[styles.description, completed && styles.descriptionCompleted]}>
              {description}
            </Text>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  containerCompleted: {
    backgroundColor: Colors.accentMuted,
    borderColor: Colors.accentDim,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.textTertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  checkboxCompleted: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  content: {
    flex: 1,
  },
  label: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '600' as const,
  },
  labelCompleted: {
    color: Colors.accent,
  },
  description: {
    color: Colors.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
  descriptionCompleted: {
    color: Colors.accentDim,
  },
});
