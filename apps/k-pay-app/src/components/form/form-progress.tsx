import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CircularProgressBar from '../svgs/circular-progress-bar';
interface FormProgressProps {
  steps?: number;
  currentStep?: number;
  title?: string;
}

export function FormProgress({ steps, currentStep, title }: FormProgressProps) {
  const completion = (currentStep / steps) * 100;

  return (
    <View style={styles.row} className="flex items-center align-middle">
      <View style={styles.textContainer}>
        <Text style={styles.stepText}>
          STEP {currentStep}/{steps}
        </Text>
        <Text style={styles.title}>{title}</Text>
      </View>

      <CircularProgressBar percentage={completion} size={30} strokeWidth={3} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  textContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  stepText: {
    fontSize: 12,
    color: '#6C727F',
    marginTop: 15,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
});
