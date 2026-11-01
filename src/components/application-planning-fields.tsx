import { Text, TextInput } from 'react-native';
import { useApplicationStyles } from '@/hooks/use-application-styles';

export function ApplicationPlanningFields({ deadline, followUp, onDeadlineChange, onFollowUpChange, disabled }: {
  deadline: string; followUp: string; onDeadlineChange: (value: string) => void;
  onFollowUpChange: (value: string) => void; disabled: boolean;
}) {
  const styles = useApplicationStyles();
  return <>
    <Text style={styles.label}>Sista ansökningsdag (valfritt)</Text>
    <TextInput style={styles.input} placeholderTextColor={styles.label.color} placeholder="YYYY-MM-DD"
      accessibilityLabel="Sista ansökningsdag, YYYY-MM-DD" value={deadline} onChangeText={onDeadlineChange}
      editable={!disabled} maxLength={10} autoCorrect={false} autoCapitalize="none" />
    <Text style={styles.label}>Uppföljningsdatum (valfritt)</Text>
    <TextInput style={styles.input} placeholderTextColor={styles.label.color} placeholder="YYYY-MM-DD"
      accessibilityLabel="Uppföljningsdatum, YYYY-MM-DD" value={followUp} onChangeText={onFollowUpChange}
      editable={!disabled} maxLength={10} autoCorrect={false} autoCapitalize="none" />
    <Text style={styles.text}>Valfria datum för din planering. Töm fältet för att ta bort ett datum.</Text>
  </>;
}
