import React from 'react';
import { StyleSheet, View, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Screen, Container, Text } from '@/shared/components';
import { Navigators } from '@/navigation/constants';
import { spacing, shape, shadow } from '@/theme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - spacing['2xl'] * 2 - spacing.lg) / 2;

type Role = 'parent' | 'child';

interface RoleCardProps {
  role: Role;
  title: string;
  subtitle: string;
  emoji: string;
  color: string;
  onPress: () => void;
}

const RoleCard: React.FC<RoleCardProps> = ({
  title,
  subtitle,
  emoji,
  color,
  onPress,
}) => (
  <TouchableOpacity
    style={[styles.card, { backgroundColor: color }]}
    onPress={onPress}
    activeOpacity={0.85}
  >
    <View style={styles.emojiContainer}>
      <Text style={styles.emoji}>{emoji}</Text>
    </View>
    <Text variant="titleLarge" style={styles.cardTitle}>
      {title}
    </Text>
    <Text variant="bodySmall" color="textSecondary" style={styles.cardSubtitle}>
      {subtitle}
    </Text>
  </TouchableOpacity>
);

export const RoleSelectionScreen = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const navigation = useNavigation<any>();

  const handleSelectRole = (_role: Role) => {
    // Keep the role in the navigation boundary for now. It can be replaced by
    // the authenticated user profile once the auth API is connected.
    navigation.reset({
      index: 0,
      routes: [{ name: Navigators.Main, params: { role: _role } }],
    });
  };

  return (
    <Screen safeArea>
      <Container style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text variant="displaySmall" align="center" style={styles.heading}>
            Bạn là ai?
          </Text>
          <Text
            variant="bodyMedium"
            color="textSecondary"
            align="center"
            style={styles.subtitle}
          >
            Bạn là phụ huynh hay trẻ em?
          </Text>
        </View>

        {/* Role Cards */}
        <View style={styles.cardsRow}>
          <RoleCard
            role="parent"
            title="Phụ huynh"
            subtitle="Quản lý, theo dõi tiến độ học tập của con"
            emoji="👨‍👩‍👧"
            color="#8197FF"
            onPress={() => handleSelectRole('parent')}
          />
          <RoleCard
            role="child"
            title="Trẻ em"
            subtitle="Vào học, chăm pet và nhận thưởng mỗi ngày"
            emoji="🧒"
            color="#D9F58C"
            onPress={() => handleSelectRole('child')}
          />
        </View>

        {/* Footer note */}
        <View style={styles.footer}>
          <Text variant="bodySmall" color="textSecondary" align="center">
            Bạn có thể chuyển tài khoản bất kỳ lúc nào.
          </Text>
        </View>
      </Container>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing['2xl'],
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing['3xl'] ?? spacing['2xl'] * 1.5,
  },
  subtitle: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  cardsRow: {
    flexDirection: 'row',
    gap: spacing.lg,
    justifyContent: 'center',
  },
  card: {
    width: CARD_WIDTH,
    minHeight: CARD_WIDTH * 1.3,
    borderRadius: shape.card,
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.card,
  },
  emojiContainer: {
    marginBottom: spacing.md,
  },
  emoji: {
    fontSize: 48,
  },
  cardTitle: {
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  heading: {
    color: '#102980',
  },
  cardSubtitle: {
    textAlign: 'center',
    lineHeight: 18,
  },
  footer: {
    marginTop: spacing['2xl'],
    paddingHorizontal: spacing.xl,
  },
});
